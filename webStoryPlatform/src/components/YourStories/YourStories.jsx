import React, { useState, useEffect } from 'react';
import StoryList from '../../components/Storylist/storylist.jsx';
import { fetchUserStories } from '../../services/storyServices.js';
import './YourStories.css'; // Create a new CSS file for styling

const YourStories = () => {
  const [userStories, setUserStories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const username = localStorage.getItem('username'); 
    if (username) {
      setIsLoggedIn(true); 
      const fetchUserStoriesData = async () => {
        try {
          const stories = await fetchUserStories(username); 
          setUserStories(stories);
        } catch (error) {
          console.error('Error fetching user stories:', error);
        }
      };
      fetchUserStoriesData();
    }
  }, []);

  if (!isLoggedIn) {
    return <p>Please log in to view your stories.</p>;
  }

  return (
    <div className="your-stories-page">
      <h2>Your Stories</h2>
      {userStories.length > 0 ? (
        <StoryList stories={userStories} showEditButton={true} />
      ) : (
        <p>You have no stories yet.</p>
      )}
    </div>
  );
};

export default YourStories;
