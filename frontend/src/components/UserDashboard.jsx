import React from "react";
import "../styles/UserDashboard.css"; // Ensure correct import

function UserDashboard() {
  const bookings = [
    { name: "Aiswarya Hostel", rent: "₹8000", checkIn: "20 Jan 2025", status: "Confirmed" },
  ];

  const savedHostels = [
    { name: "Aiswarya Hostel", rent: "₹3000/month", rating: 4.1 },
    { name: "Tag Residency", rent: "₹5500/month", rating: 3.9 },
  ];

  const notifications = [
    "Your booking at Aiswarya Hostel has been confirmed!",
    "Only 2 rooms left at Sunrise Hostel. Book now!",
  ];

  return (
    <div className="dashboard">
      <header className="welcome-banner">
        <h1>Welcome back, Krishnendhu!</h1>
        <button className="search-button">Search Hostels</button>
      </header>

      <section className="recent-bookings">
        <h2>Your Recent Bookings</h2>
        <div className="card-container">
          {bookings.map((booking, index) => (
            <div key={index} className="card">
              <h3>{booking.name}</h3>
              <p>Check-in date: {booking.checkIn}</p>
              <p>Booking status: {booking.status}</p>
              <p>Fees Paid: {booking.rent}</p>
              <div className="actions">
                <button>View Details</button>
                <button>Contact Hostel</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="saved-hostels">
        <h2>Saved Hostels</h2>
        <div className="card-container">
          {savedHostels.map((hostel, index) => (
            <div key={index} className="card">
              <h3>{hostel.name}</h3>
              <p>Rent: {hostel.rent}</p>
              <p>Rating: {hostel.rating} ⭐</p>
              <div className="actions">
                <button>Book Now</button>
                <button>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="notifications">
        <h2>Notifications</h2>
        <ul>
          {notifications.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default UserDashboard;
