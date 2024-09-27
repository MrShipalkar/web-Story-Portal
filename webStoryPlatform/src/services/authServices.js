import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Replace with your backend URL

// Register User
export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password });
    
    // Assuming the backend returns a token or some indicator of authentication
    const { token, user } = response.data;

    // Store token or logged in flag in localStorage
    if (token) {
      localStorage.setItem('token', token); // Store token in localStorage
      localStorage.setItem('isLoggedIn', true); // Flag user as logged in
      localStorage.setItem('username', user.username); // Store username
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error occurred during registration';
  }
};

// Login User
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    
    // Assuming the backend returns a token or some indicator of authentication
    const { token, user } = response.data;

    // Store token or logged in flag in localStorage
    if (token) {
      localStorage.setItem('token', token); // Store token in localStorage
      localStorage.setItem('isLoggedIn', true); // Flag user as logged in
      localStorage.setItem('username', user.username); // Store username
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error occurred during login';
  }
};

// Logout User (Optional Utility Function)
export const logoutUser = () => {
  localStorage.removeItem('token'); // Clear token
  localStorage.removeItem('isLoggedIn'); // Clear login flag
  localStorage.removeItem('username'); // Clear stored username
};
