import React from "react";
import { Link } from "react-router-dom";

const BookingSuccess = () => {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>🎉 Booking Confirmed!</h1>
      <p>Thank you for your booking. We’ve reserved your spot.</p>
      <Link to="/dashboard">
        <button style={{ padding: "10px 20px", marginTop: "20px" }}>Go to Dashboard</button>
      </Link>
    </div>
  );
};

export default BookingSuccess;
