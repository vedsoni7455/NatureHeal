import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Appointment from './models/Appointment.js';

// Load environment variables
dotenv.config();

const testDoctorSlots = async (email, testDate) => {
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

        console.log(`👨‍⚕️ Testing slots for: ${doctor.name}`);
        console.log(`📅 Date: ${testDate}\n`);

        const doctorDetails = await Doctor.findOne({ user: doctor._id });
        if (!doctorDetails) {
            console.log(`❌ No doctor details found`);
            await mongoose.connection.close();
            return;
        }

        // Get day of week
        const dayOfWeek = new Date(testDate).toLocaleDateString('en-US', { weekday: 'long' });
        console.log(`📆 Day of week: ${dayOfWeek}`);

        const dayAvailability = doctorDetails.availability.find(d => d.day === dayOfWeek);

        if (!dayAvailability || !dayAvailability.isAvailable) {
            console.log(`❌ Doctor not available on ${dayOfWeek}\n`);
            await mongoose.connection.close();
            return;
        }

        console.log(`✅ Doctor is available: ${dayAvailability.startTime} - ${dayAvailability.endTime}\n`);

        // Generate all 30-min slots
        const slots = [];
        let currentTime = new Date(`${testDate}T${dayAvailability.startTime}`);
        const endTime = new Date(`${testDate}T${dayAvailability.endTime}`);

        while (currentTime < endTime) {
            const timeString = currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            slots.push(timeString);
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }

        console.log(`🕐 Generated ${slots.length} time slots:`);
        slots.forEach((slot, index) => {
            console.log(`   ${index + 1}. ${slot}`);
        });

        // Check for booked appointments
        const startOfDay = new Date(testDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(testDate);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            doctor: doctor._id,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['pending', 'confirmed'] }
        });

        console.log(`\n📋 Booked appointments: ${appointments.length}`);
        if (appointments.length > 0) {
            appointments.forEach(apt => {
                console.log(`   - ${apt.time}`);
            });
        }

        const bookedTimes = appointments.map(apt => apt.time);
        const availableSlots = slots.filter(slot => !bookedTimes.includes(slot));

        console.log(`\n✅ Available slots: ${availableSlots.length}`);
        availableSlots.forEach((slot, index) => {
            console.log(`   ${index + 1}. ${slot}`);
        });

        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');

    } catch (error) {
        console.error('❌ Error testing slots:', error.message);
        console.error(error.stack);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

// Test with tomorrow's date (Monday)
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const testDate = tomorrow.toISOString().split('T')[0];

console.log('🧪 Testing Doctor Slot Generation\n');
testDoctorSlots('alkabarbhaya5268@gmail.com', testDate);
