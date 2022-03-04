// Bring in Mongoose
const mongoose = require('mongoose');

// Create schema
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  summaries: {
    type: Array,
    required: true,
    default: [],
  },
});

// Export schema as Mongoose model
module.exports = mongoose.model('Subject', subjectSchema);
