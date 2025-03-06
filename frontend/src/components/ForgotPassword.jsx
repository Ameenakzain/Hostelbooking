import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css"; // Update path if needed

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    //const trimmedInput = emailOrPhone.trim();

    try {
      
        const response = await fetch("http://localhost:5000/api/owners/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send reset instructions.");
        return;
      }
      setMessage(data.message || "Reset instructions sent to your email");
      setError("");
      navigate("/reset-password", { state: { email} });
    } catch (err) {
      console.error("Error sending reset instructions:", err);
      setError("An error occurred. Please try again.");
    }
  };

  /*const handleSubmit = (e) => {
    e.preventDefault();
    handleForgotPassword();
  };*/

  return (
    <div className="forgot-password-container">
      <header className="header">
        <h1>BOOKmyHOSTEL</h1>
      </header>

      <div className="forgot-password-form">
        <h2>Forgot your password?</h2>
        <p>Enter your email or phone number and we'll help you reset your password.</p>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        
          <input
            type="email"
            placeholder="Enter email "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleForgotPassword}>Submit</button>
        

        <button onClick={() => navigate("/owner-login")} className="back-to-login">
          &#8592; Back to login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;