// Bring in Node modules
const express = require('express');

// Initialize Express router
const router = express.Router();

// Routes
router.get('/', (req, res) => res.render('home'));
router.get('/login', (req, res) => res.render('authentication/login'));
router.get('/register', (req, res) => res.render('authentication/register'));
router.use('/api', require('./api'));

// Export the magic
module.exports = router;
