import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StoryModal from '../../components/storymodel/StoryModal.jsx'; // The modal component
import axios from 'axios';

const StoryModalWrapper = ({ history }) => {
  const { storyId, slideNumber } = useParams(); // Extract storyId and slideNumber from URL
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the story by ID when the component mounts
    const fetchStory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/story/stories/${storyId}`);
        setStory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching story:', error);
        setLoading(false);
        navigate('/');
      }
    };

    fetchStory();
  }, [storyId]);

  // Handle closing the modal and redirecting back
  const closeModal = () => {
    history.push('/'); // Redirect back to the main page when modal is closed
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {story && (
        <StoryModal
          story={story}
          initialSlide={parseInt(slideNumber, 10) - 1} // Set the initial slide based on URL
          onClose={() => navigate('/')}
        />
      )}
    </>
  );
};

export default StoryModalWrapper;
