import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Appointment from './models/Appointment.js';

// Load environment variables
dotenv.config();

const removeDoctorByEmail = async (email) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find the doctor user by email
        const doctorUser = await User.findOne({ email, role: 'doctor' }).select('+password');

        if (!doctorUser) {
            console.log(`❌ No doctor found with email: ${email}`);
            await mongoose.connection.close();
            return;
        }

        console.log(`\n📋 Found doctor:`);
        console.log(`   Name: ${doctorUser.name}`);
        console.log(`   Email: ${doctorUser.email}`);
        console.log(`   Role: ${doctorUser.role}`);
        console.log(`   Specialization: ${doctorUser.specialization || 'N/A'}`);
        console.log(`   ID: ${doctorUser._id}`);

        // Check for associated appointments
        const appointmentCount = await Appointment.countDocuments({ doctor: doctorUser._id });
        console.log(`\n📅 Associated appointments: ${appointmentCount}`);

        // Delete associated Doctor record
        const doctorDetails = await Doctor.findOne({ user: doctorUser._id });
        if (doctorDetails) {
            await Doctor.deleteOne({ user: doctorUser._id });
            console.log(`✅ Deleted Doctor details record`);
        } else {
            console.log(`ℹ️  No Doctor details record found`);
        }

        // Delete the User record
        await User.deleteOne({ _id: doctorUser._id });
        console.log(`✅ Deleted User record`);

        console.log(`\n✅ Successfully removed doctor: ${doctorUser.name} (${email})`);
        console.log(`\nNote: ${appointmentCount} appointment(s) remain in the system for historical records.`);

        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');

    } catch (error) {
        console.error('❌ Error removing doctor:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

// Execute the removal
const emailToRemove = 'alkabarbhaya@gmail.com';
console.log(`\n🗑️  Starting removal process for: ${emailToRemove}\n`);
removeDoctorByEmail(emailToRemove);
