const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
  try {
    const { floor, type } = req.query;
    let query = {};
    if (floor) query.floor = floor;
    if (type) query.type = type;

    const rooms = await Room.find(query).sort({ floor: 1, roomName: 1 });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
