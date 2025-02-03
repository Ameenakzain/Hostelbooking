import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/OwnerLogin.css"; // Make sure the correct path is used

const OwnerLoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle owner login or signup logic here
  };

  return (
    <div className="owner-login-container">
      <div className="login-form">
        <h2>Owner Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />
          <button type="submit">Login</button>
        </form>
        <a href="/forgot-password" className="forgot-password">
          Forgot Password?
        </a>
        <div className="signup-link">
          <p>Don't have an account?</p>
          <Link to="/owner-signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerLoginPage;
