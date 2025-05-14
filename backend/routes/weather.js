const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController');

router.get('/', getWeather); // ✅ Correct: handles GET /api/weather?city=...

module.exports = router;
