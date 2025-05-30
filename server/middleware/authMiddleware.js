const jwt = require('jsonwebtoken');

/**
 * Checks if the request has a valid JWT token in the Authorization header.
 * If the token is valid, adds the user data to the request object (req.user)
 * and calls the next middleware.
 * If the token is invalid, returns a 401 Unauthorized response with an error message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

/**
 * Generates an access token and a refresh token for the given user.
 * @param {Object} user - The user object with id and email properties.
 * @returns {Object} An object with accessToken and refreshToken properties.
 */
function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

// Refresh endpoint
const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required.' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { userId: payload.userId, email: payload.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token.' });
  }
};

module.exports = {
  authenticate,
  refreshToken,
  generateTokens
};
