const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'gshop-production-secret-key-2026';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gshop';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build_v2')));

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'MONGODB_ATLAS', time: new Date().toISOString() });
});

// Login endpoint (required for mobile app)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = mongoose.model('User');
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '30d' });
    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        randBalance: user.randBalance || 0,
        escrowRand: user.escrowRand || 0,
        totalEarnedRand: user.totalEarnedRand || 0,
        skills: user.skills || [],
        primaryCategory: user.primaryCategory,
        verified: user.verified || false,
        phoneVerified: user.phoneVerified || false,
        emailVerified: user.emailVerified || false
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Register endpoint (required for mobile app)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phone, location, primaryCategory, skills, referralCode } = req.body;
    const User = mongoose.model('User');
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      primaryCategory,
      skills: skills || [],
      referralCode,
      randBalance: 0,
      escrowRand: 0,
      totalEarnedRand: 0
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id.toString() }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        randBalance: 0,
        escrowRand: 0,
        totalEarnedRand: 0,
        skills: newUser.skills || [],
        primaryCategory: newUser.primaryCategory,
        verified: false,
        phoneVerified: false,
        emailVerified: false
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected (Atlas)');
    
    // Load models
    require('./models/User');
    require('./models/Service');
    require('./models/Transaction');
    require('./models/Verification');
    require('./models/SMSVerification');
    require('./models/Message');
    require('./models/Review');
    require('./models/Job');
    console.log('Models loaded');
    
    // Load routes
    app.use('/api/verification', require('./routes/verification'));
    app.use('/api/sms', require('./routes/sms'));
    app.use('/api/transactions', require('./routes/transactions'));
    app.use('/api/services', require('./routes/services'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/messages', require('./routes/messages'));
    app.use('/api/reviews', require('./routes/reviews'));
    app.use('/api/jobs', require('./routes/jobs'));
    console.log('Routes loaded');
    
    // Serve React app for all other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build_v2', 'index.html'));
    });
    
    const httpServer = http.createServer(app);
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log('========================================');
      console.log('GShop Server running on port', PORT);
      console.log('Mode: MONGODB_ATLAS');
      console.log('Features: Auth, Services, Transactions, Image Upload, Jobs');
      console.log('========================================');
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
