const Feedback = require('../models/Feedback');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Submit feedback for an event
// @route   POST /api/feedback
// @access  Student
const submitFeedback = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user is registered for this event
    const registration = await Registration.findOne({ user: req.user._id, event: eventId });
    if (!registration) {
      return res.status(403).json({ message: 'You must register for the event to submit feedback' });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ user: req.user._id, event: eventId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'You have already submitted feedback for this event' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      event: eventId,
      rating,
      comment
    });

    await feedback.populate('user', 'name');
    res.status(201).json(feedback);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Feedback already submitted' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all feedback for an event
// @route   GET /api/feedback/:eventId
// @access  Public
const getEventFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find({ event: req.params.eventId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    let averageRating = 0;
    if (feedbackList.length > 0) {
      const sum = feedbackList.reduce((acc, curr) => acc + curr.rating, 0);
      averageRating = (sum / feedbackList.length).toFixed(1);
    }

    res.json({
      feedback: feedbackList,
      averageRating: parseFloat(averageRating),
      totalCount: feedbackList.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitFeedback, getEventFeedback };
