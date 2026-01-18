const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS - Allow ALL
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// SERVE FRONTEND FILES
app.use(express.static(path.join(__dirname, '..')));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then((conn) => console.log(`✅ MongoDB connected: ${conn.connection.host}`))
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });

// API Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/inquiries', require('./routes/inquiries'));

app.listen(port, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Server: http://localhost:${port}`);
  console.log(`🏠 Home: http://localhost:${port}/index.html`);
  console.log(`🛒 Cart: http://localhost:${port}/pages/cart.html`);
  console.log('='.repeat(60));
});