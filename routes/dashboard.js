// Bring in Node modules
const express = require('express');
const jwt = require('jsonwebtoken');

// Initialize Express router
const router = express.Router();

// Routes
router.get('/', (req, res) =>
  res.render('dashboard/home', {
    user: jwt.decode(req.cookies['auth-token']),
  })
);

router.get('/samenvattingen', (req, res) =>
  res.render('dashboard/summaries', {
    user: jwt.decode(req.cookies['auth-token']),
  })
);

router.get('/samenvattingen/add', (req, res) =>
  res.render('dashboard/add_summary', {
    user: jwt.decode(req.cookies['auth-token']),
  })
);

router.get('/samenvattingen/add_subject', (req, res) =>
  res.render('dashboard/add_subject', {
    user: jwt.decode(req.cookies['auth-token']),
  })
);

router.get('/samenvattingen/add_chapter', (req, res) =>
  res.render('dashboard/add_chapter', {
    user: jwt.decode(req.cookies['auth-token']),
  })
);

// Export the magic
module.exports = router;
