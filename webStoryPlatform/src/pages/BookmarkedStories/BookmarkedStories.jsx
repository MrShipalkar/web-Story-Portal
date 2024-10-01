// components/BookmarkedStories/BookmarkedStories.jsx
import React, { useEffect, useState } from 'react';
import { fetchBookmarkedStories } from '../../services/storyServices'; // Import the service
import './BookmarkedStories.css'
import StoryCard from '../../components/Storycard/storyCard'; 

const BookmarkedStories = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBookmarkedStories = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const data = await fetchBookmarkedStories(token); 
        setBookmarkedStories(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load bookmarked stories');
        setLoading(false);
      }
    };

    loadBookmarkedStories();
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
