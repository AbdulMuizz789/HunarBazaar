require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: 'https://hunarbazaar.frontend.vercel.app',
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true
    }
});

app.use(cors({
    origin: 'https://hunarbazaar.frontend.vercel.app',
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(express.json());

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join_gig', (gigId) => {
        socket.join(gigId);
        console.log(`User joined gig room: ${gigId}`);
    });

    socket.on('register', (userId) => {
        console.log(`User ${userId} joined their room`);
        socket.join(userId);
    });

    socket.on('send_message', async (data) => {
        //TODO: add logic
    });

    socket.on('disconnect', () => console.log('Client disconnected'));
});

mongoose.connect(process.env.MONGODB_URI)
    .then(()=>console.log('Connected to MongoDB'))
    .catch(err=>console.error('MongoDB connction error:',err));

const gigRoutes = require('./routes/gigs');
const authRoutes = require('./routes/auth');

app.use('/api/gigs', gigRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
    res.status(404).json({error: 'Route not found'});
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Internal server error'});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));