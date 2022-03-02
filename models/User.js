// Bring in Mongoose
const mongoose = require('mongoose');

// Create schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 2,
    max: 32,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdministrator: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Export schema as Mongoose model
module.exports = mongoose.model('User', userSchema);
