const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  recentSearches: [
    {
      city: String,
      temperature: String,
      condition: String,
      icon: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  favoriteCities: [String]  // Max 5 maybe?
});

module.exports = mongoose.model('UserData', userDataSchema);
