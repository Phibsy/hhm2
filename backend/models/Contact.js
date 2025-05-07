const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
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
  message: {
    type: String,
    required: [true, 'Bitte geben Sie eine Nachricht an']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', ContactSchema);
