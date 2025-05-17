const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Gig = require('../models/Gig');
const User = require('../models/User');

module.exports = (io) => {
  router.post('/:gigId/apply', authenticate, async (req, res) => {
    try {
      const gig = await Gig.findById(req.params.gigId);
      if (!gig) return res.status(404).json({ error: 'Gig not found' });

      const user = await User.findById(req.userId);
      if (user.role !== 'artisan') {
        return res.status(403).json({ error: 'Only artisans can apply to gigs' });
      }

      const existingApplication = gig.applications.find(
        app => app.artisan.toString() === req.userId
      );
      if (existingApplication) {
        return res.status(400).json({ error: 'You already applied to this gig' });
      }

      gig.applications.push({
        artisan: req.userId,
        message: req.body.message || 'I’d like to work on this!'
      });
      await gig.save();

      res.json(gig);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  router.get('/:gigId/applications', authenticate, async (req, res) => {
    try {
      const gig = await Gig.findById(req.params.gigId)
        .populate('applications.artisan', 'name email skills');
      
      if (!gig) return res.status(404).json({ error: 'Gig not found' });


      if (gig.client.toString() !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      res.json(gig.applications);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:gigId/applications/:applicationId', authenticate, async (req, res) => {
    try {
      const gig = await Gig.findById(req.params.gigId);
      if (!gig) return res.status(404).json({ error: 'Gig not found' });

      
      if (gig.client.toString() !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const application = gig.applications.id(req.params.applicationId);
      if (!application) return res.status(404).json({ error: 'Application not found' });

      application.status = req.body.status; 
      await gig.save();

      const artisanId = application.artisan.toString();
      io.to(artisanId).emit('application_update', {
          gigId: gig._id.toString(),
          gigTitle: gig.title,
          status: req.body.status
      });
      console.log(`Emitting update to artisan ${artisanId}`);

      res.json(application);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}