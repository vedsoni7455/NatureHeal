import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Appointment from './models/Appointment.js';
import Doctor from './models/Doctor.js';

// Load environment variables
dotenv.config();

const createTestAppointment = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        // 1. Find the doctor
        const doctorEmail = 'alkabarbhaya5268@gmail.com';
        const doctor = await User.findOne({ email: doctorEmail, role: 'doctor' });
        if (!doctor) {
            console.log(`❌ Doctor not found: ${doctorEmail}`);
            process.exit(1);
        }
        console.log(`👨‍⚕️ Doctor: ${doctor.name}`);

        // 2. Find or create a patient
        const patientEmail = 'test.dashboard.patient@example.com';
        let patient = await User.findOne({ email: patientEmail });

        if (!patient) {
            console.log('creating new patient...');
            patient = await User.create({
                name: 'Test Dashboard Patient',
                email: patientEmail,
                password: 'password123',
                role: 'patient',
                phone: '1234567890'
            });
        }
        console.log(`👤 Patient: ${patient.name}`);

        // 3. Create Appointment
        // Use tomorrow's date at 10:00 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        const timeSlot = '10:00';

        const appointment = await Appointment.create({
            patient: patient._id,
            doctor: doctor._id,
            date: dateStr,
            time: timeSlot,
            type: 'video',
            status: 'pending', // Booked status
            symptoms: ['Headache', 'Fever']
        });

        console.log(`\n✅ Created Appointment:`);
        console.log(`   Date: ${dateStr}`);
        console.log(`   Time: ${timeSlot}`);
        console.log(`   ID: ${appointment._id}`);

        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');

    } catch (error) {
        console.error('❌ Error creating appointment:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

createTestAppointment();
