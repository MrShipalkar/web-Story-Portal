import React, { useState, useEffect } from 'react';
import './header.css';
import Register from '../register/register.jsx';
import SignIn from '../signIn/signIn.jsx';
import Bookmark from '../../assets/Bookmark.png';
import ham from '../../assets/ham.png';
import Profile from '../../assets/Profile.png';
import AddStoryModal from '../addStoryModal/addStoryModal.jsx'; // Import the AddStoryModal component
import { useNavigate } from 'react-router-dom'; 

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState(''); 
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false); // Add story modal state
  const navigate = useNavigate();
  const handleBookmarkClick = () => {
    navigate('/bookmarked-stories'); // Navigate to bookmarked stories page
  };
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (loggedInStatus) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
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
  const handleAddStoryClick = () => setIsAddStoryModalOpen(true); // Open AddStory modal
  const handleCloseRegisterModal = () => setIsRegisterModalOpen(false);
  const handleCloseSignInModal = () => setIsSignInModalOpen(false);
  const handleCloseAddStoryModal = () => setIsAddStoryModalOpen(false); // Close AddStory modal
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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
                <button className="hamburger-menu" onClick={toggleDropdown}>
                  <img src={ham} alt="" />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown">
                    <span className="username">{username}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="nav-links">
              <button className="header-register-button" onClick={handleRegisterClick}>
                Register Now
              </button>
              <button className="header-signin-button" onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
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

      {isAddStoryModalOpen && <AddStoryModal onClose={handleCloseAddStoryModal} />} {/* AddStory Modal */}
    </>
  );
};

export default Header;
