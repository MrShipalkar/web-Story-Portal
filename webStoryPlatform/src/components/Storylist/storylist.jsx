import React from 'react';
import StoryCard from '../StoryCard/StoryCard.jsx';
import './Storylist.css'; 

const StoryList = ({ stories, showEditButton }) => {
  return (
    <div className="story-list">
      {stories.map((story, index) => (
        <StoryCard key={index} story={story} showEditButton={showEditButton} />
      ))}
    </div>
  );
};

export default StoryList;
