// Bring in Node modules
const express = require('express');

// Initialize Express router
const router = express.Router();

// Routes
router.get('/', (req, res) => res.render('home'));

// Export the magic
module.exports = router;
