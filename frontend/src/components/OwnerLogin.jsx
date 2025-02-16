import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/OwnerLogin.css"; // Ensure correct path
import axios from "axios";

const OwnerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setLoading(true);
    const cleanedEmail = email.trim().toLowerCase(); // Convert email to lowercase
    const cleanedPassword = password.trim(); // Remove any spaces

    console.log("🔵 Sending Data:", { email: cleanedEmail, password: cleanedPassword });

    try {
      
      const response = await axios.post("http://localhost:5000/api/owners/login", {
        email: cleanedEmail, password: cleanedPassword
      },{
      headers: {
        "Content-Type": "application/json",
      },

    });

    console.log("🔍 Backend Response:", response); 

    if (response.status === 200 && response.data.token) {
      console.log("✅ Login successful:", response.data);
      localStorage.setItem("ownerToken", response.data.token);
      localStorage.setItem("ownerId", response.data.ownerId);
      
      await axios.post("http://localhost:5000/api/owners/send-verification", {
        email: cleanedEmail,
      });
      console.log("📧 Verification email sent!");
      
      navigate("/owner-dashboard");
  } else {
      setError("Login successful, but no token received.");
  }
} catch (error) {
  console.error("❌ Login Error:", error.response?.data || error.message);
  setError(error.response?.data?.message || "Login failed. Please try again.");
} finally {
  setLoading(false);
}
};
  

  return (
    <div className="owner-login-container">
      <div className="login-form">
        <h2>Owner Login</h2>

        {error && <p className="error-message">{error}</p>} {/* Display error messages */}

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input 
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />

          <label>Password</label>
          <input 
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

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

export default OwnerLogin;
