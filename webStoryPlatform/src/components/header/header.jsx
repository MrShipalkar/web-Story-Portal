import React, { useState, useEffect } from 'react';
import './header.css';
import Register from '../register/register.jsx';
import SignIn from '../signIn/signIn.jsx';
import Bookmark from '../../assets/Bookmark.png';
import ham from '../../assets/ham.png';
import Profile from '../../assets/Profile.png';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage user login
  const [username, setUsername] = useState(''); // State to store username
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State to manage the Register modal
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false); // State to manage the Sign In modal
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for toggling the dropdown

  // Check for logged-in status and username from localStorage when the component mounts
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username'); // Get username from localStorage
    if (loggedInStatus) {
      setIsLoggedIn(true); // Set the state if the user is already logged in
      setUsername(storedUsername); // Set the username in state
    }
  }, []);

  // Disable scrolling when any modal is open
  useEffect(() => {
    if (isRegisterModalOpen || isSignInModalOpen) {
      document.body.style.overflow = 'hidden'; // Disable background scrolling
    } else {
      document.body.style.overflow = ''; // Enable background scrolling
    }
  }, [isRegisterModalOpen, isSignInModalOpen]);

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true); // Open Register modal
  };

  const handleSignInClick = () => {
    setIsSignInModalOpen(true); // Open Sign In modal
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false); // Close Register modal
  };

  const handleCloseSignInModal = () => {
    setIsSignInModalOpen(false); // Close Sign In modal
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Clear the login flag
    localStorage.removeItem('username'); // Clear the username from localStorage
    setIsLoggedIn(false); // Log the user out and change the header
    setUsername(''); // Clear the username in the state
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  return (
    <>
      <header className="header">
        <nav className="nav">
          {isLoggedIn ? (
            <div className="user-actions-wrapper">
              <div className="bookmark-story-wrapper">
                <button className="bookmark-btn">
                  <img src={Bookmark} alt="Bookmark" /> Bookmarks
                </button>
                <button className="header-addstory-button">Add Story</button>
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
                    <span className="username">{username}</span> {/* Show username */}
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
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

      {/* Conditionally render the Register modal */}
      {isRegisterModalOpen && (
        <Register
          onClose={handleCloseRegisterModal}
          onLogin={() => {
            setIsLoggedIn(true);
            setUsername(localStorage.getItem('username')); // Fetch username from localStorage after login
          }}
        />
      )}

      {/* Conditionally render the Sign In modal */}
      {isSignInModalOpen && (
        <SignIn
          onClose={handleCloseSignInModal}
          onLogin={() => {
            setIsLoggedIn(true);
            setUsername(localStorage.getItem('username')); // Fetch username from localStorage after login
          }}
        />
      )}
    </>
  );
};

export default Header;
