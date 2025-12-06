import fetch from 'node-fetch';

const testLoginAndData = async () => {
    const loginUrl = 'http://localhost:5001/api/auth/login';
    const credentials = {
        email: 'alkabarbhaya5268@gmail.com',
        password: 'Doctor@123'
    };

    try {
        console.log(`🔐 Attempting login for: ${credentials.email} on PORT 5001`);
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            console.log('❌ Login Failed:', response.status);
            console.log('   Error:', data.message);
            return;
        }

        console.log('✅ Login Successful!');
        const token = data.token;
        console.log('   Token acquired.');

        // Test Doctor Patients API
        console.log('\n👨‍⚕️ Fetching Doctor Patients (Booked)...');
        const patientsUrl = 'http://localhost:5001/api/doctor/patients?type=booked';
        const patientsRes = await fetch(patientsUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const patientsData = await patientsRes.json();
        console.log(`   Status: ${patientsRes.status}`);

        if (patientsRes.ok) {
            console.log(`   Patients Found: ${patientsData.patients ? patientsData.patients.length : 0}`);
            console.log(`   Total (from meta): ${patientsData.total}`);
            if (patientsData.patients && patientsData.patients.length > 0) {
                console.log('   Sample Patient:', JSON.stringify(patientsData.patients[0], null, 2));
            } else {
                console.log('   ⚠️ No patients returned in list');
            }
        } else {
            console.log('   ❌ Error fetching patients:', patientsData);
        }

    } catch (error) {
        console.error('❌ Network Error:', error.message);
    }
};

testLoginAndData();
