const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');  // Auth middleware
const Gig = require('../models/Gig');

// Create Gig (Protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const gig = await Gig.create({
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
      client: req.userId  // From auth middleware
    });
    res.status(201).json(gig);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Gigs (Public)
router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.find().populate('client', 'name email');
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gigs' });
  }
});

// Get gigs applied by the artisan
router.get('/applied', authenticate, async (req, res) => {
  try {
    const gigs = await Gig.find({ 
      'applications.artisan': req.userId 
    }).populate('client', 'name')
    .lean();
    
    const result = gigs.map(gig => {
      const app = gig.applications.find(a => a.artisan.toString() === req.userId);
      return {
        _id: gig._id,
        title: gig.title,
        description: gig.description,
        budget: gig.budget,
        client: gig.client,
        booking: gig.booking,
        application: {
          _id: app?._id,
          status: app?.status || 'pending'
        }
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get gigs posted by the client (with applications)
router.get('/client', authenticate, async (req, res) => {
  try {
    const gigs = await Gig.find({ client: req.userId })
      .populate('applications.artisan', 'name email');
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single gig by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('client', 'name');
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Client marks gig as completed
router.put('/:id/complete', authenticate, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });

    // Verify requester is the gig's client
    if (gig.client.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    gig.isCompleted = true;
    await gig.save();
    res.json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;