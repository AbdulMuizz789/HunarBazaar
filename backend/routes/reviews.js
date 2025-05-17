const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');  // Auth middleware
const Gig = require('../models/Gig');

// Submit review (client or artisan)
router.post('/:gigId/reviews', authenticate, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });

    // Verify gig is completed and user participated in it
    if (!gig.isCompleted) {
      return res.status(400).json({ error: 'Gig must be completed first' });
    }

    const isClient = gig.client.toString() === req.userId;
    const isArtisan = gig.applications.some(app => 
      app.artisan.toString() === req.userId && app.status === 'accepted'
    );

    if (!isClient && !isArtisan) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    gig.reviews.push({
      reviewer: req.userId,
      rating: req.body.rating,
      comment: req.body.comment,
      role: isClient ? 'client' : 'artisan'
    });

    await gig.save();
    res.json(gig.reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;