import dotenv from 'dotenv';
import sendEmail from './utils/sendEmail.js';

dotenv.config();

console.log('Testing Email Sending...');
console.log('User:', process.env.EMAIL_USER);
console.log('Pass:', process.env.EMAIL_PASS ? '****** (Exists)' : 'MISSING');

const testEmail = async () => {
    try {
        await sendEmail({
            email: process.env.EMAIL_USER, // Send to self
            subject: 'Test Email from Healora Debugger',
            message: 'If you received this, the email system is working correctly.',
            html: '<h1>Success!</h1><p>Email credentials are working.</p>'
        });
        console.log('✅ Email sent successfully!');
    } catch (error) {
        console.error('❌ Email failed:', error);
    }
};

testEmail();
