import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

// Load environment variables
dotenv.config();

const checkDoctorAvailability = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        // Get all doctors
        const doctors = await User.find({ role: 'doctor' }).select('name email');
        console.log(`📋 Found ${doctors.length} doctor(s)\n`);

        for (const doctor of doctors) {
            console.log(`\n👨‍⚕️ Doctor: ${doctor.name} (${doctor.email})`);
            console.log(`   ID: ${doctor._id}`);

            // Get doctor details
            const doctorDetails = await Doctor.findOne({ user: doctor._id });

            if (!doctorDetails) {
                console.log(`   ❌ No Doctor details record found`);
                continue;
            }

            console.log(`\n   Availability Schedule:`);
            if (!doctorDetails.availability || doctorDetails.availability.length === 0) {
                console.log(`   ❌ No availability set`);
            } else {
                doctorDetails.availability.forEach(slot => {
                    const status = slot.isAvailable ? '✅' : '❌';
                    const time = slot.startTime && slot.endTime ? `${slot.startTime} - ${slot.endTime}` : 'No times set';
                    console.log(`   ${status} ${slot.day}: ${time}`);
                });
            }

            console.log(`\n   Consultation Fee: $${doctorDetails.consultationFee || 0}`);
            console.log(`   Rating: ${doctorDetails.rating || 0}/5`);
            console.log(`   Bio: ${doctorDetails.bio || 'N/A'}`);
        }

        // Close database connection
        await mongoose.connection.close();
        console.log('\n\n🔌 Database connection closed');

    } catch (error) {
        console.error('❌ Error checking availability:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

console.log('🔍 Checking Doctor Availability Data\n');
checkDoctorAvailability();
