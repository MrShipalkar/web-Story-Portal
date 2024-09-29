import React, { useState, useEffect, useRef } from 'react';
import './StoryModal.css';
import leftArrow from '../../assets/leftArrow.png';
import rightArrow from '../../assets/rightArrow.png';
import crossicon from '../../assets/cross.png';
import shareIcon from '../../assets/share.png';
import likeIcon from '../../assets/heart.png'; // Unliked heart icon
import likedIcon from '../../assets/likedHeart.png'; // Liked heart icon
import bookmarkIcon from '../../assets/bookmark.png'; // Unbookmarked icon
import bookmarkedIcon from '../../assets/bookmarked.png'; // Bookmarked icon
import downloadIcon from '../../assets/download.png'; // Importing the download icon
import { toggleLikeSlide, fetchUserLikedSlides, toggleBookmarkSlide, fetchUserBookmarkedSlides } from '../../services/storyServices'; // Import necessary functions

// Import or define the SignInModal component
import SignInModal from '../signIn/signIn'; // Assuming you have a SignInModal component

const StoryModal = ({ story, onClose, initialSlide = 0 }) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [likedSlides, setLikedSlides] = useState([]); // Track which slides are liked by the user
  const [bookmarkedSlides, setBookmarkedSlides] = useState([]); // Track bookmarked slides
  const [notification, setNotification] = useState(false); // To show or hide the copied notification
  const [showSignInModal, setShowSignInModal] = useState(false); // Control SignIn modal visibility
  const slideDuration = 10; // Slide duration in seconds

  const timerRef = useRef(null); // Ref to store the timer
  const progressBarRef = useRef(null); // Ref for progress bar element

  // Check for auth-token when the component mounts
  useEffect(() => {
    const authToken = localStorage.getItem('token'); // Check if auth-token exists

    if (authToken) {
      setIsLoggedIn(true);
      // Fetch liked and bookmarked slides for the current story
      fetchLikedSlides(authToken);
      fetchBookmarkedSlides(authToken);
    } else {
      setIsLoggedIn(false);
    }
  }, [story._id]);

  // Function to fetch liked slides from the backend
  const fetchLikedSlides = async (authToken) => {
    try {
      const likedSlidesData = await fetchUserLikedSlides(story._id, authToken);
      setLikedSlides(likedSlidesData); // Set the liked slides from the backend
    } catch (error) {
      console.error('Error fetching liked slides:', error);
    }
  };

  // Function to fetch bookmarked slides from the backend
  const fetchBookmarkedSlides = async (authToken) => {
    try {
      const response = await fetchUserBookmarkedSlides(story._id, authToken);
      setBookmarkedSlides(response.bookmarkedSlides || []); // Set the bookmarked slides from the backend
    } catch (error) {
      console.error('Error fetching bookmarked slides:', error);
    }
  };

  // Function to show the SignIn modal when the user is not logged in
  const showSignInModalHandler = () => {
    setShowSignInModal(true);
  };

  // Function to close the SignIn modal
  const closeSignInModalHandler = () => {
    setShowSignInModal(false);
  };

  // Function to toggle bookmark/unbookmark
  const handleBookmark = async () => {
    const authToken = localStorage.getItem('token'); // Get the auth token

    if (!authToken) {
      showSignInModalHandler(); // Show SignIn modal if not logged in
      return;
    }

    try {
      // Call the API to bookmark/unbookmark the current slide
      const response = await toggleBookmarkSlide(story._id, story.slides[currentSlide].slideNumber, authToken);

      // Update the bookmarked slides state locally
      if (bookmarkedSlides.includes(story.slides[currentSlide].slideNumber)) {
        setBookmarkedSlides((prevBookmarkedSlides) =>
          prevBookmarkedSlides.filter(slide => slide !== story.slides[currentSlide].slideNumber)
        );
      } else {
        setBookmarkedSlides((prevBookmarkedSlides) => [
          ...prevBookmarkedSlides,
          story.slides[currentSlide].slideNumber,
        ]);
      }
    } catch (error) {
      console.error('Error updating bookmark status:', error);
    }
  };

  // Function to toggle like/unlike
  const handleLike = async () => {
    const authToken = localStorage.getItem('token'); // Get the auth token

    if (!authToken) {
      showSignInModalHandler(); // Show SignIn modal if not logged in
      return;
    }

    try {
      // Call the API to like/unlike the current slide
      const response = await toggleLikeSlide(story._id, story.slides[currentSlide].slideNumber, authToken);

      // Update the liked slides state locally
      if (likedSlides.includes(story.slides[currentSlide].slideNumber)) {
        setLikedSlides((prevLikedSlides) => prevLikedSlides.filter(slide => slide !== story.slides[currentSlide].slideNumber));
        story.slides[currentSlide].likeCount -= 1;
      } else {
        setLikedSlides((prevLikedSlides) => [...prevLikedSlides, story.slides[currentSlide].slideNumber]);
        story.slides[currentSlide].likeCount += 1;
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

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
          {/* Bookmark button */}
          <img
            src={bookmarkedSlides.includes(story.slides[currentSlide].slideNumber) ? bookmarkedIcon : bookmarkIcon} // Toggle between bookmarked and unbookmarked images
            alt="Bookmark"
            onClick={handleBookmark} // Call handleBookmark on click
            style={{ cursor: 'pointer', width: '24px', height: '24px', marginRight: '8px' }} // Ensure size and clickability
          />

          {/* Download button */}
          <img
            src={downloadIcon}
            alt="Download"
            className="story-modal-download-btn"
            style={{ visibility: isLoggedIn ? 'visible' : 'hidden' }} // Toggle visibility
            onClick={downloadImage} // Call downloadImage function on click
          />

          {/* Like button with conditionally rendered heart icons and like count */}
          <div className="like-section" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={likedSlides.includes(story.slides[currentSlide].slideNumber) ? likedIcon : likeIcon} // Toggle between liked and unliked images
              alt="Like"
              onClick={handleLike} // Call handleLike on click
              style={{ cursor: 'pointer', width: '24px', height: '24px', marginRight: '8px' }} // Ensure size and clickability
            />
            <span style={{ color: 'white', fontSize: '14px' }}>
              {story.slides[currentSlide].likeCount} {/* Display the like count */}
            </span>
          </div>
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

      {/* SignIn Modal */}
      {showSignInModal && (
        <SignInModal onClose={closeSignInModalHandler} /> // Assuming you have a SignInModal component
      )}
    </div>
  );
};

export default StoryModal;
