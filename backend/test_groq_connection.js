import 'dotenv/config';
import Groq from 'groq-sdk';

const testGroq = async () => {
    console.log('Testing Groq Connection...');

    if (!process.env.GROQ_API_KEY) {
        console.error('❌ GROQ_API_KEY is missing in .env');
        return;
    }

    console.log('GROQ_API_KEY Status: Set');
    console.log('Key Length:', process.env.GROQ_API_KEY.length);
    console.log('Key Prefix:', process.env.GROQ_API_KEY.substring(0, 4));
    console.log('Key contains whitespace:', /\s/.test(process.env.GROQ_API_KEY));

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'user', content: 'Hello' }
            ],
            model: 'llama-3.3-70b-versatile',
        });

        console.log('✅ Groq Connection Successful!');
        console.log('Response:', completion.choices[0]?.message?.content);
    } catch (error) {
        console.error('❌ Groq Connection Failed!');
        console.error('Error:', error);
    }
};

testGroq();
