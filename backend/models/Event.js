const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: [true, 'Club is required']
  },
  status: {
    type: String,
    enum: ['submitted', 'forwarded_to_admin', 'approved', 'rejected'],
    default: 'submitted'
  },
  budget: {
    type: Number,
    default: 0
  },
  venue: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  maxParticipants: {
    type: Number,
    default: 100
  },
  registrationFee: {
    type: Number,
    default: 0
  },
  certificateTemplate: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
