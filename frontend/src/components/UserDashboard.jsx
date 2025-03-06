import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  const location = useLocation();
  const user = location.state?.user || {};

  const [search, setSearch] = useState("");
  const [hostels, setHostels] = useState([]);
  const [savedHostels, setSavedHostels] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // New state for search filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    // Fetch user's bookings
    fetch("http://localhost:5000/api/bookings/user-bookings", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setHostels(data.bookings || []));

    // Fetch saved hostels
    fetch("http://localhost:5000/api/hostels/saved-hostels", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSavedHostels(data.savedHostels || []));

    // Fetch notifications
    fetch("http://localhost:5000/api/notifications", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []));
  }, []);

  // Function to fetch hostels based on search
  const fetchHostels = async () => {
    try {
      const queryParams = new URLSearchParams({
        location: search,
        minPrice,
        maxPrice,
        type,
      }).toString();

      const response = await axios.get(
        `http://localhost:5000/api/hostels/search?${queryParams}`
      );
      setHostels(response.data.hostels || []);
    } catch (error) {
      console.error("Error fetching hostels:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome back, {user.name}!</h2>
        <div className={`profile-menu ${menuOpen ? "active" : ""}`}>
          <button className="profile-button" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          <div className="dropdown-content">
            <a href="/profile">Profile</a>
            <a href="/settings">Settings</a>
            <a href="/logout">Log out</a>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          className="search-bar"
          placeholder="Search hostels by location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          className="search-bar"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          className="search-bar"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <select
          className="search-bar"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="girls">Girls</option>
          <option value="boys">Boys</option>
        </select>
        <button onClick={fetchHostels}>Search</button>
      </div>

      {/* Recent Bookings Section */}
      <section className="recent-bookings">
        <h3>Your Recent Bookings</h3>
        {hostels.length > 0 ? (
          hostels.map((hostel) => (
            <div key={hostel._id} className="booking-card">
              <img src={hostel.imageUrl} alt={hostel.name} />
              <div className="booking-info">
                <h4>{hostel.name}</h4>
                <p>{hostel.address}</p>
                <p>
                  <strong>Check-in date:</strong> {hostel.checkInDate}
                </p>
                <p>
                  <strong>Fees Paid:</strong> ₹{hostel.feesPaid}
                </p>
                <p>
                  <strong>Booking Status:</strong> {hostel.status}
                </p>
                <div className="booking-actions">
                  <button>View details</button>
                  <button>Contact hostel</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No recent bookings.</p>
        )}
      </section>

      {/* Saved Hostels Section */}
      <section className="saved-hostels">
        <h3>Saved Hostels</h3>
        {savedHostels.length > 0 ? (
          savedHostels.map((hostel) => (
            <div key={hostel._id} className="hostel-card">
              <img src={hostel.imageUrl} alt={hostel.name} />
              <div className="hostel-info">
                <h4>{hostel.name} ❤</h4>
                <p>{hostel.address}</p>
                <p>
                  <strong>Rent:</strong> ₹{hostel.rent}/month
                </p>
                <p>
                  <strong>Rating:</strong> {hostel.rating} ⭐
                </p>
                <div className="hostel-actions">
                  <button>Book now</button>
                  <button>Remove</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No saved hostels.</p>
        )}
      </section>

      {/* Notifications Section */}
      <section className="notifications">
        <h3>Notifications</h3>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <p key={index}>⚠ {notification.message}</p>
          ))
        ) : (
          <p>No new notifications.</p>
        )}
      </section>

      {/* Available Hostels Section */}
      <section className="available-hostels">
        <h3>Available Hostels</h3>
        {hostels.length > 0 ? (
          hostels.map((hostel) => (
            <div key={hostel._id} className="hostel-card">
              <h4>{hostel.name}</h4>
              <p>📍 {hostel.location}</p>
              <p>💰 Price: ₹{hostel.price}</p>
              <p>🏠 Amenities: {hostel.amenities?.join(", ")}</p>
            </div>
          ))
        ) : (
          <p>No hostels found.</p>
        )}
      </section>

      {/* Chat Button */}
      <button className="chat-button">Chat now!</button>
    </div>
  );
};

export default UserDashboard;