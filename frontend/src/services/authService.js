import axios from 'axios';

const API_URL = '/api';
const API_KEY = 'EXAM2024-KEY-5678';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Network error' };
  }
};

// Login a user
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Network error' };
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        'X-API-Key': API_KEY
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Network error' };
  }
};

// Update username
export const updateUsername = async (userId, username) => {
  try {
    const response = await axios.patch(
      `${API_URL}/profile`,
      { userId, username },
      {
        headers: {
          'X-API-Key': API_KEY
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Network error' };
  }
};