// src/services/storyService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/story'; // Replace with your backend URL

// Fetch stories by category
export const fetchStoriesByCategory = async (category) => {
  try {
    if (category === 'All') {
      const response = await axios.get(`${API_URL}/stories`);
      return response.data;
    }
    const response = await axios.get(`${API_URL}/stories/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stories for category "${category}":`, error);
    return []; // Return an empty array if there's an error
  }
};
