import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const getDoctorId = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'alkabarbhaya5268@gmail.com';
        const user = await User.findOne({ email });
        if (user) {
            console.log(`USER ID: ${user._id}`);
        } else {
            console.log('User not found');
        }
        await mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
};

getDoctorId();
