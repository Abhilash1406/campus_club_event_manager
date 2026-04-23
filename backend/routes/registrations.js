const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  registerForEvent,
  simulatePayment,
  getMyRegistrations,
  getEventParticipants,
  getEventParticipantsAdmin
} = require('../controllers/registrationController');

router.post('/', protect, authorize('student'), registerForEvent);
router.put('/:id/pay', protect, authorize('student'), simulatePayment);
router.get('/my', protect, authorize('student'), getMyRegistrations);
router.get('/event/:eventId', protect, authorize('organizer'), getEventParticipants);
router.get('/admin/event/:eventId', protect, authorize('admin'), getEventParticipantsAdmin);

module.exports = router;
