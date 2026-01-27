import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import dns from 'dns';
import { promisify } from 'util';

dotenv.config();

const resolveSrv = promisify(dns.resolveSrv);
const resolve4 = promisify(dns.resolve4);

dns.setServers(['8.8.8.8']);

const run = async () => {
    try {
        console.log('Resolving database shards...');
        const srvRecords = await resolveSrv('_mongodb._tcp.natureheal.bjagzuq.mongodb.net');

        const shardsWithIps = await Promise.all(srvRecords.map(async (record) => {
            const ips = await resolve4(record.name);
            return { hostname: record.name, ip: ips[0], port: record.port };
        }));

        const lookupMap = {};
        shardsWithIps.forEach(s => {
            lookupMap[s.hostname] = s.ip;
        });

        const customLookup = (hostname, options, callback) => {
            if (lookupMap[hostname]) {
                return callback(null, lookupMap[hostname], 4);
            }
            dns.lookup(hostname, options, callback);
        };

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            lookup: customLookup,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        });

        console.log('Connected successfully!');

        const email = 'drbhaveshmehta961@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email ${email} not found!`);
            process.exit(1);
        }

        console.log(`Updating User ${user._id} to verified...`);
        user.isVerified = true;
        // Also update specialization to match our filter if it's slightly different
        if (user.specialization === 'Ayurvedic') {
            user.specialization = 'Ayurvedic Doctor';
        }
        await user.save();

        let doctorDetails = await Doctor.findOne({ user: user._id });
        if (!doctorDetails) {
            console.log('Creating doctor details...');
            doctorDetails = new Doctor({ user: user._id });
        }

        console.log('Updating doctor details with certificate and verified status...');
        doctorDetails.certificateImage = '/uploads/dr_bhavesh_certificate.jpg';
        doctorDetails.verificationStatus = 'Verified';

        // Ensure some basic details if they are missing
        if (!doctorDetails.experience) doctorDetails.experience = 25; // From screenshot
        if (!doctorDetails.languages || doctorDetails.languages.length === 0) {
            doctorDetails.languages = ['English', 'Hindi', 'Gujarati'];
        }

        await doctorDetails.save();

        console.log('Verification completed successfully!');
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('FAILED:', error);
        process.exit(1);
    }
};

run();
