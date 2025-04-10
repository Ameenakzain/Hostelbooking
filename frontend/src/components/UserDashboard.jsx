import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Dashboard.css";

const UserDashboard = () => {
  const location = useLocation();
  const user = location.state?.user || {};

  const [hostels, setHostels] = useState([]);
  const [savedHostels, setSavedHostels] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  //const menuRef = useRef(null);
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    // Fetch user's bookings
    fetchFilteredHostels();

    fetch("http://localhost:5000/api/hostels/saved-hostels", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSavedHostels(data.savedHostels || []))
      .catch((err) => console.error("Fetch error:", err));
    
  
    // Fetch notifications
    fetch("http://localhost:5000/api/notifications", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []));
  }, []);

  const fetchFilteredHostels = () => {
    let query = `http://localhost:5000/api/hostels?search=${searchQuery}`;
    if (selectedType) query += `&type=${selectedType}`;
    if (maxPrice) query += `&maxPrice=${maxPrice}`;
    if (locationFilter) query += `&location=${locationFilter}`;

    fetch(query, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    })
      .then((res) => res.json())
      .then((data) => setHostels(data.hostels || []));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome back, {user.name}!</h2>
        <div className={`profile-menu ${menuOpen ? "active" : ""}`}>
          <button className="profile-button" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          <div className="dropdown-content">
            <a href="/profile">Profile</a>
            <a href="/settings">Settings</a>
            <a href="/logout">Log out</a>
          </div>
        </div>
      </header>

      <div className="search-section">
        <input type="text" placeholder="Search hostels" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="boys">Boys Hostel</option>
          <option value="girls">Girls Hostel</option>
          <option value="co-ed">Co-ed Hostel</option>
        </select>
        <input type="number" placeholder="Max Price (₹)" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <input type="text" placeholder="Location" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
        <button onClick={fetchFilteredHostels}>Search</button>
      </div>

      {/* Available Hostels Section */}
      <section className="filtered-hostels">
        <h3>Available Hostels</h3>
        {hostels.length > 0 ? (
          hostels.map((hostel) => (
            <div key={hostel._id} className="hostel-card">
              <img src={hostel.imageUrl} alt={hostel.name} />
              <div className="hostel-info">
                <h4>{hostel.name}</h4>
                <p>{hostel.address}</p>
                <p><strong>Type:</strong> {hostel.type}</p>
                <p><strong>Rent:</strong> ₹{hostel.rent}/month</p>
                <p><strong>Rating:</strong> {hostel.rating} ⭐</p>
                <button>Book now</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hostels found.</p>
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
                <h4>{hostel.name} ❤️</h4>
                <p>{hostel.address}</p>
                <p><strong>Rent:</strong> ₹{hostel.rent}/month</p>
                <p><strong>Rating:</strong> {hostel.rating} ⭐</p>
                <button>Book now</button>
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
            <p key={index}>⚠️ {notification.message}</p>
          ))
        ) : (
          <p>No new notifications.</p>
        )}
      </section>

      {/* Chat Button */}
      <button className="chat-button">Chat now!</button>
    </div>
  );
};

export default UserDashboard;
