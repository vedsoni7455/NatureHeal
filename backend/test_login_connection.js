import fetch from 'node-fetch';

const testLogin = async () => {
    try {
        console.log('Testing connection to http://localhost:5000/api/auth/login...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', password: 'password' })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response body:', data);
    } catch (error) {
        console.error('Connection failed:', error.message);
    }
};

testLogin();
