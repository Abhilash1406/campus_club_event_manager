const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');

// @route   GET /api/stats
// @desc    Return real-time platform statistics from MongoDB
// @access  Public (no auth required — only aggregate counts, no sensitive data)
router.get('/', getStats);

module.exports = router;
