import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

// Load environment variables
dotenv.config();

const setDoctorAvailability = async (email) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        // Find the doctor user by email
        const doctorUser = await User.findOne({ email, role: 'doctor' });

        if (!doctorUser) {
            console.log(`❌ No doctor found with email: ${email}`);
            await mongoose.connection.close();
            return;
        }

        console.log(`👨‍⚕️ Found doctor: ${doctorUser.name} (${doctorUser.email})`);
        console.log(`   ID: ${doctorUser._id}\n`);

        // Define availability schedule
        // Sunday: Holiday (not available)
        // Monday - Friday: Half-day (9:00 AM - 1:00 PM)
        // Saturday: Full-day (9:00 AM - 5:00 PM)
        const availabilitySchedule = [
            {
                day: 'Monday',
                isAvailable: true,
                startTime: '09:00',
                endTime: '13:00'
            },
            {
                day: 'Tuesday',
                isAvailable: true,
                startTime: '09:00',
                endTime: '13:00'
            },
            {
                day: 'Wednesday',
                isAvailable: true,
                startTime: '09:00',
                endTime: '13:00'
            },
            {
                day: 'Thursday',
                isAvailable: true,
                startTime: '09:00',
                endTime: '13:00'
            },
            {
                day: 'Friday',
                isAvailable: true,
                startTime: '09:00',
                endTime: '13:00'
            },
            {
                day: 'Saturday',
                isAvailable: true,
                startTime: '09:00',
                endTime: '17:00'
            },
            {
                day: 'Sunday',
                isAvailable: false,
                startTime: '',
                endTime: ''
            }
        ];

        // Find or create doctor details
        let doctorDetails = await Doctor.findOne({ user: doctorUser._id });

        if (!doctorDetails) {
            console.log('Creating new Doctor details record...');
            doctorDetails = new Doctor({
                user: doctorUser._id,
                availability: availabilitySchedule
            });
        } else {
            console.log('Updating existing Doctor details record...');
            doctorDetails.availability = availabilitySchedule;
        }

        await doctorDetails.save();

        console.log('✅ Availability schedule set successfully!\n');
        console.log('📅 Schedule:');
        availabilitySchedule.forEach(slot => {
            const status = slot.isAvailable ? '✅' : '❌';
            const time = slot.isAvailable ? `${slot.startTime} - ${slot.endTime}` : 'Holiday';
            console.log(`   ${status} ${slot.day.padEnd(10)} : ${time}`);
        });

        console.log('\nℹ️  Note: Each appointment slot is 30 minutes');

        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');

    } catch (error) {
        console.error('❌ Error setting availability:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

// Execute for the doctor
const doctorEmail = 'alkabarbhaya5268@gmail.com';
console.log('⚙️  Setting up doctor availability\n');
setDoctorAvailability(doctorEmail);
