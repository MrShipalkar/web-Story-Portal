import React, { useState } from 'react';
import './AddStoryModal.css'; // Import the CSS
import CloseSlide from '../../assets/closeSlide.png';
import { addStory } from '../../services/storyServices'; // Import the addStory service
import { toast } from 'react-toastify';

const AddStoryModal = ({ onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [slides, setSlides] = useState([
        { heading: '', description: '', image: '' },
        { heading: '', description: '', image: '' },
        { heading: '', description: '', image: '' }
    ]);
    const [category, setCategory] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const maxSlides = 6;

    const categories = ["Food", "Fashion", "Sports", "Travel", "Movie", "Education", "Business"];

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
            setSlides([...slides, { heading: '', description: '', image: '' }]);
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
            // Check if category is selected
            if (!category) {
                setErrorMessage("Please select a category");
                return;
            }
    
            // Fetch token and author from localStorage
            const token = localStorage.getItem('token');
            const author = localStorage.getItem('username');
            
            // Validation checks
            if (!token) {
                setErrorMessage('No authentication token found. Please log in.');
                return;
            }
            if (!author) {
                setErrorMessage('No author found. Please log in.');
                return;
            }
    
            // Prepare story data
            const storyData = {
                author,
                slides: slides.map((slide, index) => ({
                    slideNumber: index + 1,
                    heading: slide.heading,
                    description: slide.description,
                    url: slide.image,
                    category,
                })),
            };
    
            // Call the service to add the story
            const response = await addStory(storyData, token);
    
            // Display success toast and then close modal
            toast.success('Story added successfully!', {
                onClose: () => {
                    onClose(); // Close the modal
                    window.location.reload(); // Reload the page after closing the modal
                },
            });
    
        } catch (error) {
            console.error('Error occurred while adding the story:', error);
            setErrorMessage(error.message || 'An error occurred while adding the story');
            
            // Show error toast if there's an issue
            toast.error(error.message || 'An error occurred while adding the story');
        }
    };


    return (
        <>
            <div className="add-story-overlay" onClick={onClose}></div>
            <div className="add-story-modal">

                <div className="add-story-header">

                    <img src={CloseSlide} onClick={onClose} alt="Close modal" />
                    <p>Add up to 6 slides</p>
                </div>
                <div className="slide-btn-container">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`slide-btn ${index + 1 === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index + 1)}
                        >
                            Slide {index + 1}
                            {index > 2 && (
                                <span className="close-icon" onClick={(e) => {
                                    e.stopPropagation();
                                    removeSlide(index);
                                }}>
                                    <img src={CloseSlide} alt="Remove slide" />
                                </span>
                            )}
                        </button>
                    ))}
                    {slides.length < maxSlides && (
                        <button className="add-slide-btn" onClick={addSlide}>
                            Add +
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit}>

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
                        <label>Image:</label>
                        <input
                            type="text"
                            name="image"
                            value={slides[currentSlide - 1]?.image || ''}
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
                        <p className='category-dis'>This field will be common for all slides</p>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="btn-container">
                        <button type="button" className="previous-btn" onClick={handlePrevious}>
                            Previous
                        </button>
                        <button type="button" className="next-btn" onClick={handleNext}>
                            Next
                        </button>
                        <button type="submit" className="post-btn">
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddStoryModal;
