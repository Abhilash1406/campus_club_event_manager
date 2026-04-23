const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all approved events (public)
// @route   GET /api/events/approved
// @access  Public
const getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' })
      .populate('club', 'name')
      .populate('createdBy', 'name')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club', 'name description')
      .populate('createdBy', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Student submits event proposal
// @route   POST /api/events
// @access  Student
const createEvent = async (req, res) => {
  try {
    const { title, description, date, club, maxParticipants, registrationFee } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      club,
      maxParticipants: maxParticipants || 100,
      registrationFee: registrationFee || 0,
      createdBy: req.user._id,
      status: 'submitted'
    });
    await event.populate('club', 'name');
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submitted events for organizer's club
// @route   GET /api/events/organizer/pending
// @access  Organizer
const getOrganizerPendingEvents = async (req, res) => {
  try {
    if (!req.user.club) {
      return res.status(400).json({ message: 'Organizer is not assigned to a club' });
    }
    const clubId = req.user.club._id || req.user.club;
    const events = await Event.find({ club: clubId, status: 'submitted' })
      .populate('club', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events for organizer's club
// @route   GET /api/events/organizer/all
// @access  Organizer
const getOrganizerAllEvents = async (req, res) => {
  try {
    if (!req.user.club) {
      return res.status(400).json({ message: 'Organizer is not assigned to a club' });
    }
    const clubId = req.user.club._id || req.user.club;
    const events = await Event.find({ club: clubId })
      .populate('club', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Organizer approves event → forwarded_to_admin
// @route   PUT /api/events/:id/organizer-approve
// @access  Organizer
const organizerApproveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('club');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const orgClubId = (req.user.club._id || req.user.club).toString();
    const eventClubId = (event.club._id || event.club).toString();

    if (orgClubId !== eventClubId) {
      return res.status(403).json({ message: 'Not authorized to manage this event' });
    }

    if (event.status !== 'submitted') {
      return res.status(400).json({ message: `Cannot approve an event with status: ${event.status}` });
    }

    event.status = 'forwarded_to_admin';
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Organizer rejects event
// @route   PUT /api/events/:id/organizer-reject
// @access  Organizer
const organizerRejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('club');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const orgClubId = (req.user.club._id || req.user.club).toString();
    const eventClubId = (event.club._id || event.club).toString();

    if (orgClubId !== eventClubId) {
      return res.status(403).json({ message: 'Not authorized to manage this event' });
    }

    if (event.status !== 'submitted') {
      return res.status(400).json({ message: `Cannot reject an event with status: ${event.status}` });
    }

    event.status = 'rejected';
    event.rejectionReason = req.body.reason || 'Rejected by organizer';
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get events forwarded to admin
// @route   GET /api/events/admin/pending
// @access  Admin
const getAdminPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'forwarded_to_admin' })
      .populate('club', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events (admin view)
// @route   GET /api/events/admin/all
// @access  Admin
const getAllEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('club', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin approves event
// @route   PUT /api/events/:id/admin-approve
// @access  Admin
const adminApproveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.status !== 'forwarded_to_admin') {
      return res.status(400).json({ message: `Cannot approve an event with status: ${event.status}` });
    }

    event.status = 'approved';
    if (req.body.budget !== undefined) event.budget = req.body.budget;
    if (req.body.venue) event.venue = req.body.venue;
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin rejects event
// @route   PUT /api/events/:id/admin-reject
// @access  Admin
const adminRejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.status !== 'forwarded_to_admin') {
      return res.status(400).json({ message: `Cannot reject an event with status: ${event.status}` });
    }

    event.status = 'rejected';
    event.rejectionReason = req.body.reason || 'Rejected by admin';
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's own event proposals
// @route   GET /api/events/my-proposals
// @access  Student
const getMyProposals = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id })
      .populate('club', 'name')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload certificate template for an event
// @route   PUT /api/events/:id/certificate-template
// @access  Organizer
const uploadCertificateTemplate = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('club');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const orgClubId = (req.user.club._id || req.user.club).toString();
    const eventClubId = (event.club._id || event.club).toString();
    if (orgClubId !== eventClubId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.file) {
      event.certificateTemplate = `/uploads/certificates/${req.file.filename}`;
    }
    await event.save();
    res.json({ message: 'Certificate template uploaded', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApprovedEvents,
  getEvent,
  createEvent,
  getOrganizerPendingEvents,
  getOrganizerAllEvents,
  organizerApproveEvent,
  organizerRejectEvent,
  getAdminPendingEvents,
  getAllEventsAdmin,
  adminApproveEvent,
  adminRejectEvent,
  getMyProposals,
  uploadCertificateTemplate
};
