import asyncHandler from 'express-async-handler';
import sendEmail from '../utils/sendEmail.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    // Email to admin/website owner
    const adminMessage = `
    You have a new contact form submission:
    
    Name: ${name}
    Email: ${email}
    Subject: ${subject}
    
    Message:
    ${message}
  `;

    try {
        await sendEmail({
            email: process.env.EMAIL_USER || 'admin@healora.com', // Fallback if not set, sending TO the admin
            subject: `New Contact Form: ${subject}`,
            message: adminMessage,
        }); // This sends email TO the configured user (which acts as admin) or we should likely send TO a specific admin email. 
        // Usually sendEmail takes 'email' as the recipient.
        // If EMAIL_USER is the sender, we might want to send it to EMAIL_USER as well (self-email) or a separate ADMIN_EMAIL.
        // For now, I'll assume sending to the EMAIL_USER (the owner) is the goal, or maybe the user wants a copy?
        // The request said "delivered to the email id of the website".
        // I will use EMAIL_USER as the recipient for now, assuming that's the "website email".

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500);
        throw new Error('Email could not be sent');
    }
});

export { submitContactForm };
