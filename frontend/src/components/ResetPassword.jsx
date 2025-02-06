import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ForgotPassword.css"; // Use the same CSS file

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email/phone from query params or state (passed from ForgotPassword)
  const emailOrPhone = location.state?.emailOrPhone;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/owners/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reset the password. Please try again.");
        return;
      }

      const data = await response.json();
      setMessage(data.message || "Password successfully reset.");
      setError("");

      // Redirect to login page after successful reset
      setTimeout(() => navigate("/owner-login"), 3000);
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <header className="header">
        <h1>BOOKmyHOSTEL</h1>
      </header>

      <div className="forgot-password-form">
        <h2>Reset your password</h2>
        <p>Enter your new password below.</p>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>

        <button onClick={() => navigate("/owner-login")} className="back-to-login">
          &#8592; Back to login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
