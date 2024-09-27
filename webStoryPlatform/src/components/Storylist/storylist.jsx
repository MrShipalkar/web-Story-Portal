import React from 'react';
import StoryCard from '../StoryCard/StoryCard.jsx';
import './Storylist.css'; // Add styles

const StoryList = ({ stories }) => {
  return (
    <div className="story-list">
      {stories.map((story, index) => (
        <StoryCard key={index} story={story} />
      ))}
    </div>
  );
};

export default StoryList;
