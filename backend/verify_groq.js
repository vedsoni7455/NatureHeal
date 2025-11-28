import https from 'https';

const apiKey = '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';
const data = JSON.stringify({
    messages: [{ role: 'user', content: 'hi' }],
    model: 'llama3-8b-8192'
});

const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(body);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.write(data);
req.end();
