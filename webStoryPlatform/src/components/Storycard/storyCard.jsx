import React from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.css'; // Add CSS for styling

const StoryCard = ({ story }) => {
  const hasSlides = story.slides && story.slides.length > 0;

  return (
    <Link to={`/story/${story._id}`} className="story-card"> {/* Make the whole card clickable */}
      <div className="story-card__image">
        {hasSlides && story.slides[0].url && (
          <img src={story.slides[0].url} alt={story.slides[0].heading} />
        )}
        <div className="story-card__gradient">
          <h3>{hasSlides ? story.slides[0].heading : 'Untitled Story'}</h3>
          <p>{hasSlides ? story.slides[0].description : 'No description available'}</p>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
