const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['artisan', 'client'], required: true },
  rating: { 
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  portfolio: [{ 
    title: String,
    description: String,
    imageUrl: String 
  }],
  preferences: {
    skills: [String],          // Artisan: ["carpentry", "plumbing"]
    location: String,          // Both: "New York, NY"
  },
  activityHistory: [{
    type: { type: String },    // "gig_viewed", "gig_applied", "search_query"
    gigId: mongoose.Schema.Types.ObjectId,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);