import React, { useState } from 'react';
import './Register.css';
import eye from '../../assets/eye.png';
import close from '../../assets/close.png';
import { registerUser } from '../../services/authServices'; // Import the service

const Register = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(username, password); // Call the service
      alert(data.message); // Show success message or handle success
      onClose(); // Close the modal
    } catch (error) {
      setErrorMessage(error); // Set error message
    }
  };

  return (
    <>
      <div className="register-overlay" onClick={onClose}></div>
      <div className="register-modal">
        <button className="close-btn" onClick={onClose}>
          <img src={close} alt="Close" />
        </button>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="username-div">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username state
            />
          </div>

          <div className="password-container">
            <label htmlFor="password">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              <img
                src={passwordVisible ? eye : eye}
                alt="Toggle Password Visibility"
                className="toggle-icon"
              />
            </span>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error if exists */}

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
