const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a gig
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find({ gig: req.query.gigId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;