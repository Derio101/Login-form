// utils/data.js
const fs = require('fs');
const path = require('path');

/**
 * Ensure users.json file exists, create if not
 * @returns {string} - Path to users.json file
 */
const ensureUsersFileExists = () => {
  const usersFilePath = path.join(__dirname, '..', 'users.json');
  
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  
  return usersFilePath;
};

/**
 * Get users from JSON file
 * @returns {Array} - Array of user objects
 */
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

/**
 * Save users to JSON file
 * @param {Array} users - Array of user objects
 * @returns {boolean} - True if save is successful
 */
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

module.exports = {
  getUsers,
  saveUsers,
  ensureUsersFileExists
};