const Certificate = require('../models/Certificate');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const path = require('path');
const fs = require('fs');

// @desc    Generate certificates for all paid registrations of an event
// @route   POST /api/certificates/generate/:eventId
// @access  Organizer
const generateCertificates = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('club');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const orgClubId = (req.user.club._id || req.user.club).toString();
    const eventClubId = (event.club._id || event.club).toString();
    if (orgClubId !== eventClubId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
      paymentStatus: 'paid'
    }).populate('user', 'name email');

    const generated = [];
    for (const reg of registrations) {
      const existing = await Certificate.findOne({ user: reg.user._id, event: reg.event });
      if (!existing) {
        // Simulate certificate file URL (in reality, you'd generate a PDF using a canvas/pdf library)
        const fileUrl = `/uploads/certificates/cert_${reg.event}_${reg.user._id}.pdf`;
        const cert = await Certificate.create({
          user: reg.user._id,
          event: reg.event,
          fileUrl
        });
        generated.push(cert);
      }
    }

    res.json({ message: `${generated.length} certificates generated`, certificates: generated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my certificates
// @route   GET /api/certificates/my
// @access  Student
const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate({ path: 'event', populate: { path: 'club', select: 'name' } })
      .sort({ issuedAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get certificates for an event (organizer)
// @route   GET /api/certificates/event/:eventId
// @access  Organizer
const getEventCertificates = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('club');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const orgClubId = (req.user.club._id || req.user.club).toString();
    const eventClubId = (event.club._id || event.club).toString();
    if (orgClubId !== eventClubId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const certificates = await Certificate.find({ event: req.params.eventId })
      .populate('user', 'name email rollNo');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateCertificates, getMyCertificates, getEventCertificates };
