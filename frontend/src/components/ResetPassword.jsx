import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ResetPassword.css"; // Use the same CSS file
//import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();  // Extract the token from the URL
  const resetToken = token;
  //const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Extracted token:", resetToken);
    if (!resetToken) {
      setError("Invalid or expired reset link.");
    }
  }, [resetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("All fields are required.");
      return;
    }
  
    // Ensure token exists
    if (!resetToken) {
      setError("Invalid or expired reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/owners/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),

      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to reset the password.");
        return;
      }

      setMessage("Password successfully reset. Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/owner-login"), 3000);
    } catch (err) {
      console.error("Error resetting password:", err);
      setError(err.message || "An error occurred. Please try again.");
    }
  };


  return (
    <div className="reset-password-container">
      <header className="header">
        <h1>BOOKmyHOSTEL</h1>
      </header>

      <div className="reset-password-form">
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
