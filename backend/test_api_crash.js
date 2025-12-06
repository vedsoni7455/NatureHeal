import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Appointment from './models/Appointment.js';
import DietPlan from './models/DietPlan.js';
import Symptom from './models/Symptom.js';

// Load environment variables
dotenv.config();

const testFullDoctorApiLogic = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        const doctor = await User.findOne({ email, role: 'doctor' });
        if (!doctor) {
            console.log(`❌ Doctor not found: ${email}`);
            await mongoose.connection.close();
            return;
        }

        console.log(`👨‍⚕️ Testing logic for: ${doctor.name}`);

        // LOGIC START
        const matchQuery = {
            doctor: doctor._id,
            status: { $in: ['pending', 'confirmed'] }
        };

        const appointments = await Appointment.find(matchQuery)
            .populate('patient', 'name email phone age gender')
            .select('patient symptoms doctorResponse status')
            .sort({ createdAt: -1 });

        const patientMap = new Map();
        for (const appointment of appointments) {
            if (!appointment.patient) continue; // The fix I added

            const patientId = appointment.patient._id.toString();
            if (!patientMap.has(patientId)) {
                patientMap.set(patientId, {
                    patient: appointment.patient,
                    appointment: appointment,
                    symptoms: appointment.symptoms || [],
                    status: appointment.status
                });
            }
        }

        const patients = Array.from(patientMap.values());

        console.log(`Processing ${patients.length} patients...`);

        // The sub-query part likely to fail
        const patientsWithDetails = await Promise.all(
            patients.map(async (patientData) => {
                try {
                    const { patient, appointment, symptoms, status } = patientData;

                    // Get diet plans
                    const dietPlans = await DietPlan.find({ user: patient._id, isActive: true })
                        .select('title goals weeklyRoutine')
                        .sort({ createdAt: -1 })
                        .limit(1);

                    // Get symptom details
                    const symptomDetails = await Symptom.find({ name: { $in: symptoms } })
                        .select('name category severity');

                    return {
                        _id: patient._id,
                        name: patient.name,
                        appointmentStatus: status,
                        symptoms: symptomDetails,
                        dietPlans: dietPlans.length > 0 ? dietPlans[0] : null,
                        lastAppointment: appointment.createdAt
                    };
                } catch (err) {
                    console.error(`❌ Error processing patient ${patientData.patient.email}:`, err);
                    throw err;
                }
            })
        );
        // LOGIC END

        console.log(`\n✅ Success! Processed ${patientsWithDetails.length} patients.`);
        patientsWithDetails.forEach(p => {
            console.log(`   - ${p.name} (Symptoms: ${p.symptoms.length}, Status: ${p.appointmentStatus})`);
        });

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ GLOBAL API ERROR:', error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
    }
};

const doctorEmail = 'alkabarbhaya5268@gmail.com';
testFullDoctorApiLogic(doctorEmail);
