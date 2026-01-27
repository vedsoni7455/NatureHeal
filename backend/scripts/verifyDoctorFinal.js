import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import dns from 'dns';

dotenv.config();

const lookupMap = {
    'ac-qutnyvl-shard-00-00.bjagzuq.mongodb.net': '159.41.242.242',
    'ac-qutnyvl-shard-00-01.bjagzuq.mongodb.net': '159.41.242.249',
    'ac-qutnyvl-shard-00-02.bjagzuq.mongodb.net': '159.41.243.7',
};

const customLookup = (hostname, options, callback) => {
    if (lookupMap[hostname]) {
        console.log(`Custom lookup: ${hostname} -> ${lookupMap[hostname]}`);
        return callback(null, lookupMap[hostname], 4);
    }
    dns.lookup(hostname, options, callback);
};

const run = async () => {
    try {
        console.log('Connecting to MongoDB using manual IP mapping...');
        // We use the mongodb+srv URI but provide a custom lookup
        // mongoose will resolve the SRV first if it can, but here we might need to use the full mongodb:// URI
        // to be safe if SRV resolution is totally broken.

        // Let's try to construct the direct URI
        const auth = process.env.MONGO_URI.match(/\/\/(.*?)@/)[1];
        const directUri = `mongodb://${auth}@ac-qutnyvl-shard-00-00.bjagzuq.mongodb.net:27017,ac-qutnyvl-shard-00-01.bjagzuq.mongodb.net:27017,ac-qutnyvl-shard-00-02.bjagzuq.mongodb.net:27017/healora?authSource=admin&replicaSet=atlas-m0-1-shard-0&tls=true`;

        await mongoose.connect(directUri, {
            lookup: customLookup,
            serverSelectionTimeoutMS: 20000,
            connectTimeoutMS: 20000,
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
        user.specialization = 'Ayurvedic Doctor';
        await user.save();

        let doctorDetails = await Doctor.findOne({ user: user._id });
        if (!doctorDetails) {
            console.log('Creating doctor details...');
            doctorDetails = new Doctor({ user: user._id });
        }

        console.log('Updating doctor details...');
        doctorDetails.verificationStatus = 'Verified';
        doctorDetails.certificateImage = '/uploads/dr_bhavesh_certificate.jpg';
        doctorDetails.experience = 25;

        if (!doctorDetails.languages || doctorDetails.languages.length === 0) {
            doctorDetails.languages = ['English', 'Hindi', 'Gujarati'];
        }

        await doctorDetails.save();

        console.log('VERIFICATION SUCCESSFUL for', email);
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('FAILED:', error);
        process.exit(1);
    }
};

run();
