// Bring in Node modules
const express = require('express');

// Initialize Express router
const router = express.Router();

// Routes
router.use('/auth', require('./authentication'));

// Export the magic
module.exports = router;
