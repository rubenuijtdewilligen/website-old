// Bring in Node modules
const Joi = require('@hapi/joi');

/**
 * Validates the user info that is going to be registered
 */
const registration = (username, email, password) => {
  const schema = Joi.object({
    username: Joi.string().min(2).max(32).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8),
  });

  return schema.validate({ username, email, password });
};

/**
 * Validates the user info that is going to be logged in
 */
const login = (email, password) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(8),
  });

  return schema.validate({ email, password });
};

// Export the magic
module.exports = {
  registration,
  login,
};
