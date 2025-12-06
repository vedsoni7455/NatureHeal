import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Appointment from './models/Appointment.js';

// Load environment variables
dotenv.config();

const checkDoctorAppointments = async (email) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        // Find the doctor
        const doctor = await User.findOne({ email, role: 'doctor' });
        if (!doctor) {
            console.log(`❌ Doctor not found: ${email}`);
            await mongoose.connection.close();
            return;
        }

        console.log(`👨‍⚕️ Checking appointments for: ${doctor.name} (${doctor.email})`);
        console.log(`   ID: ${doctor._id}\n`);

        // Find all appointments for this doctor
        const appointments = await Appointment.find({ doctor: doctor._id })
            .populate('patient', 'name email')
            .sort({ date: -1 });

        console.log(`📅 Total Appointments Found: ${appointments.length}`);

        if (appointments.length === 0) {
            console.log('   No appointments found.');
        } else {
            appointments.forEach((apt, index) => {
                console.log(`\n   ${index + 1}. Date: ${new Date(apt.date).toLocaleDateString()} Time: ${apt.time}`);
                console.log(`      Status: ${apt.status}`);
                if (apt.patient) {
                    console.log(`      Patient: ${apt.patient.name} (${apt.patient.email})`);
                } else {
                    console.log(`      Patient: ❌ NULL (Patient might be deleted)`);
                }
            });
        }

        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');

    } catch (error) {
        console.error('❌ Error checking appointments:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

// Check for the active doctor
const doctorEmail = 'alkabarbhaya5268@gmail.com';
checkDoctorAppointments(doctorEmail);
