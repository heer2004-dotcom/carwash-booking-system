const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  try {
    const { packageName, vehicleType, vehicleRego, date, time, notes } = req.body;
    const booking = await Booking.create({
      user: req.user.id, packageName, vehicleType, vehicleRego, date, time, notes,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.find().populate('user', 'name email').sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { packageName, vehicleType, vehicleRego, date, time, status, notes } = req.body;
    booking.packageName = packageName ?? booking.packageName;
    booking.vehicleType = vehicleType ?? booking.vehicleType;
    booking.vehicleRego = vehicleRego ?? booking.vehicleRego;
    booking.date = date ?? booking.date;
    booking.time = time ?? booking.time;
    booking.notes = notes ?? booking.notes;
    if (status) booking.status = status;
    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings, updateBooking, deleteBooking };
