// server.js - Main Express server file
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.API_KEY || 'your-default-api-key'; // Add an API key variable

// Middleware
app.use(cors());
app.use(express.json());

// Utility functions
// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Ensure users.json exists
const ensureUsersFileExists = () => {
  const usersFilePath = path.join(__dirname, 'users.json');
  
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  
  return usersFilePath;
};

// Get users from JSON file
const getUsers = () => {
  const usersFilePath = ensureUsersFileExists();
  
  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(usersData);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
};

// Save users to JSON file
const saveUsers = (users) => {
  const usersFilePath = ensureUsersFileExists();
  
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to users.json:', error);
    return false;
  }
};

// Check for API key in protected routes
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

// Ensure users.json exists on startup
ensureUsersFileExists();

// Routes
// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  
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

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
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

// Profile endpoint (protected)
app.get('/api/profile', authenticateApiKey, (req, res) => {
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

// Update username endpoint (Task 4)
app.patch('/api/profile', authenticateApiKey, (req, res) => {
  const { userId, username } = req.body;
  
  // Validate input
  if (!userId || !username) {
    return res.status(400).json({ error: 'User ID and username are required' });
  }
  
  // Validate username (no special characters)
  if (username.trim() === '') {
    return res.status(400).json({ error: 'Username cannot be empty' });
  }
  
  // Check for special characters
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(username)) {
    return res.status(400).json({ error: 'Username cannot contain special characters' });
  }
  
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

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});