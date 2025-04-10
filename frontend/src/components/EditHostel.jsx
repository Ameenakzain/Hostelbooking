import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditHostel.css";
const EditHostel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState({
    name: "",
    location: "",
    status: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("ownerToken");
    fetch(`http://localhost:5000/api/hostels/hostel/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
          }
          return res.json();
        })
      .then((data) => setHostel(data.hostel))
      .catch((err) => console.error("Error fetching hostel:", err));
  }, [id]);

  const handleChange = (e) => {
    setHostel({ ...hostel, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("ownerToken");

    try {
      const res = await fetch(`http://localhost:5000/api/hostels/hostel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(hostel),
      });

      if (res.ok) {
        navigate("/owner-dashboard"); // Redirect on success
      } else {
        const errorText = await res.text();
        console.error("Error updating hostel:", errorText);
      }
    } catch (error) {
      console.error("Request failed:", error.message);
    }
  };

  return (
    <div>
      <h2>Edit Hostel</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={hostel.name}
          onChange={handleChange}
          placeholder="Hostel Name"
        />
        <input
          name="location"
          value={hostel.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <input
          name="status"
          value={hostel.status}
          onChange={handleChange}
          placeholder="Status"
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditHostel;
