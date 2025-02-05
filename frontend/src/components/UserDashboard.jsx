import React from "react";
import { useLocation } from "react-router-dom";
import "../styles/Dashboard.css";

const userDashboard = () => {
  const location = useLocation();
  const user = location.state?.user || {};

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.name}!</h2>
      <div className="user-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>
      <div className="hostel-info">
        <h3>Hostel Information</h3>
        {/* Replace this with dynamic data if needed */}
        <p><strong>Hostel Name:</strong> ABC Hostel</p>
        <p><strong>Address:</strong> 123 Street, City</p>
        <p><strong>Facilities:</strong> WiFi, Laundry, Mess</p>
      </div>
    </div>
  );
};

export default userDashboard;
