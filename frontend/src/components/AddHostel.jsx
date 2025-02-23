import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddHostel.css";


const AddHostel = () => {
  const [hostelDetails, setHostelDetails] = useState({
    name: "",
    location: "",
    amenities: "",
    images: [],
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amenitiesArray = hostelDetails.amenities.split(",").map((a) => a.trim());

    // Create a FormData object to send the data, including files
    const formData = new FormData();
    formData.append("name", hostelDetails.name);
    formData.append("location", hostelDetails.location);
    amenitiesArray.forEach((amenity, index) => {
      formData.append(`amenities[${index}]`, amenity);
    });

    // Ensure images exist and are appended correctly
  if (hostelDetails.images.length > 0) {
    hostelDetails.images.forEach((image) => {
      formData.append("images", image);
    });
  } else {
    console.error("No images selected");
    setErrorMessage("Please select at least one image.");
    return;
  }

    console.log("FormData before sending:");
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]); // Logs key-value pairs
    }

    // Get the token from localStorage (assuming it's stored there after login)
    const token = localStorage.getItem("ownerToken");
    console.log("Token from localStorage:", token);
    if (!token) {
        setErrorMessage("Authorization token is missing. Please log in.");
        return;
      }

    try {
      // Send a POST request to add a hostel
      const response = await fetch("http://localhost:5000/api/hostels/add-hostel", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Include the token for authorization
        },
        body: formData, // Send the FormData containing the hostel details
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Hostel added successfully:", data);
        setSuccessMessage("Hostel added successfully!");
        setTimeout(() => navigate("/owner-dashboard", { state: { newHostel: data } }), 2000);
        // Redirect to Owner Dashboard after adding the hostel
        //navigate("/owner-dashboard", { state: { newHostel: data.hostel } });
      } else {
        console.error("Failed to add hostel:", data.message);
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
          <label>Amenities</label>
          <textarea
            name="amenities"
            value={hostelDetails.amenities}
            onChange={handleChange}
            required
          ></textarea>
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
          <button type="button" className="edit-btn">Edit</button>
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddHostel;
