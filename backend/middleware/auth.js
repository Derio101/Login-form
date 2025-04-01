// middleware/auth.js
const API_KEY = 'EXAM2024-KEY-5678';

/**
 * Middleware to authenticate API key
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

module.exports = {
  authenticateApiKey
};