import axios from 'axios';


const API_URL = 'http://localhost:5000/api/story'; // Replace with your backend URL

// Fetch stories by category
export const fetchStoriesByCategory = async (category) => {
  try {
    const response = await (category === 'All'
      ? axios.get(`${API_URL}/stories`)
      : axios.get(`${API_URL}/stories/category/${category}`));
    return response.data;
  } catch (error) {
    console.error(`Error fetching stories for category "${category}":`, error);
    return [];
  }
};


export const addStory = async (storyData, token) => {
  try {
    const response = await axios.post(`${API_URL}/stories`, storyData, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token in Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding story:', error);
    throw error.response?.data?.message || 'Error occurred while adding the story';
  }
};

// Fetch user-specific stories
export const fetchUserStories = async (username) => {
  try {
    // Make a GET request, using the username in the URL path
    const response = await axios.get(`${API_URL}/stories/user/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user stories:', error);
    throw error.response?.data?.message || 'Error occurred while fetching stories';
  }
};

