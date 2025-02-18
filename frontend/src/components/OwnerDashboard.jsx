import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OwnerDashboard.css"; // Import CSS

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    const token = localStorage.getItem("ownerToken");

    try {
      const response = await fetch("http://localhost:5000/api/hostels/owner-hostels", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setHostels(data.hostels);
      } else {
        console.error("Failed to fetch hostels:", data.message);
      }
    } catch (error) {
      console.error("Error fetching hostels:", error);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("ownerId");
    navigate("/owner-login");
  };

  // Navigate to AddHostel page
  const handleAddHostel = () => {
    navigate("/add-hostel");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>BOOKMyHOSTEL</h2>
        <nav>
          <a href="#">Home</a>
          <a href="#">Manage Hostels</a>
          <a href="#">Reviews</a>
          <a href="#">Bookings</a>
          <div className="profile-menu">
            <button className="profile-btn">☰</button>
            <div className="dropdown-content">
              <a href="#">Profile</a>
              <a href="#">Settings</a>
              <button onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </nav>
      </header>

      <main className="dashboard-main">
        <section className="hostels-section">
          <h3>Your Hostels</h3>
          <div className="hostel-cards">
            {hostels.length > 0 ? (
              hostels.map((hostel) => (
                <div className="hostel-card" key={hostel._id}>
                  <img src={hostel.imageUrl} alt={hostel.name} />
                  <p>{hostel.name}</p>
                  <p>{hostel.location}</p>
                </div>
              ))
            ) : (
              <p>No hostels added yet.</p>
            )}
          </div>
          <button className="add-hostel-btn" onClick={handleAddHostel}>
            ADD HOSTEL
          </button>
        </section>
      </main>
    </div>
  );
};

export default OwnerDashboard;