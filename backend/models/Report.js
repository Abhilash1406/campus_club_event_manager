const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    unique: true
  },
  revenue: {
    type: Number,
    default: 0
  },
  cost: {
    type: Number,
    default: 0
  },
  totalRegistrations: {
    type: Number,
    default: 0
  },
  paidRegistrations: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
