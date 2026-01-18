// backend/test-connection.js
// Quick test to verify database connection and check data

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function testConnection() {
    try {
        console.log('🔌 Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully!\n');

        // Check what data exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📊 Database Collections:');
        console.log('========================');
        
        for (const collection of collections) {
            const count = await mongoose.connection.db.collection(collection.name).countDocuments();
            console.log(`  ${collection.name}: ${count} documents`);
        }

        // Check specific data
        console.log('\n📝 Detailed Counts:');
        console.log('========================');
        
        const Destination = require('./models/destination');
        const User = require('./models/user');
        const Booking = require('./models/booking');
        const Inquiry = require('./models/inquiry');

        const destCount = await Destination.countDocuments();
        const userCount = await User.countDocuments();
        const bookingCount = await Booking.countDocuments();
        const inquiryCount = await Inquiry.countDocuments();

        console.log(`  Destinations: ${destCount}`);
        console.log(`  Users: ${userCount}`);
        console.log(`  Bookings: ${bookingCount}`);
        console.log(`  Inquiries: ${inquiryCount}`);

        if (destCount === 0) {
            console.log('\n⚠️  WARNING: No destinations found!');
            console.log('   Run: npm run seed');
        } else {
            console.log('\n✅ Database has data!');
            
            // Show sample destination
            const sampleDest = await Destination.findOne();
            if (sampleDest) {
                console.log('\n📍 Sample Destination:');
                console.log(`   Title: ${sampleDest.title}`);
                console.log(`   Tag: ${sampleDest.tag}`);
            }
        }

        // Check for admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (adminUser) {
            console.log('\n👤 Admin User Found:');
            console.log(`   Email: ${adminUser.email}`);
            console.log(`   Name: ${adminUser.name}`);
        } else {
            console.log('\n⚠️  WARNING: No admin user found!');
            console.log('   Run: npm run seed');
        }

        console.log('\n✅ Connection test complete!\n');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Connection Error:', error.message);
        console.log('\n📋 Troubleshooting:');
        console.log('  1. Check your MONGO_URI in .env file');
        console.log('  2. Ensure MongoDB is accessible');
        console.log('  3. Check network/firewall settings\n');
        process.exit(1);
    }
}

testConnection();