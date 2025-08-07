const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Config
const db = "mongodb://localhost:27017/farm-app";

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Define Schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const FarmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  products: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const BookingSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'pending' } // pending, confirmed, cancelled
});

const ReviewSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true },
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

// Create Models
const User = mongoose.model('User', UserSchema);
const Farm = mongoose.model('Farm', FarmSchema);
const Booking = mongoose.model('Booking', BookingSchema);
const Review = mongoose.model('Review', ReviewSchema);


app.get('/', (req, res) => {
  res.send('Server is running');
});

// @route   POST api/bookings
// @desc    Create a booking
// @access  Public
app.post('/api/bookings', (req, res) => {
  const newBooking = new Booking({
    farm: req.body.farm,
    user: req.body.user,
    date: req.body.date,
    time: req.body.time,
  });

  newBooking.save()
    .then(booking => res.status(201).json(booking))
    .catch(err => res.status(400).json({ error: 'Failed to create booking', details: err }));
});

// @route   GET api/bookings/user/:userId
// @desc    Get all bookings for a specific user
// @access  Public
app.get('/api/bookings/user/:userId', (req, res) => {
  Booking.find({ user: req.params.userId })
    .populate('farm', ['name', 'location']) // Populate with farm name and location
    .sort({ date: -1 })
    .then(bookings => res.json(bookings))
    .catch(err => res.status(404).json({ error: 'No bookings found for this user', details: err }));
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
