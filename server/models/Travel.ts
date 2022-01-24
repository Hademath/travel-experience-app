import mongoose from 'mongoose';

const TravelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  notes: {
    type: String,
    required: true,
  },
  visitDate: {
    required: true,
    type: Date,
  },
  status: {
    type: String,
    enum: ['public', 'private'], // Private
    default: 'private',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Travel', TravelSchema);
