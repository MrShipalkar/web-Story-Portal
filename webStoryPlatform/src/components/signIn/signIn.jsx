import React, { useState } from 'react';
import './signIn.css'; 
import eye from '../../assets/eye.png';
import close from '../../assets/close.png';
import { loginUser } from '../../services/authServices'; 
import { toast } from 'react-toastify';

const SignIn = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password); 
      
      
      toast.success(data.message, {
        onClose: () => {
          onLogin();
          onClose();
          window.location.reload(); 
        },
      });
    } catch (error) {
      
      console.error('Login error:', error);
  
      
      const errorMsg = error.response?.data?.message || 'Invalid username or password.';
  
     
      setErrorMessage(errorMsg);
  
      
      toast.error(errorMsg);
    }
  };
  
  
  
  return (
    <>
      <div className="signin-overlay" onClick={onClose}></div>
      <div className="signin-modal">
        <button className="signin-close-btn" onClick={onClose}>
          <img src={close} alt="Close" />
        </button>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="signin-username-div">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div className="signin-password-container">
            <label htmlFor="password">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <span className="signin-password-toggle" onClick={togglePasswordVisibility}>
              <img
                src={eye} 
                alt="Toggle Password Visibility"
                className="toggle-icon"
              />
            </span>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>} 

          <button type="submit" className="signin-btn">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default SignIn;
