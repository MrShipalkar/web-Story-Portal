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


export const editStory = async (storyId, updatedStoryData, token) => {
  const response = await axios.put(
    `${API_URL}/stories/${storyId}`,  // Ensure the correct API route is used
    updatedStoryData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


// Like/Unlike a slide
export const toggleLikeSlide = async (storyId, slideNumber, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/stories/${storyId}/slides/${slideNumber}/like`,
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token in Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling like for slide:', error);
    throw error.response?.data?.message || 'Error occurred while toggling like';
  }
};

export const fetchUserLikedSlides = async (storyId, token) => {
  try {
    const response = await axios.get(`${API_URL}/stories/${storyId}/liked-slides`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token for authentication
      },
    });
    return response.data; // Return the liked slides array
  } catch (error) {
    console.error('Error fetching liked slides:', error);
    throw error.response?.data?.message || 'Error occurred while fetching liked slides';
  }
};

export const toggleBookmarkSlide = async (storyId, slideNumber, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/stories/${storyId}/slides/${slideNumber}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token in Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling bookmark for slide:', error);
    throw error.response?.data?.message || 'Error occurred while toggling bookmark';
  }
};

export const fetchUserBookmarkedSlides = async (storyId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/stories/${storyId}/bookmarked-slides`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token in Authorization header
        },
      }
    );
    return response.data; // Return the list of bookmarked slide numbers
  } catch (error) {
    console.error('Error fetching bookmarked slides:', error);
    throw error.response?.data?.message || 'Error occurred while fetching bookmarked slides';
  }
};