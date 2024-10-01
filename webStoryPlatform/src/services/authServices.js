import axios from 'axios';

const API_URL = 'https://web-story-portal.onrender.com/api/auth'; 

// Register User
export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password });
    
    
    const { token, user } = response.data;

    
    if (token) {
      localStorage.setItem('token', token); 
      localStorage.setItem('isLoggedIn', true); 
      localStorage.setItem('username', user.username); 
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error occurred during registration';
  }
};


export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    
    
    const { token, user } = response.data;

    
    if (token) {
      localStorage.setItem('token', token); 
      localStorage.setItem('isLoggedIn', true); 
      localStorage.setItem('username', user.username); 
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error occurred during login';
  }
};


export const logoutUser = () => {
  localStorage.removeItem('token'); 
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username'); 
};
