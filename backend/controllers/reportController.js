const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get report for an event
// @route   GET /api/reports/event/:eventId
// @access  Organizer / Admin
const getEventReport = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('club', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (req.user.role === 'organizer') {
      const orgClubId = (req.user.club._id || req.user.club).toString();
      const eventClubId = (event.club._id || event.club).toString();
      if (orgClubId !== eventClubId) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const totalRegistrations = await Registration.countDocuments({ event: req.params.eventId });
    const paidRegistrations = await Registration.countDocuments({ event: req.params.eventId, paymentStatus: 'paid' });

    const report = {
      event: event,
      revenue: paidRegistrations * (event.registrationFee || 0),
      cost: event.budget || 0,
      totalRegistrations,
      paidRegistrations
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports (admin)
// @route   GET /api/reports
// @access  Admin
const getAllReports = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' }).populate('club', 'name');
    const reportsData = await Promise.all(events.map(async (event) => {
      const totalRegs = await Registration.countDocuments({ event: event._id });
      const paidRegs = await Registration.countDocuments({ event: event._id, paymentStatus: 'paid' });
      return {
        event,
        revenue: paidRegs * (event.registrationFee || 0),
        cost: event.budget || 0,
        totalRegistrations: totalRegs,
        paidRegistrations: paidRegs,
        profit: (paidRegs * (event.registrationFee || 0)) - (event.budget || 0)
      };
    }));
    res.json(reportsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reports for organizer's club events
// @route   GET /api/reports/organizer
// @access  Organizer
const getOrganizerReports = async (req, res) => {
  try {
    const clubId = req.user.club._id || req.user.club;
    const events = await Event.find({ club: clubId, status: 'approved' }).populate('club', 'name');
    const reportsData = await Promise.all(events.map(async (event) => {
      const totalRegs = await Registration.countDocuments({ event: event._id });
      const paidRegs = await Registration.countDocuments({ event: event._id, paymentStatus: 'paid' });
      return {
        event,
        revenue: paidRegs * (event.registrationFee || 0),
        cost: event.budget || 0,
        totalRegistrations: totalRegs,
        paidRegistrations: paidRegs
      };
    }));
    res.json(reportsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEventReport, getAllReports, getOrganizerReports };
