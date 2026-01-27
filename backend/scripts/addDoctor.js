import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

import dns from 'dns';
dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

const addDoctor = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'drbhavesh@natureheal.com';

        // Check if doctor already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Doctor with this email already exists');
            process.exit(0);
        }

        // Create User
        const user = await User.create({
            name: 'Dr. Bhavesh Mehta',
            email: email,
            password: 'password123', // Default password
            role: 'doctor',
            specialization: 'Ayurvedic Doctor',
            experience: 15,
            phone: '+91 9876543210',
            isVerified: true
        });

        console.log(`User created with ID: ${user._id}`);

        // Create Doctor Details
        const doctorDetails = await Doctor.create({
            user: user._id,
            bio: 'Dr. Bhavesh Mehta is a highly experienced Ayurvedic physician specializing in chronic lifestyle disorders and natural healing through Panchakarma and herbal remedies.',
            consultationFee: 500,
            languages: ['English', 'Hindi', 'Gujarati'],
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

        console.log(`Doctor details created with ID: ${doctorDetails._id}`);
        console.log('Dr. Bhavesh Mehta added successfully!');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error adding doctor:', error);
        process.exit(1);
    }
};

addDoctor();
