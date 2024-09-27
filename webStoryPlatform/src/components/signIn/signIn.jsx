import React, { useState } from 'react';
import './SignIn.css'; // Separate CSS for SignIn component
import eye from '../../assets/eye.png';
import close from '../../assets/close.png';
import { loginUser } from '../../services/authServices'; // Import loginUser function

const SignIn = ({ onClose }) => {
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
            const data = await loginUser(username, password); // Call the login service
            alert(data.message); // Show success message or handle success
            onClose(); // Close the modal
        } catch (error) {
            setErrorMessage(error); // Show error message
        }
    };

    return (
        <>
            <div className="signin-overlay" onClick={onClose}></div>
            <div className="signin-modal">
                <button className="signin-close-btn" onClick={onClose}>
                    <img src={close} alt="close" />
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
                            onChange={(e) => setUsername(e.target.value)} // Update username state
                        />
                    </div>

                    <div className="signin-password-container">
                        <label htmlFor="password">Password</label>
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Update password state
                        />
                        <span
                            className="signin-password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            <img
                                src={eye} // Toggle eye icon
                                alt="Toggle Password Visibility"
                                className="toggle-icon"
                            />
                        </span>
                    </div>

                    {/* Centered and styled error message */}
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
