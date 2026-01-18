// backend/seed.js
// Run this file to populate your database with initial data

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const User = require('./models/user');
const Destination = require('./models/destination');
const Booking = require('./models/booking');
const Inquiry = require('./models/inquiry');

// Sample Data
const sampleDestinations = [
    {
        title: 'Beach Paradise',
        image: 'https://images.unsplash.com/photo-1625945092796-d56af2a1a0c8?w=500',
        tag: 'Luxury Beach',
        desc: 'Relax by the crystal-clear water and white sands – the perfect tropical escape.'
    },
    {
        title: 'Mountain Retreat',
        image: 'https://images.unsplash.com/photo-1691433317101-fe4daf64b522?w=500',
        tag: 'Adventure',
        desc: 'Enjoy the cool breeze, hiking trails, and breathtaking mountain views.'
    },
    {
        title: 'City Adventure',
        image: 'https://images.unsplash.com/photo-1681118143080-fca9c5209a43?w=500',
        tag: 'Urban',
        desc: 'Explore modern skylines, shopping, nightlife, and unforgettable dining experiences.'
    },
    {
        title: 'Desert Safari',
        image: 'https://images.unsplash.com/photo-1624062999726-083e5268525d?w=500',
        tag: 'Adventure',
        desc: 'Ride across golden dunes and enjoy a night under the starry desert sky.'
    },
    {
        title: 'Swiss Alps',
        image: 'https://images.unsplash.com/photo-1651516246304-ed86453a0aa8?w=500',
        tag: 'Mountain Escape',
        desc: 'Snowy peaks, charming villages, and a perfect winter or summer retreat.'
    },
    {
        title: 'The Maldives',
        image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=500',
        tag: 'Luxury Beach',
        desc: 'Overwater bungalows, pristine beaches, and world-class diving spots.'
    },
    {
        title: 'Tokyo, Japan',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500',
        tag: 'Urban Jungle',
        desc: 'Neon lights, culinary delights, and a blend of ancient and futuristic culture.'
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Destination.deleteMany({});
        await Booking.deleteMany({});
        await Inquiry.deleteMany({});
        console.log('✅ Existing data cleared');

        // Create Admin User
        console.log('👤 Creating admin user...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('✅ Admin user created:');
        console.log('   Email: admin@test.com');
        console.log('   Password: admin123');

        // Create Regular Test User
        console.log('👤 Creating test user...');
        const testPassword = await bcrypt.hash('user123', salt);
        const testUser = await User.create({
            name: 'Test User',
            email: 'user@test.com',
            password: testPassword,
            role: 'user'
        });
        console.log('✅ Test user created:');
        console.log('   Email: user@test.com');
        console.log('   Password: user123');

        // Create Destinations
        console.log('🏖️  Creating destinations...');
        const destinations = await Destination.insertMany(sampleDestinations);
        console.log(`✅ ${destinations.length} destinations created`);

        // Create Sample Booking
        console.log('📅 Creating sample booking...');
        await Booking.create({
            destination: 'Beach Paradise',
            date: '2026-02-15',
            people: 2,
            notes: 'Honeymoon trip, need romantic setup',
            status: 'Pending'
        });
        console.log('✅ Sample booking created');

        // Create Sample Inquiry
        console.log('✉️  Creating sample inquiry...');
        await Inquiry.create({
            name: 'John Doe',
            email: 'john@example.com',
            subject: 'Question about packages',
            message: 'Do you offer group discounts for 10+ people?'
        });
        console.log('✅ Sample inquiry created');

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('==========================================');
        console.log('Admin Login:');
        console.log('  Email: admin@test.com');
        console.log('  Password: admin123');
        console.log('\nUser Login:');
        console.log('  Email: user@test.com');
        console.log('  Password: user123');
        console.log('==========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeder
seedDatabase();