// Quick test to check if login endpoint is working
const testLogin = async () => {
    const testEmail = 'test@example.com'; // Replace with actual email
    const testPassword = 'password123'; // Replace with actual password

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            })
        });

        const data = await response.json();

        console.log('Status:', response.status);
        console.log('Response:', data);

        if (response.ok) {
            console.log('✅ Login successful!');
            console.log('Token:', data.token);
            console.log('User:', data.user);
        } else {
            console.log('❌ Login failed:', data.message);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

testLogin();
