import React, { useState } from 'react';
import './Register.css';
import eye from '../../assets/eye.png';
import close from '../../assets/close.png';
import { registerUser } from '../../services/authServices'; // Import the service
import { toast } from 'react-toastify';

const Register = ({ onClose, onLogin }) => {
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
  
      // Show success message using toast and delay modal close until after message is shown
      toast.success(data.message, {
        onClose: () => {
          onLogin(); // Notify header that the user is now logged in
          onClose(); // Close the modal after the toast is shown
        },
      });
      
    } catch (error) {
      setErrorMessage(error.message); // Set error message
      toast.error(error.message); // Show error toast
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
                src={eye}
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
