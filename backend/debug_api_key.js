import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_AI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Testing API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET'}`);
console.log(`URL: ${url.replace(apiKey, 'HIDDEN_KEY')}`);

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        try {
            const json = JSON.parse(data);
            if (res.statusCode === 200) {
                console.log('✅ API Key is working!');
                console.log('Available Models:');
                json.models.forEach(m => console.log(m.name));
            } else {
                console.log('❌ API Request Failed:');
                console.log(JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.log('Raw Output:', data);
        }
    });

}).on('error', (err) => {
    console.error('Network Error:', err.message);
});
