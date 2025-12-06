import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const resetDoctorPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'alkabarbhaya5268@gmail.com';
        const newPassword = 'Doctor@123';

        const doctor = await User.findOne({ email });
        if (!doctor) {
            console.log('❌ Doctor not found');
            return;
        }

        // Set plain text password. Pre-save hook will hash it.
        doctor.password = newPassword;
        await doctor.save();

        console.log(`✅ Password reset successfully for ${email}`);
        console.log(`🔑 New Password: ${newPassword}`);

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetDoctorPassword();
