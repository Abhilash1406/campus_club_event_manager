const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getEventReport, getAllReports, getOrganizerReports } = require('../controllers/reportController');

router.get('/', protect, authorize('admin'), getAllReports);
router.get('/organizer', protect, authorize('organizer'), getOrganizerReports);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventReport);

module.exports = router;
