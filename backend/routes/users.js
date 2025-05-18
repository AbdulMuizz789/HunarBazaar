const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');  // Auth middleware
const upload = require('../middleware/upload');  // File upload middleware
const User = require('../models/User');

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password') // Exclude sensitive data
      .populate({
        path: 'portfolio',
        select: 'title description imageUrl'
      });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:userId/portfolio', authenticate, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verify requester owns the profile
    if (user._id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!user.portfolio) {
      user.portfolio = [];
    }

    user.portfolio.push({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.file.path
    });

    await user.save();
    res.json(user.portfolio);
  } catch (err) {
    console.error('Error saving portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

// Search artisans by skill, location, or min rating
router.get('/search/artisans', async (req, res) => {
  try {
    const { skill, location, minRating } = req.query;
    const query = { role: 'artisan' };

    if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };
    if (location) query.location = { $regex: new RegExp(location, 'i') };
    if (minRating) query['rating.average'] = { $gte: Number(minRating) };

    const artisans = await User.find(query)
      .select('-password')
      .sort({ 'rating.average': -1 }); // Highest-rated first

    res.json(artisans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const { name, email, location, skills } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    if (location || skills || budgetRange) {
      updateFields.preferences = {};
      if (location) updateFields.preferences.location = location;
      if (skills) updateFields.preferences.skills = skills;
      if (budgetRange) updateFields.preferences.budgetRange = budgetRange;
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

module.exports = router;