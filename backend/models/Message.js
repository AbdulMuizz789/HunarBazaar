const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  attachments: [{ type: String }], // URLs to uploaded files
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);