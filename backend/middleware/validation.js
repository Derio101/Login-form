// middleware/validation.js

/**
 * Validate email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password length
   * @param {string} password - Password to validate
   * @returns {boolean} - True if password is valid
   */
  const isValidPassword = (password) => {
    return password && password.length >= 8;
  };
  
  /**
   * Validate username format (no special characters and not empty)
   * @param {string} username - Username to validate
   * @returns {boolean} - True if username is valid
   */
  const isValidUsername = (username) => {
    if (!username || username.trim() === '') {
      return false;
    }
    
    // Check for special characters
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return !specialCharsRegex.test(username);
  };
  
  /**
   * Middleware to validate registration input
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  const validateRegistration = (req, res, next) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    if (!isValidUsername(username)) {
      return res.status(400).json({ error: 'Username cannot be empty or contain special characters' });
    }
    
    next();
  };
  
  /**
   * Middleware to validate login input
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    next();
  };
  
  /**
   * Middleware to validate username update
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  const validateUsernameUpdate = (req, res, next) => {
    const { userId, username } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!isValidUsername(username)) {
      return res.status(400).json({ error: 'Username cannot be empty or contain special characters' });
    }
    
    next();
  };
  
  module.exports = {
    validateRegistration,
    validateLogin,
    validateUsernameUpdate,
    isValidEmail,
    isValidPassword,
    isValidUsername
  };