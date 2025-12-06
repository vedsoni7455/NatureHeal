import 'dotenv/config';

console.log('Environment Variables Check:');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? `Set (${process.env.GROQ_API_KEY.substring(0, 10)}...)` : 'NOT SET');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'NOT SET');
