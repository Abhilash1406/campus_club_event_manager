const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Certificate = require('../models/Certificate');

/**
 * @desc    Get real-time platform statistics from MongoDB
 * @route   GET /api/stats
 * @access  Public
 *
 * Returns:
 *  - totalUsers          : All registered users in the DB
 *  - totalEvents         : Approved events only (visible to students)
 *  - totalRegistrations  : Sum of all event registrations across all events
 *  - totalCertificates   : Certificates that have actually been issued
 *
 * All four counts run in parallel via Promise.all for efficiency.
 */
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalEvents, totalRegistrations, totalCertificates] =
      await Promise.all([
        // Count all registered users
        User.countDocuments(),

        // Count only approved events (those publicly visible)
        Event.countDocuments({ status: 'approved' }),

        // Count total registrations across every event
        Registration.countDocuments(),

        // Count certificates that exist in the DB (returns 0 if none issued yet)
        Certificate.countDocuments(),
      ]);

    res.json({
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalCertificates,
    });
  } catch (error) {
    console.error('[StatsController] Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

module.exports = { getStats };
