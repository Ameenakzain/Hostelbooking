import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OwnerDashboard.css";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    const token = localStorage.getItem("ownerToken");
    if (!token) {
      console.error("❌ No token found, user might not be logged in.");
      return;
    }

    console.log("📢 Fetching hostels with token:", token);
    try {
      const response = await fetch("http://localhost:5000/api/hostels/owner-hostels", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setHostels(data.hostels || []); // Access the `hostels` property
      } else {
        console.error("Failed to fetch hostels:", data.message);
        setHostels([]);
      }
    } catch (error) {
      console.error("Error fetching hostels:", error);
      setHostels([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("ownerId");
    navigate("/owner-login");
  };

  const handleAddHostel = () => {
    navigate("/add-hostel");
  };

  const handleEditHostel = (id) => {
    navigate(`/edit-hostel/${id}`);
  };

  const handleDeleteHostel = async (id) => {
    const token = localStorage.getItem("ownerToken");
    try {
      await fetch(`http://localhost:5000/api/hostels/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchHostels();
    } catch (error) {
      console.error("Error deleting hostel:", error);
    }
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
                  <img
                    src={
                      hostel.images && hostel.images[0]
                        ? `http://localhost:5000/uploads/${hostel.images[0]}`
                        : "path/to/fallback/image.jpg" // Add a fallback image
                    }
                    alt={hostel.name}
                  />
                  <p>{hostel.name}</p>
                  <p>Location: {hostel.location}</p>
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

        <section className="bookings-ratings">
          <h3>Bookings & Ratings</h3>
          <table>
            <thead>
              <tr>
                <th>Hostel Name</th>
                <th>Active</th>
                <th>Hold</th>
                <th>Average Rating</th>
              </tr>
            </thead>
            <tbody>
              {hostels.map((hostel) => (
                <tr key={hostel._id}>
                  <td>{hostel.name}</td>
                  <td>{hostel.activeBookings || 0}</td>
                  <td>{hostel.holdBookings || 0}</td>
                  <td>{hostel.averageRating || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="manage-hostels">
          <h3>Manage Hostels</h3>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Hostel Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hostels.map((hostel) => (
                <tr key={hostel._id}>
                  <td>
                    <img
                      src={
                        hostel.images && hostel.images[0]
                          ? `http://localhost:5000/uploads/${hostel.images[0]}`
                          : "path/to/fallback/image.jpg" // Add a fallback image
                      }
                      alt={hostel.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>{hostel.name}</td>
                  <td>{hostel.location}</td>
                  <td>{hostel.status || "N/A"}</td>
                  <td>
                    <button onClick={() => handleEditHostel(hostel._id)}>Edit</button>
                    <button onClick={() => handleDeleteHostel(hostel._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default OwnerDashboard;