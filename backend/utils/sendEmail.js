import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Check if email credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️ Email credentials not found in .env. Email simulation:');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use Gmail or configure host/port
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Healora App'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html, // Support HTML emails
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
