import React from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.css'; // Add CSS for styling
import edit from '../../assets/edit.png'

const StoryCard = ({ story, showEditButton }) => {
  const hasSlides = story.slides && story.slides.length > 0;

  return (
    <div className="story-card-wrapper">  {/* New wrapper added */}
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

      {/* Render Edit button only if showEditButton is true */}
      {showEditButton && (
        <button className="story-card__edit-btn">
          <img src={edit} alt="edit" />Edit
        </button>
      )}
    </div>
  );
};

export default StoryCard;
