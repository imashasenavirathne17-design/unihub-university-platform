const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  lecturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  startTime: { type: String, required: true }, // Format: HH:MM (24-hour)
  endTime: { type: String, required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
