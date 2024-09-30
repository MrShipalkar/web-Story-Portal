import React, { useState } from 'react';
import './StoryCard.css'; // Add CSS for styling
import edit from '../../assets/edit.png';
import EditStoryModal from '../editStoryModal/editStoryModal'; // Import the edit modal
import StoryModal from '../storymodel/StoryModal.jsx'; // Import the view story modal

const StoryCard = ({ story, showEditButton, isModalView }) => {
  const hasSlides = story.slides && story.slides.length > 0;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false); // Add state for StoryModal

  // Function to handle the edit button click
  const handleEditClick = () => {
    setIsEditModalOpen(true); // Open the edit modal
  };

  // Function to handle the story click
  const handleStoryClick = () => {
    setIsStoryModalOpen(true); // Open the story view modal
  };

  return (
    <>
      <div className={`story-card-wrapper ${isModalView ? 'modal-view' : 'home-view'}`}>
        <div className="story-card" onClick={handleStoryClick}> {/* Open StoryModal when clicked */}
          <div className={`story-card__image ${isModalView ? 'modal-image' : ''}`}>
            {hasSlides && story.slides[0].url && (
              <img src={story.slides[0].url} alt={story.slides[0].heading} />
            )}
            <div className="story-card__gradient">
              <h3>{hasSlides ? story.slides[0].heading : 'Untitled Story'}</h3>
              <p>{hasSlides ? story.slides[0].description : 'No description available'}</p>
            </div>
          </div>
        </div>

        {/* Render Edit button only if showEditButton is true */}
        {showEditButton && !isModalView && (
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

      {/* Render Story Modal if isStoryModalOpen is true */}
      {isStoryModalOpen && (
        <StoryModal 
          onClose={() => setIsStoryModalOpen(false)} // Close modal handler
          story={story} // Pass the clicked story data
        />
      )}
    </>
  );
};

export default StoryCard;
