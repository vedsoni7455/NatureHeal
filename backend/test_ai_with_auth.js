import fetch from 'node-fetch';

const testAIWithAuth = async () => {
    try {
        // First, login to get a token
        console.log('Step 1: Logging in...');
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'testuser@example.com',
                password: 'password123'
            })
        });

        const loginData = await loginResponse.json();
        console.log('Login Status:', loginResponse.status);

        if (!loginData.token) {
            console.error('No token received');
            return;
        }

        console.log('Token received:', loginData.token.substring(0, 20) + '...');

        // Now test AI chat with the token
        console.log('\nStep 2: Testing AI chat with auth token...');
        const aiResponse = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify({
                message: 'Hello from authenticated test'
            })
        });

        const aiData = await aiResponse.json();
        console.log('AI Response Status:', aiResponse.status);
        console.log('AI Response:', JSON.stringify(aiData, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
};

testAIWithAuth();
