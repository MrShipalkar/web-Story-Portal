// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './header.css'; 

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-links">
          <Link to="/register" className="register-button">Register Now</Link>
          <Link to="/login" className="signin-button">Sign In</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
