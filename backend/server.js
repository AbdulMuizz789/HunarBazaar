require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketio = require('socket.io');
const Message = require('./models/Message'); // Import Message model

// Initialize Express and Socket.io
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'https://artisan-mvp-frontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'https://artisan-mvp-frontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join a room based on gig ID
  socket.on('join_gig', (gigId) => {
    socket.join(gigId);
    console.log(`User joined gig room: ${gigId}`);
  });

  socket.on('register', (userId) => {
    console.log(`User ${userId} joined their room`);
    socket.join(userId);  // Join room with user's ID
  });

  socket.on('send_message', async (data) => {
    try {
      // Save message to database
      const message = new Message({
        gig: data.gigId,
        sender: data.senderId,
        text: data.text,
        attachments: data.attachments || []
      });
      await message.save();

      await message.populate('sender', 'name'); // Populate sender details
      // Broadcast to all in the gig room
      io.to(data.gigId).emit('receive_message', message);
    } catch (err) {
      console.error('Message error:', err);
    }
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// --- Routes --- //
// Import Routes
const authRoutes = require('./routes/auth');  // Auth routes (login, register)
const gigRoutes = require('./routes/gigs');   // Gig routes (create, fetch)
const applicationRoutes = require('./routes/applications');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users'); // User routes (profile, etc.)
const bookingRoutes = require('./routes/bookings');
const messageRoutes = require('./routes/messages');
const dialogflowRoutes = require('./routes/dialogflow');

// Use Routes
app.use('/api/auth', authRoutes);  // Prefix: /api/auth
app.use('/api/gigs', gigRoutes);   // Prefix: /api/gigs
app.use('/api/gigs', applicationRoutes(io));  // Prefix: /api/gigs/:gigId/apply
app.use('/api/gigs', reviewRoutes); // Path: /api/gigs/:gigId/reviews
app.use('/api/users', userRoutes); // Path: /api/users/:userId
app.use('/api/gigs', bookingRoutes); // Prefix: /api/gigs/:gigId/book
app.use('/api/messages', messageRoutes); // Prefix: /api/messages
app.use('/api/dialogflow', dialogflowRoutes); // Prefix: /api/dialogflow

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));