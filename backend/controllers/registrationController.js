const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Student
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status !== 'approved') {
      return res.status(400).json({ message: 'Event is not open for registration' });
    }

    const existing = await Registration.findOne({ user: req.user._id, event: eventId });
    if (existing) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = await Registration.create({
      user: req.user._id,
      event: eventId,
      paymentStatus: 'pending'
    });

    await registration.populate(['user', { path: 'event', populate: { path: 'club', select: 'name' } }]);
    res.status(201).json(registration);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Simulate payment
// @route   PUT /api/registrations/:id/pay
// @access  Student
const simulatePayment = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    registration.paymentStatus = 'paid';
    await registration.save();

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my registrations
// @route   GET /api/registrations/my
// @access  Student
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate({ path: 'event', populate: { path: 'club', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get participants for an event (organizer)
// @route   GET /api/registrations/event/:eventId
// @access  Organizer
const getEventParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('club');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const orgClubId = (req.user.club._id || req.user.club).toString();
    const eventClubId = (event.club._id || event.club).toString();
    if (orgClubId !== eventClubId) {
      return res.status(403).json({ message: 'Not authorized to view this event' });
    }

    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('user', 'name email rollNo className section')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all participants for admin
// @route   GET /api/registrations/admin/event/:eventId
// @access  Admin
const getEventParticipantsAdmin = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('user', 'name email rollNo className section')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerForEvent,
  simulatePayment,
  getMyRegistrations,
  getEventParticipants,
  getEventParticipantsAdmin
};
