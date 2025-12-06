import fetch from 'node-fetch';

const testSlots = async () => {
    const userId = '693318cc3d2ceec0a53c5e6a';

    // Get tomorrow's date YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    // Use "Monday" if tomorrow is Sunday (holiday), just to be safe for testing
    // But let's just stick to "next available day" logic if needed.
    // For now, testing tomorrow.

    const endpoint = `http://localhost:5001/api/doctor/${userId}/slots?date=${dateStr}`;

    console.log(`Checking slots for: ${dateStr}`);
    console.log(`URL: ${endpoint}`);

    try {
        const res = await fetch(endpoint);
        const data = await res.json();

        console.log(`Status: ${res.status}`);
        if (res.ok) {
            console.log('Slots found:', data.length);
            console.log('Slots:', data.slice(0, 5), '...');
        } else {
            console.log('Error:', data);
        }

    } catch (error) {
        console.error('Network Error:', error.message);
    }
};

testSlots();
