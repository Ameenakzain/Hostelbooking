import React from "react";
import "./Homepage.css";

const Homepage = () => {
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
        <button className="login-btn">Login / Sign up</button>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Find your perfect stay!</h1>
          <p>SEARCH AND BOOK HOSTELS WITH EASE</p>
          <div className="search-bar">
            <input type="text" placeholder="Search for hostels near you" />
            <button><i className="fas fa-search"></i></button>
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
    </div>
  );
};

export default Homepage;
