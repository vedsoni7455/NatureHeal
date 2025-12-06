import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

dotenv.config();

const checkAvailability = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'alkabarbhaya5268@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ Doctor User not found');
            return;
        }

        const doctor = await Doctor.findOne({ user: user._id });
        if (!doctor) {
            console.log('❌ Doctor Profile not found for user ID:', user._id);
            return;
        }

        console.log(`👨‍⚕️ Checking availability for: ${user.name}`);
        console.log(`   Doctor ID: ${doctor._id}`);

        if (!doctor.availability || doctor.availability.length === 0) {
            console.log('❌ No availability set!');
        } else {
            console.log('✅ Availability found:');
            doctor.availability.forEach(slot => {
                console.log(`   - ${slot.day}: ${slot.startTime} - ${slot.endTime} (Slots: ${slot.slots.length})`);
            });
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkAvailability();
