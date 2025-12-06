import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

// Load environment variables
dotenv.config();

const verifyDoctorRemoval = async (email) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        // Try to find the doctor user by email
        const doctorUser = await User.findOne({ email, role: 'doctor' });

        if (doctorUser) {
            console.log(`❌ FAILED: Doctor still exists in database`);
            console.log(`   Name: ${doctorUser.name}`);
            console.log(`   Email: ${doctorUser.email}`);
        } else {
            console.log(`✅ SUCCESS: Doctor with email "${email}" has been removed from User collection`);
        }

        // Check Doctor collection
        const allDoctorRecords = await Doctor.find({}).populate('user', 'email');
        const matchingDoctorRecord = allDoctorRecords.find(d => d.user?.email === email);

        if (matchingDoctorRecord) {
            console.log(`❌ FAILED: Doctor details still exist in Doctor collection`);
        } else {
            console.log(`✅ SUCCESS: No doctor details found in Doctor collection for this email`);
        }

        // List all remaining doctors
        const allDoctors = await User.find({ role: 'doctor' }).select('name email specialization');
        console.log(`\n📋 Remaining doctors in system: ${allDoctors.length}`);
        allDoctors.forEach((doc, index) => {
            console.log(`   ${index + 1}. ${doc.name} (${doc.email}) - ${doc.specialization || 'N/A'}`);
        });

        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');

    } catch (error) {
        console.error('❌ Error verifying removal:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

// Execute verification
const emailToVerify = 'alkabarbhaya@gmail.com';
console.log(`🔍 Verifying removal of: ${emailToVerify}\n`);
verifyDoctorRemoval(emailToVerify);
