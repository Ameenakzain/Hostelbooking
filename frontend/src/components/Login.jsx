import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh

    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      // Send login request to the backend
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);
      setErrorMessage(""); // Clear error message if login succeeds

      // Redirect to user dashboard
      navigate("/user-dashboard", { state: { user: response.data.user } });
    } catch (error) {
      console.error("Error logging in:", error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <div className="user-login-container">
      <div className="login-form">
        <h2>Login</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              placeholder="Enter your password"
              required
            />
          </div>
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
