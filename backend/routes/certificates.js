const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { generateCertificates, getMyCertificates, getEventCertificates } = require('../controllers/certificateController');

router.post('/generate/:eventId', protect, authorize('organizer'), generateCertificates);
router.get('/my', protect, authorize('student'), getMyCertificates);
router.get('/event/:eventId', protect, authorize('organizer'), getEventCertificates);

module.exports = router;
