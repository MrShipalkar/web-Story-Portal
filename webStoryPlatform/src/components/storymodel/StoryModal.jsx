import React, { useState, useEffect, useRef } from 'react';
import './StoryModal.css';
import leftArrow from '../../assets/leftArrow.png';
import rightArrow from '../../assets/rightArrow.png';
import crossicon from '../../assets/cross.png';
import shareIcon from '../../assets/share.png';
import likeIcon from '../../assets/heart.png'; 
import likedIcon from '../../assets/likedHeart.png'; 
import bookmarkIcon from '../../assets/bookmark.png'; 
import bookmarkedIcon from '../../assets/bookmarked.png'; 
import downloadIcon from '../../assets/download.png'; 
import { toggleLikeSlide, fetchUserLikedSlides, toggleBookmarkSlide, fetchUserBookmarkedSlides } from '../../services/storyServices'; 

import SignInModal from '../signIn/signIn'; 

const StoryModal = ({ story, onClose, initialSlide = 0 }) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [likedSlides, setLikedSlides] = useState([]); 
  const [bookmarkedSlides, setBookmarkedSlides] = useState([]);
  const [notification, setNotification] = useState(false); 
  const [showSignInModal, setShowSignInModal] = useState(false); 
  const slideDuration = 10; 

  const timerRef = useRef(null); 
  const progressBarRef = useRef(null); 

  
  useEffect(() => {
    const authToken = localStorage.getItem('token'); 

    if (authToken) {
      setIsLoggedIn(true);
      
      fetchLikedSlides(authToken);
      fetchBookmarkedSlides(authToken);
    } else {
      setIsLoggedIn(false);
    }
  }, [story._id]);

  
  const fetchLikedSlides = async (authToken) => {
    try {
      const likedSlidesData = await fetchUserLikedSlides(story._id, authToken);
      setLikedSlides(likedSlidesData); 
    } catch (error) {
      console.error('Error fetching liked slides:', error);
    }
  };

  
  const fetchBookmarkedSlides = async (authToken) => {
    try {
      const response = await fetchUserBookmarkedSlides(story._id, authToken);
      setBookmarkedSlides(response.bookmarkedSlides || []); 
    } catch (error) {
      console.error('Error fetching bookmarked slides:', error);
    }
  };

  
  const showSignInModalHandler = () => {
    setShowSignInModal(true);
  };

  
  const closeSignInModalHandler = () => {
    setShowSignInModal(false);
  };

  
  const handleBookmark = async () => {
    const authToken = localStorage.getItem('token'); 

    if (!authToken) {
      showSignInModalHandler(); 
      return;
    }

    try {
     
      const response = await toggleBookmarkSlide(story._id, story.slides[currentSlide].slideNumber, authToken);

     
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

  
  const handleLike = async () => {
    const authToken = localStorage.getItem('token'); 

    if (!authToken) {
      showSignInModalHandler(); 
      return;
    }

    try {
      
      const response = await toggleLikeSlide(story._id, story.slides[currentSlide].slideNumber, authToken);

      
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

  
  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % story.slides.length); // Loop through slides
  };

  
  const goToPreviousSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? story.slides.length - 1 : prevSlide - 1));
  };

  
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
        window.URL.revokeObjectURL(url); 
      })
      .catch(error => console.error('Image download error:', error));
  };

  useEffect(() => {
   
    document.body.style.overflow = 'hidden';

   
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

    
    timerRef.current = setTimeout(() => goToNextSlide(), slideDuration * 1000);

    return () => {
      clearTimeout(timerRef.current); 
      document.body.style.overflow = 'auto'; 
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

        {/* Left and Right Clickable Areas */}
        <div className="story-modal-left" onClick={goToPreviousSlide}></div>
        <div className="story-modal-right" onClick={goToNextSlide}></div>

        {/* StoryCard Styling (with a specific modal view class) */}
        <div className={`story-card__image modal-view`}>
          <img src={story.slides[currentSlide].url} alt={story.slides[currentSlide].heading} />
          <div className="story-card__gradient">
            <h3>{story.slides[currentSlide].heading}</h3>
            <p>{story.slides[currentSlide].description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="story-modal-actions">
          {/* Bookmark button */}
          <img
            src={bookmarkedSlides.includes(story.slides[currentSlide].slideNumber) ? bookmarkedIcon : bookmarkIcon} 
            alt="Bookmark"
            onClick={handleBookmark} 
            style={{ cursor: 'pointer', width: '24px', height: '24px', marginRight: '8px' }}
          />

          {/* Download button */}
          <img
            src={downloadIcon}
            alt="Download"
            className="story-modal-download-btn"
            style={{ visibility: isLoggedIn ? 'visible' : 'hidden' }} 
            onClick={downloadImage}
          />

          {/* Like button with conditionally rendered heart icons and like count */}
          <div className="like-section" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={likedSlides.includes(story.slides[currentSlide].slideNumber) ? likedIcon : likeIcon}
              alt="Like"
              onClick={handleLike}
              style={{ cursor: 'pointer', width: '24px', height: '24px', marginRight: '8px' }}
            />
            <span style={{ color: 'white', fontSize: '14px' }}>
              {story.slides[currentSlide].likeCount}
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

      {/* SignIn Modal */}
      {showSignInModal && (
        <SignInModal onClose={closeSignInModalHandler} /> 
      )}
      {/*navigatinn button */}
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
