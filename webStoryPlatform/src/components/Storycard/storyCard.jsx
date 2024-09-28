import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.css'; // Add CSS for styling
import edit from '../../assets/edit.png';
import EditStoryModal from '../editStoryModal/editStoryModal'; // Import the modal

const StoryCard = ({ story, showEditButton }) => {
  const hasSlides = story.slides && story.slides.length > 0;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Function to handle the edit button click
  const handleEditClick = () => {
    setIsEditModalOpen(true); // Open the modal
  };

  return (
    <>
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
          <button className="story-card__edit-btn" onClick={handleEditClick}>
            <img src={edit} alt="edit" />Edit
          </button>
        )}
      </div>

      {/* Render Edit Modal if isEditModalOpen is true */}
      {isEditModalOpen && (
    <EditStoryModal
        onClose={() => setIsEditModalOpen(false)}
        storyData={story} // Pass story data to prefill the modal
    />
)}
    </>
  );
};

export default StoryCard;
