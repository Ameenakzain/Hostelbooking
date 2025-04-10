import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/HostelDetails.css";

const HostelDetails = () => {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Add this to enable navigation
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  useEffect(() => {
    console.log("🔍 Hostel ID from URL:", id);
    const fetchHostel = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hostels/${id}`);
        console.log("✅ Fetched hostel:", response.data);
        setHostel(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hostel details:", error);
        setLoading(false);
      }
      finally {
        setLoading(false);  // ✅ Important!
      }
    };

    fetchHostel();
  }, [id]);

  const handlePayNow = () => {
    alert("✅ Payment successful! Your booking is confirmed.");
    // Optional: Redirect to success page later
    // navigate("/booking-success");
  };

  if (loading) return <p>Loading...</p>;
  if (!hostel) return <p>Hostel not found.</p>;

  
  
  return (
    <div className="hostel-details-container">
      <div className="image-section">
        <img src={`http://localhost:5000/uploads/${hostel.images[0]}`} alt={hostel.name} />
      </div>
      <div className="info-section">
        <h2>{hostel.name}</h2>
        <p><strong>📍 Location:</strong> {hostel.location}</p>
        <p><strong>🏷️ Type:</strong> {hostel.type}</p>
        <p><strong>🛏️ Amenities:</strong> {hostel.amenities?.join(", ") || "Not listed"}</p>
      </div>

      <div className="payment-summary">
        <h3>Payment Summary</h3>
        <p><strong>Monthly Rent:</strong> ₹{hostel.price}</p>
        <p><strong>Advance Payment:</strong> ₹{Math.ceil(hostel.price * 0.3)} (30%)</p>
        <div className="action-buttons">
        <button className="pay-btn" onClick={() => setShowSuccessModal(true)}>Pay Now</button>
          <button className="hold-btn">Hold</button>
        </div>
      </div>
      {/* ✅ Success Modal at the bottom of the main container */}
    {showSuccessModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>🎉 Booking Confirmed!</h2>
          <p>Your advance payment was successful!</p>
          <button onClick={() => setShowSuccessModal(false)}>Close</button>
        </div>
      </div>
    )}
    </div>
  );
};

export default HostelDetails;
