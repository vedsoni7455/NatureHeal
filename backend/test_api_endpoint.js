import fetch from 'node-fetch';

const testEndpoint = async () => {
    console.log('Testing API Endpoint: http://localhost:5000/api/ai/chat');

    try {
        const response = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Hello, this is a test message to debug the error.',
                sessionId: 'debug-session-123'
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();

        if (data.error) {
            console.log('❌ Error Response:', JSON.stringify(data, null, 2));
        } else {
            console.log('✅ Success Response:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Request Failed:', error);
    }
};

testEndpoint();
