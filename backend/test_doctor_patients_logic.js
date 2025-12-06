import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Appointment from './models/Appointment.js';
import DietPlan from './models/DietPlan.js';
import Symptom from './models/Symptom.js';

// Load environment variables
dotenv.config();

const testGetDoctorPatients = async (email) => {
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

        console.log(`👨‍⚕️ Testing logic for: ${doctor.name}`);

        // Simulate controller logic
        const matchQuery = {
            doctor: doctor._id,
            status: { $in: ['pending', 'confirmed'] } // type 'booked'
        };

        const appointments = await Appointment.find(matchQuery)
            .populate('patient', 'name email phone age gender')
            .select('patient symptoms doctorResponse status')
            .sort({ createdAt: -1 });

        console.log(`📅 Found ${appointments.length} raw appointments`);

        const patientMap = new Map();
        let skippedCount = 0;

        for (const appointment of appointments) {
            // Simulate the fix: skip if patient is null
            if (!appointment.patient) {
                console.log(`   ⚠️ Skipping appointment with missing patient (ID: ${appointment._id})`);
                skippedCount++;
                continue;
            }

            const patientId = appointment.patient._id.toString();
            if (!patientMap.has(patientId)) {
                patientMap.set(patientId, {
                    patient: appointment.patient,
                    appointment: appointment,
                });
            }
        }

        console.log(`\n✅ Successfully processed patients map`);
        console.log(`   Unique Patients: ${patientMap.size}`);
        console.log(`   Skipped Appointments: ${skippedCount}`);

        const patients = Array.from(patientMap.values());
        patients.forEach((p, index) => {
            console.log(`   ${index + 1}. ${p.patient.name} (${p.patient.email})`);
        });

        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');

    } catch (error) {
        console.error('❌ Error testing logic:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

const doctorEmail = 'alkabarbhaya5268@gmail.com';
testGetDoctorPatients(doctorEmail);
