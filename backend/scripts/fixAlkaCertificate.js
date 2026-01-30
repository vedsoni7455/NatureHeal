import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

dotenv.config();

const run = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully!');

        // Find user by name
        const user = await User.findOne({ name: { $regex: 'Alka', $options: 'i' }, role: 'doctor' });

        if (!user) {
            console.error('Doctor Alka Barbhaya not found in User collection!');
            process.exit(1);
        }

        console.log(`Found Doctor: ${user.name} (${user.email})`);

        // Ensure user is verified
        user.isVerified = true;
        await user.save();
        console.log('User marked as verified.');

        let doctorDetails = await Doctor.findOne({ user: user._id });
        if (!doctorDetails) {
            console.log('Doctor details not found, creating new record...');
            doctorDetails = new Doctor({ user: user._id });
        }

        doctorDetails.certificateImage = '/uploads/alka_barbhaya_cert.png';
        doctorDetails.verificationStatus = 'Verified';

        // Add some default values if missing to ensure high quality profile
        if (!doctorDetails.experience) doctorDetails.experience = 10;
        if (!doctorDetails.languages || doctorDetails.languages.length === 0) {
            doctorDetails.languages = ['English', 'Hindi', 'Gujarati'];
        }

        await doctorDetails.save();
        console.log('Doctor certificate and status updated successfully!');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);

    } catch (error) {
        console.error('FAILED:', error);
        process.exit(1);
    }
};

run();
