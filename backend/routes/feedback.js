const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { submitFeedback, getEventFeedback } = require('../controllers/feedbackController');

router.post('/', protect, authorize('student'), submitFeedback);
router.get('/:eventId', getEventFeedback);

module.exports = router;
