// Bring in Node modules
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validation = require('../../util/validation');

// Initialize Express router
const router = express.Router();

// Bring in Mongoose models
const User = require('../../models/User');
const { shouldBeAuthenticated, shouldNotBeAuthenticated } = require('../../util/authentication');

// Routes
router.post('/register', async (req, res) => {
  const { error } = validation.registration(req.body.username, req.body.email, req.body.password);
  if (error) return res.status(400).json({ error: error.details[0].message });

  if (await User.findOne({ email: req.body.email })) return res.status(403).json({ error: 'An account using this email already exists.' });
  if (await User.findOne({ username: req.body.username }))
    return res.status(403).json({ error: 'An account using this username already exists.' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    return res.status(200).json({ userId: savedUser._id });
  } catch (error) {
    res.status(500).json({ error: 'An unknown error has occurred on the server.' });
    return console.log(error);
  }
});

router.post('/login', async (req, res) => {
  const { error } = validation.login(req.body.email, req.body.password);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: 'A user with this email address does not exist.' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Wrong password.' });

  const token = jwt.sign(
    { id: user._id, username: user.username, email: user.email, isAdministrator: user.isAdministrator },
    process.env.JWT_SECRET,
    {
      expiresIn: '48h',
    }
  );
  return res
    .cookie('auth-token', token, {
      expires: new Date(Date.now() + 48 * 3600000), // cookie will be removed after 48 hours
    })
    .status(200)
    .json({ token });
});

router.get('/info', shouldBeAuthenticated, async (req, res) => {
  // TODO: Return user info
});

// Export the magic
module.exports = router;
