const mongoose = require('mongoose');
const User = require('./User');

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applications: [{
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  isCompleted: { type: Boolean, default: false },
  reviews: [{
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Client or Artisan
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    role: { type: String, enum: ['client', 'artisan'] } // Who left the review
  }],
  booking: {
    startDate: { type: Date },
    endDate: { type: Date },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    }
  }
}, { timestamps: true });

// Update user's average rating when a review is added
gigSchema.post('save', async function (doc) {
  if (doc.reviews && doc.reviews.length > 0) {
    const artisanId = doc.applications.find(app => app.status === 'accepted')?.artisan;
    const clientId = doc.client;

    // Update artisan's rating
    if (artisanId) {
      const artisanReviews = doc.reviews.filter(r => r.role === 'client');
      const avgRating = artisanReviews.reduce((sum, r) => sum + r.rating, 0) / artisanReviews.length;
      await User.findByIdAndUpdate(artisanId, {
        'rating.average': avgRating,
        'rating.count': artisanReviews.length
      });
    }

    // Update client's rating
    if (clientId) {
      const clientReviews = doc.reviews.filter(r => r.role === 'artisan');
      const avgRating = clientReviews.reduce((sum, r) => sum + r.rating, 0) / clientReviews.length;
      await User.findByIdAndUpdate(clientId, {
        'rating.average': avgRating,
        'rating.count': clientReviews.length
      });
    }
  }
});

module.exports = mongoose.model('Gig', gigSchema);