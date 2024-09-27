import React, { useState, useEffect } from 'react';
import './header.css';
import Register from '../register/register.jsx'; // Import the Register modal
import SignIn from '../signIn/signIn.jsx'; // Import the Sign In modal

const Header = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State to manage the Register modal
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false); // State to manage the Sign In modal

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

  return (
    <>
      <header className="header">
        <nav className="nav">
          <div className="nav-links">
            <button className="header-register-button" onClick={handleRegisterClick}>
              Register Now
            </button>
            <button className="header-signin-button" onClick={handleSignInClick}>
              Sign In
            </button>
          </div>
        </nav>
      </header>

      {/* Conditionally render the Register modal */}
      {isRegisterModalOpen && <Register onClose={handleCloseRegisterModal} />}

      {/* Conditionally render the Sign In modal */}
      {isSignInModalOpen && <SignIn onClose={handleCloseSignInModal} />}
    </>
  );
};

export default Header;
