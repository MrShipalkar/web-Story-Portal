import React, { useState, useEffect } from 'react';
import './EditStoryModal.css'; 
import CloseSlide from '../../assets/closeSlide.png'; 
import { editStory } from '../../services/storyServices'; 

const EditStoryModal = ({ onClose, storyData }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [slides, setSlides] = useState(storyData ? storyData.slides : [
    { heading: '', description: '', url: '' },
    { heading: '', description: '', url: '' },
    { heading: '', description: '', url: '' }
  ]);
  const [category, setCategory] = useState(storyData ? storyData.slides[0]?.category : ''); 
  const [errorMessage, setErrorMessage] = useState('');
  const maxSlides = 6;

  const categories = ["Food", "Fashion", "Sports", "Travel", "Movie", "Education", "Business"];

  useEffect(() => {
    if (storyData) {
      setSlides(storyData.slides);
      setCategory(storyData.slides[0]?.category); 
    }
  }, [storyData]);

  const handleNext = () => {
    if (currentSlide < slides.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const addSlide = () => {
    if (slides.length < maxSlides) {
      setSlides([...slides, { heading: '', description: '', url: '' }]);
    }
  };

  const removeSlide = (index) => {
    if (slides.length > 3) {
      const newSlides = slides.filter((_, i) => i !== index);
      let newCurrentSlide = currentSlide;
      if (currentSlide > newSlides.length) {
        newCurrentSlide = newSlides.length;
      }
      setSlides(newSlides);
      setCurrentSlide(newCurrentSlide);
    }
  };

  const handleSlideChange = (e) => {
    const { name, value } = e.target;
    const updatedSlides = [...slides];
    if (updatedSlides[currentSlide - 1]) {
      updatedSlides[currentSlide - 1] = { ...updatedSlides[currentSlide - 1], [name]: value };
      setSlides(updatedSlides);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!category) {
        setErrorMessage("Please select a category");
        return;
      }

      const token = localStorage.getItem('token');
      const author = localStorage.getItem('username');
      if (!token) {
        setErrorMessage('No authentication token found. Please log in.');
        return;
      }
      if (!author) {
        setErrorMessage('No author found. Please log in.');
        return;
      }

      const updatedStoryData = {
        author,
        slides: slides.map((slide, index) => ({
          slideNumber: index + 1,
          heading: slide.heading,
          description: slide.description,
          url: slide.url, // Ensure "url" is used for image URLs
          category,
        })),
      };

      console.log('Story ID:', storyData._id);
      console.log('Updated Data:', updatedStoryData); 

      const response = await editStory(storyData._id, updatedStoryData, token);
      console.log('Story edited successfully:', response);

      onClose(); 
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage(error.message || 'An error occurred while editing the story');
    }
  };

  return (
    <>
      <div className="edit-story-overlay" onClick={onClose}></div>
      <div className="edit-story-modal">
        <div className="edit-story-header">
          <img src={CloseSlide} onClick={onClose} alt="Close modal" />
          <p>Add upto 6 slides </p>
        </div>
        <div className="edit-slide-btn-container">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`edit-slide-btn ${index + 1 === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index + 1)}
            >
              Slide {index + 1}
              {index > 2 && (
                <span className="edit-close-icon" onClick={(e) => {
                  e.stopPropagation();
                  removeSlide(index);
                }}>
                  <img src={CloseSlide} alt="Remove slide" />
                </span>
              )}
            </button>
          ))}
          {slides.length < maxSlides && (
            <button className="edit-add-slide-btn" onClick={addSlide}>
              Add +
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
        <h2 className='title'>Add story to feed</h2>
          <div>
            <label>Heading:</label>
            <input
              type="text"
              name="heading"
              value={slides[currentSlide - 1]?.heading || ''}
              onChange={handleSlideChange}
              placeholder="Your heading"
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={slides[currentSlide - 1]?.description || ''}
              onChange={handleSlideChange}
              placeholder="Story Description"
            ></textarea>
          </div>
          <div>
            <label>Image URL:</label>
            <input
              type="text"
              name="url" // Match the field name with the backend data
              value={slides[currentSlide - 1]?.url || ''} 
              onChange={handleSlideChange}
              placeholder="Add Image URL"
            />
          </div>

          <div>
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="btn-container">
            <button type="button" className="edit-previous-btn" onClick={handlePrevious}>
              Previous
            </button>
            <button type="button" className="edit-next-btn" onClick={handleNext}>
              Next
            </button>
            <button type="submit" className="edit-post-btn">
              Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditStoryModal;
