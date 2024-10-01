import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StoryModal from '../../components/storymodel/StoryModal.jsx'; 
import { fetchStoryById } from '../../services/storyServices'; 

const StoryModalWrapper = () => {
  const { storyId, slideNumber } = useParams(); 
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  
    const loadStory = async () => {
      try {
        const storyData = await fetchStoryById(storyId); 
        setStory(storyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching story:', error);
        setLoading(false);
        navigate('/');
      }
    };

    loadStory();
  }, [storyId, navigate]);

  
  const closeModal = () => {
    navigate('/'); 
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {story && (
        <StoryModal
          story={story}
          initialSlide={parseInt(slideNumber, 10) - 1} 
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default StoryModalWrapper;
