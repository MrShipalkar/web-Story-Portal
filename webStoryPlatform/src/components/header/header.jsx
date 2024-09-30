import React, { useState, useEffect } from 'react';
import './header.css';
import Register from '../register/register.jsx';
import SignIn from '../signIn/signIn.jsx';
import Bookmark from '../../assets/Bookmark.png';
import ham from '../../assets/ham.png';
import Profile from '../../assets/Profile.png';
import cross from '../../assets/rescross.png'; // Close icon for responsive menu
import AddStoryModal from '../addStoryModal/addStoryModal.jsx';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false); // Track if we are in mobile view
  const navigate = useNavigate();

  const handleBookmarkClick = () => {
    navigate('/bookmarked-stories');
  };

  const handleYourStoriesClick = () => {
    closeDropdown();
    navigate('/your-stories'); // Navigate to the YourStories component
  };

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (loggedInStatus) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }

    // Handle window resize to detect mobile view
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize); // Clean up event listener
  }, []);

  useEffect(() => {
    if (isRegisterModalOpen || isSignInModalOpen || isAddStoryModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isRegisterModalOpen, isSignInModalOpen, isAddStoryModalOpen]);

  const handleRegisterClick = () => setIsRegisterModalOpen(true);
  const handleSignInClick = () => setIsSignInModalOpen(true);
  const handleAddStoryClick = () => setIsAddStoryModalOpen(true);
  const handleCloseRegisterModal = () => setIsRegisterModalOpen(false);
  const handleCloseSignInModal = () => setIsSignInModalOpen(false);
  const handleCloseAddStoryModal = () => setIsAddStoryModalOpen(false);
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    window.location.reload()
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <>
      <header className="header">
        <nav className="nav">
          {isLoggedIn ? (
            <div className="user-actions-wrapper">
              <div className="bookmark-story-wrapper">
                <button className="bookmark-btn" onClick={handleBookmarkClick}>
                  <img src={Bookmark} alt="Bookmark" /> Bookmarks
                </button>
                <button className="header-addstory-button" onClick={handleAddStoryClick}>
                  Add Story
                </button>
              </div>
              <div className="profile-section">
                <img
                  src={Profile}
                  alt="Profile"
                  className="user-profile"
                />
              </div>
              <button className="hamburger-menu" onClick={toggleDropdown}>
                <img src={ham} alt="Menu" />
              </button>
              {isDropdownOpen && (
                <div className="dropdown">
                  <span className="username">{username}</span>
                  {isMobileView && (
                    <>
                      <button className="close-dropdown-btn" onClick={closeDropdown}>
                        <img src={cross} alt="cross" />
                      </button>
                      <img
                        src={Profile}
                        alt="Profile"
                        className="user-profile"
                      />
                      <button className="header-addstory-button" onClick={handleYourStoriesClick}>
                        Your Story
                      </button>
                      <button className="header-addstory-button" onClick={handleAddStoryClick}>
                        Add Story
                      </button>
                      <button className="bookmark-btn" onClick={handleBookmarkClick}>
                        <img src={Bookmark} alt="Bookmark" /> Bookmarks
                      </button>
                    </>
                  )}
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="nav-links">
                <button className="header-register-button" onClick={handleRegisterClick}>
                  Register Now
                </button>
                <button className="header-signin-button" onClick={handleSignInClick}>
                  Sign In
                </button>
              </div>

              {isMobileView && (
                <button className="hamburger-menu" onClick={toggleDropdown}>
                  <img src={ham} alt="Menu" />
                </button>
              )}
              {isDropdownOpen && isMobileView && (
                <div className="dropdown">
                  <button className="close-dropdown-btn" onClick={closeDropdown}>
                    <img src={cross} alt="cross" />
                  </button>
                  <button className="drop-header-register-button" onClick={handleRegisterClick}>
                    Register
                  </button>
                  <button className="drop-header-signin-button" onClick={handleSignInClick}>
                    Sign In
                  </button>
                </div>
              )}
            </>
          )}
        </nav>
      </header>

      {isRegisterModalOpen && (
        <Register
          onClose={handleCloseRegisterModal}
          onLogin={() => {
            setIsLoggedIn(true);
            setUsername(localStorage.getItem('username'));
          }}
        />
      )}

      {isSignInModalOpen && (
        <SignIn
          onClose={handleCloseSignInModal}
          onLogin={() => {
            setIsLoggedIn(true);
            setUsername(localStorage.getItem('username'));
          }}
        />
      )}

      {isAddStoryModalOpen && <AddStoryModal onClose={handleCloseAddStoryModal} />}
    </>
  );
};

export default Header;
