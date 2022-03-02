// Bring in Node modules
const jwt = require('jsonwebtoken');
const url = require('url');

/**
 * The user should be authenticated, but doesn't have to be an administrator
 */
const shouldBeAuthenticated = (req, res, next) => {
  const token = req.cookies['auth-token'];

  if (!token) return meetRequirement('login', req.originalUrl, res);

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    return next();
  } catch (error) {
    return meetRequirement('login', req.originalUrl, res);
  }
};

/**
 * The user should not be authenticated at all
 */
const shouldNotBeAuthenticated = (req, res, next) => {
  // TODO: Check whether user is authenticated. If they are, redirect them to home.
};

/**
 * The user should be authenticated as an administrator
 */
const shouldBeAdministrator = (req, res, next) => {
  const token = req.cookies['auth-token'];

  if (!token) return meetRequirement('login', req.originalUrl, res);

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const payload = jwt.decode(token, { complete: true }).payload;

    if (payload.isAdministrator) return next();
    return meetRequirement('admin', req.originalUrl, res);
  } catch (error) {
    return meetRequirement('admin', req.originalUrl, res);
  }
};

/**
 * This redirects the user to the login page with a requirement and the original url so that they can be redirected back
 */
function meetRequirement(requirement, originalUrl, res) {
  res.redirect(
    url.format({
      pathname: '/login',
      query: {
        requirement,
        redirect: encodeURI(originalUrl),
      },
    })
  );
}

// Export the magic
module.exports = {
  shouldBeAuthenticated,
  shouldNotBeAuthenticated,
  shouldBeAdministrator,
};
