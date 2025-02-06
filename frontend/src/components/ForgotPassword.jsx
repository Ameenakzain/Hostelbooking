import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css"; // Update path if needed

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    const trimmedInput = emailOrPhone.trim();

    try {
      //const response = await fetch("http://localhost:5000/api/owners/forgot-password", {
        const response = await fetch("http://localhost:5000/api/owners/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrPhone: trimmedInput }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/reset-password", { state: { emailOrPhone: trimmedInput } });
      }
      

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to send reset instructions. Please try again.");
        return;
      }

      const data = await response.json();
      setMessage(data.message || "Reset instructions sent to your email or phone.");
      setError("");
      navigate("/reset-password", { state: { emailOrPhone: trimmedInput } });
    } catch (err) {
      console.error("Error sending reset instructions:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleForgotPassword();
  };

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

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter email or phone number"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>

        <button onClick={() => navigate("/owner-login")} className="back-to-login">
          &#8592; Back to login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
