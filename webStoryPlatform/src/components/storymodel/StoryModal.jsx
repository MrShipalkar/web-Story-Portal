import React, { useState, useEffect, useRef } from 'react';
import './StoryModal.css';
import leftArrow from '../../assets/leftArrow.png';
import rightArrow from '../../assets/rightArrow.png';
import crossicon from '../../assets/cross.png';
import shareIcon from '../../assets/share.png';
import likeIcon from '../../assets/heart.png';
import bookmarkIcon from '../../assets/storybookmark.png';
import downloadIcon from '../../assets/download.png'; // Importing the download icon

const StoryModal = ({ story, onClose, initialSlide = 0 }) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To track login status
  const [notification, setNotification] = useState(false); // To show or hide the copied notification
  const slideDuration = 10; // Slide duration in seconds

  const timerRef = useRef(null); // Ref to store the timer
  const progressBarRef = useRef(null); // Ref for progress bar element

  // Check for auth-token when the component mounts
  useEffect(() => {
    const authToken = localStorage.getItem('token'); // Check if auth-token exists
    setIsLoggedIn(!!authToken); // If token is found, set user as logged in
  }, []);

  // Function to go to the next slide
  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % story.slides.length); // Loop through slides
  };

  // Function to go to the previous slide
  const goToPreviousSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? story.slides.length - 1 : prevSlide - 1));
  };

  // Function to copy the slide link to clipboard
  const copyToClipboard = () => {
    if (story._id) {
      const currentSlideLink = `${window.location.origin}/stories/${story._id}/slides/${currentSlide + 1}`;
      navigator.clipboard.writeText(currentSlideLink)
        .then(() => {
          setNotification(true); // Show the notification after copying
          setTimeout(() => setNotification(false), 3000); // Hide notification after 3 seconds
        })
        .catch(err => console.error('Could not copy text: ', err));
    }
  };

  // Function to download the current slide image
  const downloadImage = () => {
    const currentImageURL = story.slides[currentSlide].url;
    fetch(currentImageURL, { mode: 'cors' })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `slide-${currentSlide + 1}.jpg`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Free up memory
      })
      .catch(error => console.error('Image download error:', error));
  };

  useEffect(() => {
    // Prevent background scrolling when modal opens
    document.body.style.overflow = 'hidden';

    // Reset the progress bar when the slide changes
    if (progressBarRef.current) {
      progressBarRef.current.style.transition = 'none';
      progressBarRef.current.style.width = '0%';
    }

    setTimeout(() => {
      if (progressBarRef.current) {
        progressBarRef.current.style.transition = `width ${slideDuration}s linear`;
        progressBarRef.current.style.width = '100%';
      }
    }, 100);

    // Set up the timer for moving to the next slide
    timerRef.current = setTimeout(() => goToNextSlide(), slideDuration * 1000);

    return () => {
      clearTimeout(timerRef.current); // Clear timeout on unmount or slide change
      document.body.style.overflow = 'auto'; // Re-enable scrolling when modal is closed
    };
  }, [currentSlide]);

  return (
    <div className="story-modal-overlay">
      <div className="story-modal-container">

        {/* Progress Bar */}
        <div className="story-modal-progress-bar">
          {story.slides.map((_, index) => (
            <div
              key={index}
              className="story-progress-bar-item"
              style={{
                width: currentSlide === index ? '100%' : currentSlide > index ? '100%' : '0%',
              }}
            >
              {currentSlide === index && <div ref={progressBarRef} className="progress-bar-active"></div>}
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button className="story-modal-close-btn" onClick={onClose}>
          <img src={crossicon} alt="Close" />
        </button>

        {/* Share Button */}
        <button className="story-modal-share-btn" onClick={copyToClipboard}>
          <img src={shareIcon} alt="Share" />
        </button>

        {/* StoryCard Styling */}
        <div className="story-card">
          <div className="story-card__image">
            <img src={story.slides[currentSlide].url} alt={story.slides[currentSlide].heading} />
            <div className="story-card__gradient">
              <h3>{story.slides[currentSlide].heading}</h3>
              <p>{story.slides[currentSlide].description}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="story-modal-actions">
          <img src={bookmarkIcon} alt="Bookmark" />
          <img
            src={downloadIcon}
            alt="Download"
            className="story-modal-download-btn"
            style={{ visibility: isLoggedIn ? 'visible' : 'hidden' }} // Toggle visibility
            onClick={downloadImage} // Call downloadImage function on click
          />
          <img src={likeIcon} alt="Like" />
        </div>

        {/* Notification for link copied */}
        {notification && (
          <div className="link-notification">
            Link copied to clipboard
          </div>
        )}

      </div>

      {/* Navigation Arrows */}
      <button className="story-modal-prev-btn" onClick={goToPreviousSlide}>
        <img src={leftArrow} alt="Previous" />
      </button>

      <button className="story-modal-next-btn" onClick={goToNextSlide}>
        <img src={rightArrow} alt="Next" />
      </button>
    </div>
  );
};

export default StoryModal;
