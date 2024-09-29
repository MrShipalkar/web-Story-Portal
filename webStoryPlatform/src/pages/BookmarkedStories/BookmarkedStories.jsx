// components/BookmarkedStories/BookmarkedStories.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookmarkedStories.css'
import StoryCard from '../../components/Storycard/storyCard'; // Assuming you have a StoryCard component to display stories

const BookmarkedStories = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarkedStories = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const response = await axios.get('http://localhost:5000/api/story/bookmarked-stories', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        });
        setBookmarkedStories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load bookmarked stories');
        setLoading(false);
      }
    };

    fetchBookmarkedStories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='bookmark-container'>
      <h2>Your Bookmarks</h2>
      <div className="story-list">
        {bookmarkedStories.length === 0 ? (
          <p>You have no bookmarked stories yet.</p>
        ) : (
          bookmarkedStories.map((story) => (
            <StoryCard key={story.storyId} story={story} />
          ))
        )}
      </div>
    </div>
  );
};

export default BookmarkedStories;
