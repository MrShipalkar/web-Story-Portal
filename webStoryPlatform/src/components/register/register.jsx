import React, { useState } from 'react';
import './register.css';
import eye from '../../assets/eye.png';
import close from '../../assets/close.png';
import { registerUser } from '../../services/authServices'; 
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
  
    
    setErrorMessage('');
  
    
    if (!username) {
      setErrorMessage('Please enter a username.');
      return;
    }
  
    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }
  
    try {
      const data = await registerUser(username, password);
  
      toast.success(data.message, {
        onClose: () => {
          onLogin(); 
          onClose(); 
        },
      });
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
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
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div className="password-container">
            <label htmlFor="password">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              <img
                src={eye}
                alt="Toggle Password Visibility"
                className="toggle-icon"
              />
            </span>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>} 

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
