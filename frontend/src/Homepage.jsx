import React, { useState } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">BOOKmyHOSTEL</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#search">Search hostels</a></li>
          <li><a href="#reviews">Reviews</a></li>
        </ul>
        <button className="login-btn" onClick={handleLoginClick}>
          Login / Sign up
        </button>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        {/* Background Image */}
        <img
          src={`${process.env.PUBLIC_URL}/hotel-and-building-illustration-vector.jpg`}
          alt="Hostel Illustration"
          className="hero-background"
        />

        <div className="hero-content">
          <h1>Find your perfect stay!</h1>
          <p>SEARCH AND BOOK HOSTELS WITH EASE</p>
          <div className="search-bar">
            <input type="text" placeholder="Search for hostels near you" />
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="features">
            <span>✔ Verified hostels</span>
            <span>✔ Affordable prices</span>
            <span>✔ Flexible booking</span>
            <span>✔ 24 x 7 support</span>
            <span>✔ Secure payments</span>
          </div>
        </div>
      </header>

      {/* Chat Now Button */}
      <button className="chat-now">Chat now!</button>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h2>Are you a user or an owner?</h2>
            <div className="popup-buttons">
              <button onClick={() => navigate("/login")}>User</button>
              <button onClick={() => navigate("/owner-login")}>Owner</button>
            </div>
            <button className="close-popup" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
