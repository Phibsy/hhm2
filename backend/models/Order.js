const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bitte geben Sie einen Namen an']
  },
  email: {
    type: String,
    required: [true, 'Bitte geben Sie eine E-Mail an'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Bitte geben Sie eine gültige E-Mail an'
    ]
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Bitte geben Sie eine Menge an'],
    default: 1
  },
  status: {
    type: String,
    enum: ['vorgemerkt', 'bestätigt', 'storniert'],
    default: 'vorgemerkt'
  },
  message: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
