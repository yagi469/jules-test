const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Config
const db = process.env.MONGO_URI;
console.log('MONGO_URI variable read from .env:', db ? 'loaded' : 'is undefined');

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose
  .connect(db, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('Initial MongoDB connection error:', err));

// More detailed error logging
mongoose.connection.on('error', err => {
  console.error('Mongoose runtime connection error:', err);
});

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

// @route   GET api/farms
// @desc    Get all farms
// @access  Public
app.get('/api/farms', (req, res) => {
  Farm.find()
    .sort({ name: 1 })
    .then(farms => res.json(farms))
    .catch(err => res.status(404).json({ error: 'No farms found', details: err }));
});

// @route   GET api/farms/:id
// @desc    Get a specific farm by ID
// @access  Public
app.get('/api/farms/:id', (req, res) => {
  Farm.findById(req.params.id)
    .then(farm => res.json(farm))
    .catch(err => res.status(404).json({ error: 'No farm found with that ID', details: err }));
});

// @route   POST api/users
// @desc    Create a new user (for testing purposes)
// @access  Public
app.post('/api/users', (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: 'password' // Not used for now
  });

  newUser.save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(400).json({ error: 'Failed to create user', details: err }));
});

// @route   POST api/farms
// @desc    Create a new farm
// @access  Public (for now - should be protected later)
app.post('/api/farms', (req, res) => {
  const newFarm = new Farm({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    products: req.body.products,
    owner: req.body.owner // In a real app, this would come from auth
  });

  newFarm.save()
    .then(farm => res.status(201).json(farm))
    .catch(err => res.status(400).json({ error: 'Failed to create farm', details: err }));
});

// @route   POST api/reviews
// @desc    Create a review
// @access  Public (for now)
app.post('/api/reviews', (req, res) => {
  const newReview = new Review({
    farm: req.body.farm,
    user: req.body.user, // In a real app, this would come from auth
    rating: req.body.rating,
    comment: req.body.comment,
  });

  newReview.save()
    .then(review => res.status(201).json(review))
    .catch(err => res.status(400).json({ error: 'Failed to create review', details: err }));
});

// @route   GET api/reviews
// @desc    Get all reviews, optionally filtered by farm
// @access  Public
app.get('/api/reviews', (req, res) => {
  const filter = {};
  if (req.query.farmId) {
    filter.farm = req.query.farmId;
  }

  Review.find(filter)
    .populate('user', ['name']) // Populate with user's name
    .sort({ date: -1 })
    .then(reviews => res.json(reviews))
    .catch(err => res.status(404).json({ error: 'No reviews found', details: err }));
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
