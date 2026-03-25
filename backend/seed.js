const mongoose = require('mongoose');
require('dotenv').config();
const Room = require('./models/Room');

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Room.deleteMany();

    const rooms = [];
    
    for (let floor = 1; floor <= 7; floor++) {
      if (floor === 4) {
        // 4th floor: 4 labs, 1 lecture hall
        for (let i = 1; i <= 4; i++) {
          rooms.push({ roomName: `Lab 40${i}`, floor, type: 'lab' });
        }
        rooms.push({ roomName: `Hall 405`, floor, type: 'lecture hall' });
      } else {
        // other floors: 4 lecture halls
        for (let i = 1; i <= 4; i++) {
          rooms.push({ roomName: `Hall ${floor}0${i}`, floor, type: 'lecture hall' });
        }
      }
    }

    await Room.insertMany(rooms);
    console.log('Database seeded with 29 rooms.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedRooms();
