import axios from 'axios';


const API_URL = 'https://web-story-portal.onrender.com/api/story'; 

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
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding story:', error);
    throw error.response?.data?.message || 'Error occurred while adding the story';
  }
};


export const fetchUserStories = async (username) => {
  try {
   
    const response = await axios.get(`${API_URL}/stories/user/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user stories:', error);
    throw error.response?.data?.message || 'Error occurred while fetching stories';
  }
};


export const editStory = async (storyId, updatedStoryData, token) => {
  const response = await axios.put(
    `${API_URL}/stories/${storyId}`, 
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
          Authorization: `Bearer ${token}`, 
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
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data; 
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
          Authorization: `Bearer ${token}`, 
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
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Error fetching bookmarked slides:', error);
    throw error.response?.data?.message || 'Error occurred while fetching bookmarked slides';
  }
};

//for bookmarks seperate page
export const fetchBookmarkedStories = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/bookmarked-stories`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to load bookmarked stories');
  }
};

// Fetch shared Story
export const fetchStoryById = async (storyId) => {
  try {
    const response = await axios.get(`${API_URL}/stories/${storyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching story with ID "${storyId}":`, error);
    throw error.response?.data?.message || 'Error occurred while fetching the story';
  }
};