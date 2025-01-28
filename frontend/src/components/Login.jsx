import React, { useState } from "react";
import "../styles/Login.css";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login or signup logic here
  };

  return (
    <div className="user-login-container">
      <div className="login-form">
        <h2>Login</h2>
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
          <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
