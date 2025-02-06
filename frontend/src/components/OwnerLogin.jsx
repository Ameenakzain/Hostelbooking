import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/OwnerLogin.css"; // Ensure correct path

const OwnerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    console.log("Sending Data:", { email: trimmedEmail, password: trimmedPassword });
    

    try {
      const response = await fetch("http://localhost:5000/api/owners/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      const data = await response.json();
      console.log("🔹 Response Data:", data);

      if (response.ok) {
        const data = await response.json();
        alert("Login successful!");
        console.log("Logged-in user:", data);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Login failed");
      }

      if (!data.token) {
        setError("Login successful, but no token received.");
        return;
      }

      // Store token and owner ID in local storage
      localStorage.setItem("ownerToken", data.token);
      localStorage.setItem("ownerId", data.ownerId);

      // Redirect to Owner Dashboard
      navigate("/owner-dashboard");

    } catch (error) {
      console.error("❌ Error:", error);
      setError("An error occurred. Please try again.");
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

export default OwnerLoginPage;