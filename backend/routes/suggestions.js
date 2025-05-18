const express = require('express');
const { getArtisanSuggestions, getClientSuggestions } = require('../middleware/suggestions');
const router = express.Router();
const User = require('../models/User');

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const suggestions = user.role === 'artisan' 
      ? await getArtisanSuggestions(user._id) 
      : await getClientSuggestions(user._id);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;