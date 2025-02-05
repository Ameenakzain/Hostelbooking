import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OwnerDashboard.css"; // Import CSS

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("ownerId");
    navigate("/owner-login");
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
            <div className="hostel-card">
              <img src="hostel1.jpg" alt="Hostel 1" />
              <p>Apple Ladies Hostel</p>
            </div>
            <div className="hostel-card">
              <img src="hostel2.jpg" alt="Hostel 2" />
              <p>Green View Hostel</p>
            </div>
          </div>
          <button className="add-hostel-btn">ADD HOSTEL</button>
        </section>

        <section className="bookings-section">
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
              <tr>
                <td>Zostel Ladies</td>
                <td>10</td>
                <td>3</td>
                <td>3.9</td>
              </tr>
              <tr>
                <td>Alwayra Hostel</td>
                <td>15</td>
                <td>0</td>
                <td>4.3</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="notifications-section">
          <h3>Notifications</h3>
          <p>🔶 A new booking requires your approval</p>
          <p>🔷 You have 2 new reviews</p>
        </section>

        <section className="manage-hostels-section">
          <h3>Manage Hostels</h3>
          <table>
            <thead>
              <tr>
                <th>Hostel Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alwayra Hostel</td>
                <td>Learning City</td>
                <td>Active</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Zostel Ladies Hostel</td>
                <td>Bus Stand, New Town</td>
                <td>Active</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default OwnerDashboard;
