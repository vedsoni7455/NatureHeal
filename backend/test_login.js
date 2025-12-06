import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';

const testLogin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get email from command line argument
        const email = process.argv[2];

        if (!email) {
            console.log('Usage: node test_login.js <email>');
            process.exit(1);
        }

        console.log(`\nSearching for user: ${email}`);

        // Find user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('❌ User not found in database');
            console.log('\nAvailable users:');
            const allUsers = await User.find({}).select('email role');
            allUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`));
        } else {
            console.log('✅ User found!');
            console.log(`   Name: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Has password: ${user.password ? 'Yes' : 'No'}`);
            console.log(`   Password hash length: ${user.password ? user.password.length : 0}`);

            // Test password matching
            if (process.argv[3]) {
                const testPassword = process.argv[3];
                console.log(`\nTesting password: ${testPassword}`);
                const isMatch = await user.matchPassword(testPassword);
                console.log(`Password match: ${isMatch ? '✅ YES' : '❌ NO'}`);
            }
        }

        await mongoose.connection.close();
        console.log('\n✅ Connection closed');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testLogin();
