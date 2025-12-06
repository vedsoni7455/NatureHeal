import fetch from 'node-fetch';

const testAIEndpoint = async () => {
    try {
        console.log('Testing AI chat endpoint...');
        const response = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Hello, how are you?'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error testing AI endpoint:', error);
    }
};

testAIEndpoint();
