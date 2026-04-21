const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.post('/', auth, bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.get('/me', auth, bookingController.getMyBookings);
router.put('/:id/cancel', auth, bookingController.cancelBooking);
router.put('/:id', auth, bookingController.updateBooking);

module.exports = router;
