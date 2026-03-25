const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  floor: { type: Number, required: true },
  type: { type: String, enum: ['lecture hall', 'lab'], required: true }
});

module.exports = mongoose.model('Room', roomSchema);
