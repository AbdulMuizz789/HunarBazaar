const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');

const app = express();

app.use(cors());
const server = http.createServer(app);
app.use(express.json());

app.use((req, res) => {
    res.status(404).json({error: 'Route not found'});
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Internal server error'});
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));