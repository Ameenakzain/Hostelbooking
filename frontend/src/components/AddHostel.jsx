import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddHostel.css";

const AddHostel = () => {
  const [hostelDetails, setHostelDetails] = useState({
    name: "",
    location: "",
    price: "",
    type: "boys",
    amenities: "",
    images: [],
  });

  // ✅ New state for available rooms
  const [availableRooms, setAvailableRooms] = useState([
    { roomType: "", count: 0 },
  ]);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHostelDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setHostelDetails((prevState) => ({
      ...prevState,
      images: Array.from(e.target.files),
    }));
  };

  // ✅ New handler for room input changes
  const handleRoomChange = (index, e) => {
    const updatedRooms = [...availableRooms];
    updatedRooms[index][e.target.name] =
      e.target.name === "count" ? parseInt(e.target.value) : e.target.value;
    setAvailableRooms(updatedRooms);
  };

  // ✅ Add new room input block
  const addRoomField = () => {
    setAvailableRooms([...availableRooms, { roomType: "", count: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amenitiesArray = hostelDetails.amenities
      .split(",")
      .map((a) => a.trim());

    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) {
      setErrorMessage("Owner ID is missing. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", hostelDetails.name);
    formData.append("location", hostelDetails.location);
    formData.append("price", hostelDetails.price);
    formData.append("type", hostelDetails.type);
    formData.append("ownerId", ownerId);

    amenitiesArray.forEach((amenity, index) => {
      formData.append(`amenities[${index}]`, amenity);
    });

    // ✅ Append available rooms as JSON
    formData.append("availableRooms", JSON.stringify(availableRooms));

    if (hostelDetails.images.length > 0) {
      hostelDetails.images.forEach((image) => {
        formData.append("images", image);
      });
    } else {
      setErrorMessage("Please select at least one image.");
      return;
    }

    const token = localStorage.getItem("ownerToken");
    if (!token) {
      setErrorMessage("Authorization token is missing. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/hostels/add-hostel",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Hostel added successfully!");
        setTimeout(
          () => navigate("/owner-dashboard", { state: { newHostel: data } }),
          2000
        );
      } else {
        setErrorMessage(data.message || "Failed to add hostel.");
      }
    } catch (error) {
      console.error("Error adding hostel:", error);
    }
  };

  return (
    <div className="add-hostel-form">
      <h2>Add New Hostel</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name of Hostel</label>
          <input
            type="text"
            name="name"
            value={hostelDetails.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={hostelDetails.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price (per month)</label>
          <input
            type="number"
            name="price"
            value={hostelDetails.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Hostel Type</label>
          <select
            name="type"
            value={hostelDetails.type}
            onChange={handleChange}
            required
          >
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
          </select>
        </div>
        <div>
          <label>Amenities</label>
          <textarea
            name="amenities"
            value={hostelDetails.amenities}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* ✅ Available Rooms */}
        <div>
          <label>Available Rooms</label>
          {availableRooms.map((room, index) => (
            <div key={index} className="room-input-group">
              <input
                type="text"
                name="roomType"
                value={room.roomType}
                onChange={(e) => handleRoomChange(index, e)}
                placeholder="Room Type (e.g., AC)"
                required
              />
              <input
                type="number"
                name="count"
                value={room.count}
                onChange={(e) => handleRoomChange(index, e)}
                placeholder="Number"
                required
              />
            </div>
          ))}
          <button type="button" onClick={addRoomField}>
            Add Room
          </button>
        </div>

        <div>
          <label>Hostel Images</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="buttons">
          <button type="button" className="edit-btn">
            Edit
          </button>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHostel;
