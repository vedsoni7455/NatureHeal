import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Appointment from './models/Appointment.js';

// Load environment variables
dotenv.config();

const auditDoctors = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        // 1. Get all doctors
        const doctors = await User.find({ role: 'doctor' });
        console.log(`📋 Found ${doctors.length} doctor(s):`);

        for (const doctor of doctors) {
            console.log(`\n👨‍⚕️ Name: ${doctor.name}`);
            console.log(`   Email: ${doctor.email}`);
            console.log(`   ID: ${doctor._id}`);

            // Count appointments
            const totalAppts = await Appointment.countDocuments({ doctor: doctor._id });
            const pendingAppts = await Appointment.countDocuments({
                doctor: doctor._id,
                status: { $in: ['pending', 'confirmed'] }
            });

            console.log(`   Total Appointments: ${totalAppts}`);
            console.log(`   Active (Pending/Confirmed): ${pendingAppts}`);

            if (pendingAppts > 0) {
                const sample = await Appointment.findOne({
                    doctor: doctor._id,
                    status: { $in: ['pending', 'confirmed'] }
                }).populate('patient', 'name email');

                console.log(`   Sample Appointment:`);
                console.log(`     - Patient: ${sample.patient ? sample.patient.name : 'NULL'}`);
                console.log(`     - Status: ${sample.status}`);
                console.log(`     - Date: ${new Date(sample.date).toLocaleDateString()}`);
            }
        }

        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');

    } catch (error) {
        console.error('❌ Error auditing doctors:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

auditDoctors();
