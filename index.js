// Bring in Node modules
require('dotenv').config();
const express = require('express');
const path = require('path');

// Initialize Express
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use('/static', express.static('public'));
app.use('/', require('./routes/index.js'));

// Start listening
const PORT = process.env.PORT || 1337;
app.listen(PORT, console.log(`🎩 The magic happens on port ${PORT}`));
