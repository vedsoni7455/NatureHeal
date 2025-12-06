import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';

const resetPassword = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get email and new password from command line
        const email = process.argv[2];
        const newPassword = process.argv[3];

        if (!email || !newPassword) {
            console.log('Usage: node reset_password.js <email> <new-password>');
            console.log('Example: node reset_password.js user@example.com newpassword123');
            process.exit(1);
        }

        console.log(`\nResetting password for: ${email}`);

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        console.log(`✅ User found: ${user.name}`);
        console.log(`   Role: ${user.role}`);

        // Update password (will be automatically hashed by the pre-save hook)
        user.password = newPassword;
        await user.save();

        console.log(`\n✅ Password successfully reset!`);
        console.log(`   Email: ${email}`);
        console.log(`   New Password: ${newPassword}`);
        console.log(`\n🔐 You can now login with these credentials.`);

        await mongoose.connection.close();
        console.log('\n✅ Connection closed');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

resetPassword();
