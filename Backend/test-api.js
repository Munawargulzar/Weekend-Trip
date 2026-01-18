// backend/test-api.js
// Run this to test if your API is working

const API_URL = "http://localhost:5000/api";

async function testAPI() {
    console.log('🧪 Testing Weekend Trips API...\n');
    
    // Test 1: Server Health
    console.log('Test 1: Server Health Check');
    try {
        const response = await fetch('http://localhost:5000/health');
        const data = await response.json();
        console.log('✅ SUCCESS:', data);
    } catch (error) {
        console.log('❌ FAILED:', error.message);
    }
    console.log('');
    
    // Test 2: Destinations
    console.log('Test 2: Get Destinations');
    try {
        const response = await fetch(`${API_URL}/destinations`);
        const data = await response.json();
        console.log('✅ SUCCESS: Found', data.length, 'destinations');
        console.log('First destination:', data[0]?.title || 'None');
    } catch (error) {
        console.log('❌ FAILED:', error.message);
    }
    console.log('');
    
    // Test 3: Bookings
    console.log('Test 3: Get Bookings');
    try {
        const response = await fetch(`${API_URL}/bookings`);
        const data = await response.json();
        console.log('✅ SUCCESS: Found', data.length, 'bookings');
        if (data.length > 0) {
            console.log('First booking:', data[0].destination);
        }
    } catch (error) {
        console.log('❌ FAILED:', error.message);
    }
    console.log('');
    
    // Test 4: Create Test Booking
    console.log('Test 4: Create Test Booking');
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destination: 'Test Destination',
                date: '2026-02-01',
                people: 2,
                notes: 'API Test Booking',
                status: 'Pending'
            })
        });
        const data = await response.json();
        console.log('✅ SUCCESS: Booking created');
        console.log('Booking ID:', data._id);
    } catch (error) {
        console.log('❌ FAILED:', error.message);
    }
    console.log('');
    
    console.log('🎉 API Test Complete!');
}

// Run the tests
testAPI();