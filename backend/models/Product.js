const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bitte geben Sie einen Namen an'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Bitte geben Sie eine Beschreibung an']
  },
  origin: {
    type: String,
    required: [true, 'Bitte geben Sie einen Herkunftsort an']
  },
  price: {
    type: Number,
    required: [true, 'Bitte geben Sie einen Preis an']
  },
  stock: {
    type: Number,
    required: [true, 'Bitte geben Sie die Verfügbarkeit an'],
    default: 0
  },
  imageUrl: {
    type: String,
    default: '/images/default-honey.jpg'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
