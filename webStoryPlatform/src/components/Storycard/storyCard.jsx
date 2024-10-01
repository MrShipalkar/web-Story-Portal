import React, { useState } from 'react';
import './StoryCard.css'; 
import edit from '../../assets/edit.png';
import EditStoryModal from '../editStoryModal/editStoryModal'; 
import StoryModal from '../storymodel/StoryModal.jsx'; 

const StoryCard = ({ story, showEditButton, isModalView }) => {
  const hasSlides = story.slides && story.slides.length > 0;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);


  const handleEditClick = () => {
    setIsEditModalOpen(true); 
  };

 
  const handleStoryClick = () => {
    setIsStoryModalOpen(true); 
  };

  return (
    <>
      <div className={`story-card-wrapper ${isModalView ? 'modal-view' : 'home-view'}`}>
        <div className="story-card" onClick={handleStoryClick}> 
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

        
        {showEditButton && !isModalView && (
          <button className="story-card__edit-btn" onClick={handleEditClick}>
            <img src={edit} alt="edit" />Edit
          </button>
        )}
      </div>

      
      {isEditModalOpen && (
        <EditStoryModal
          onClose={() => setIsEditModalOpen(false)}
          storyData={story} 
        />
      )}

      
      {isStoryModalOpen && (
        <StoryModal 
          onClose={() => setIsStoryModalOpen(false)} 
          story={story} 
        />
      )}
    </>
  );
};

export default StoryCard;
