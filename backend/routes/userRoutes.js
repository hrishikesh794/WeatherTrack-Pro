const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/TempUser');

// Save city
router.post('/save-city', auth, async (req, res) => {
  const { city } = req.body;
  const user = await User.findById(req.user.id);
  if (!user.savedCities.includes(city)) user.savedCities.push(city);
  await user.save();
  res.json(user.savedCities);
});

// Get saved cities
router.get('/saved-cities', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.savedCities);
});

// Add to search history
router.post('/search', auth, async (req, res) => {
  const { city } = req.body;
  const user = await User.findById(req.user.id);
  user.searchHistory.unshift(city);
  user.searchHistory = user.searchHistory.slice(0, 5);
  await user.save();
  res.json(user.searchHistory);
});

// Get search history
router.get('/history', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.searchHistory);
});

module.exports = router;
