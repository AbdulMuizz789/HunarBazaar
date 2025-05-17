const express = require('express');
const Gig = require('../models/Gig');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.post('/:gigId/book', authenticate, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });

    if (gig.client.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const acceptedArtisan = gig.applications.find(app => app.status === 'accepted');
    if (!acceptedArtisan) {
      return res.status(400).json({ error: 'No accepted artisan for this gig' });
    }

    gig.booking = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: 'pending' 
    };

    await gig.save();
    res.json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:gigId/booking-status', authenticate, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId).populate('applications.artisan');
    if (!gig) return res.status(404).json({ error: 'Gig not found' });

    const isArtisan = gig.applications.some(
      app => app.artisan._id.toString() === req.userId && app.status === 'accepted'
    );
    if (!isArtisan) return res.status(403).json({ error: 'Unauthorized' });


    gig.booking.status = req.body.status; 
    await gig.save();

    res.json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;