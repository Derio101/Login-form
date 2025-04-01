// routes/api.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');
const { 
  validateRegistration, 
  validateLogin, 
  validateUsernameUpdate 
} = require('../middleware/validation');
const { getUsers, saveUsers } = require('../utils/data');

/**
 * @route   POST /api/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistration, async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check if user already exists
    const users = getUsers();
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = 10; // as specified in requirements
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    if (!saveUsers(users)) {
      return res.status(500).json({ error: 'Failed to save user data' });
    }
    
    // Return success without sending back the password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

/**
 * @route   POST /api/login
 * @desc    Authenticate a user
 * @access  Public
 */
router.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user
    const users = getUsers();
    const user = users.find(user => user.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful', user: userWithoutPassword });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

/**
 * @route   GET /api/profile
 * @desc    Get user profile data
 * @access  Protected (API key required)
 */
router.get('/profile', authenticateApiKey, (req, res) => {
  try {
    // In a real app, we would use a token to get the user ID
    // For this assignment, we'll just return all users (without passwords)
    const users = getUsers();
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error retrieving profile data' });
  }
});

/**
 * @route   PATCH /api/profile
 * @desc    Update a user's username
 * @access  Protected (API key required)
 */
router.patch('/profile', authenticateApiKey, validateUsernameUpdate, (req, res) => {
  const { userId, username } = req.body;
  
  try {
    // Find and update user
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update username
    users[userIndex].username = username;
    
    // Save updated users
    if (!saveUsers(users)) {
      return res.status(500).json({ error: 'Failed to update user data' });
    }
    
    // Return updated user without password
    const { password, ...updatedUser } = users[userIndex];
    res.json({ message: 'Username updated successfully', user: updatedUser });
    
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({ error: 'Server error updating username' });
  }
});

module.exports = router;