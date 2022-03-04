// Bring in Node modules
const express = require('express');

// Initialize Express router
const router = express.Router();

// Routes
router.use('/auth', require('./authentication'));
router.use('/samenvattingen', require('./summaries'));

// Export the magic
module.exports = router;
