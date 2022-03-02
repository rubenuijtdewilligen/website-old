// Bring in Node modules
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/website';
mongoose.connect(MONGO_URI, { useNewUrlParser: true }, () => {
  console.log(`🌿 Connected to database on ${MONGO_URI}`);
});

// Initialize Express
const app = express();
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use('/static', express.static('public'));
app.use('/', require('./routes/index.js'));

// Start listening
const PORT = process.env.PORT || 1337;
app.listen(PORT, console.log(`🎩 The magic happens on port ${PORT}`));
