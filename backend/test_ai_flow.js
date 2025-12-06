import fetch from 'node-fetch';

const testAIFlow = async () => {
    try {
        // Register a new user
        console.log('Step 1: Registering new user...');
        const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'AI Test User',
                email: `aitest${Date.now()}@example.com`,
                password: 'testpass123',
                role: 'patient'
            })
        });

        const registerData = await registerResponse.json();
        console.log('Register Status:', registerResponse.status);

        if (!registerData.token) {
            console.error('Registration failed:', registerData);
            return;
        }

        console.log('Token received:', registerData.token.substring(0, 20) + '...');

        // Now test AI chat with the token
        console.log('\nStep 2: Testing AI chat with auth token...');
        const aiResponse = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${registerData.token}`
            },
            body: JSON.stringify({
                message: 'Hello, can you help me?'
            })
        });

        const aiData = await aiResponse.json();
        console.log('AI Response Status:', aiResponse.status);
        console.log('AI Response:', JSON.stringify(aiData, null, 2));

        if (aiResponse.status !== 200) {
            console.error('\n❌ AI request failed!');
        } else {
            console.log('\n✅ AI request succeeded!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

testAIFlow();
