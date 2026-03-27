const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  const { roomId, date, startTime, endTime } = req.body;
  
  if (req.user.role !== 'lecturer') {
    return res.status(403).json({ message: 'Only lecturers can book rooms' });
  }

  try {
    // Conflict detection
    const conflicts = await Booking.find({
      roomId,
      date,
      status: 'active',
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Room is already booked for this time slot' });
    }

    const newBooking = new Booking({
      lecturerId: req.user.id,
      roomId,
      date,
      startTime,
      endTime
    });

    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { date, roomId } = req.query;
    let query = { status: 'active' };
    if (date) query.date = date;
    if (roomId) query.roomId = roomId;

    const bookings = await Booking.find(query).populate('lecturerId', 'name email').populate('roomId');
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ lecturerId: req.user.id, status: 'active' }).populate('roomId');
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.lecturerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateBooking = async (req, res) => {
  const { date, startTime, endTime } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.lecturerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized you do not own this booking' });
    }

    // Conflict detection excluding the current active booking
    const conflicts = await Booking.find({
      _id: { $ne: booking._id },
      roomId: booking.roomId,
      date,
      status: 'active',
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Room is already booked for this new time slot' });
    }

    booking.date = date;
    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
