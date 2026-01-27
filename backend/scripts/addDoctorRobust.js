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

        console.log('Shards found:', shardsWithIps);

        // Get original URI and replace hostname with first IP (simplified for script)
        // Actually, Atlas usually needs the shard names for SSL validation to work properly if not using IPs.
        // If we use IPs, we might need tlsInsecure: true.

        // Instead of using IPs in URI, we will use a custom dns.lookup function in the mongoose connection options!

        const lookupMap = {};
        shardsWithIps.forEach(s => {
            lookupMap[s.hostname] = s.ip;
        });

        const customLookup = (hostname, options, callback) => {
            if (lookupMap[hostname]) {
                console.log(`Custom lookup: ${hostname} -> ${lookupMap[hostname]}`);
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

        const email = 'drbhavesh@natureheal.com';
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Doctor already exists, updating specialization...');
            existingUser.specialization = 'Ayurvedic Doctor';
            existingUser.isVerified = true;
            await existingUser.save();

            let doctorDetails = await Doctor.findOne({ user: existingUser._id });
            if (doctorDetails) {
                doctorDetails.certificateImage = '/uploads/dr_bhavesh_certificate.jpg';
                doctorDetails.verificationStatus = 'Verified';
                await doctorDetails.save();
            }
        } else {
            const user = await User.create({
                name: 'Dr. Bhavesh Mehta',
                email: email,
                password: 'password123',
                role: 'doctor',
                specialization: 'Ayurvedic Doctor',
                experience: 15,
                phone: '+91 9876543210',
                isVerified: true
            });
            console.log(`User created: ${user._id}`);

            await Doctor.create({
                user: user._id,
                bio: 'Dr. Bhavesh Mehta is a highly experienced Ayurvedic physician specializing in chronic lifestyle disorders.',
                consultationFee: 500,
                languages: ['English', 'Hindi', 'Gujarati'],
                certificateImage: '/uploads/dr_bhavesh_certificate.jpg',
                availability: [
                    { day: 'Monday', isAvailable: true, startTime: '09:00', endTime: '13:00' },
                    { day: 'Tuesday', isAvailable: true, startTime: '09:00', endTime: '13:00' },
                    { day: 'Wednesday', isAvailable: true, startTime: '09:00', endTime: '13:00' },
                    { day: 'Thursday', isAvailable: true, startTime: '09:00', endTime: '13:00' },
                    { day: 'Friday', isAvailable: true, startTime: '09:00', endTime: '13:00' },
                    { day: 'Saturday', isAvailable: true, startTime: '10:00', endTime: '14:00' }
                ],
                verificationStatus: 'Verified'
            });
            console.log('Doctor details created with certificate.');
        }

        console.log('Operation completed!');
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('FAILED:', error);
        process.exit(1);
    }
};

run();
