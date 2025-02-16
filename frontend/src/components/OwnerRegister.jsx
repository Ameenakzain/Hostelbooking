
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "../styles/OwnerRegister.css"; // Import your CSS file

const OwnerRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    hostelName: "",
    hostelAddress: "",
    licenseFile: null,
  });
  const [fileError, setFileError] = useState(""); // To handle file errors
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const onDrop = (acceptedFiles, rejectedFiles) => {
  try {
    if (rejectedFiles.length > 0) {
      setFileError("Only PDF files are allowed.");
      return;
    }

    setFileError("");
    setFormData({ ...formData, licenseFile: acceptedFiles[0] });
    setUploadedFileName(acceptedFiles[0].name);
  } catch (error) {
    console.error("File upload error:", error);
    setFileError("An error occurred while uploading the file.");
  }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] }, // ✅ Proper MIME type
    maxFiles: 1,
    onDrop,
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, contact, password, confirmPassword, hostelName, hostelAddress, licenseFile } = formData;
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedPassword = password.trim();
    const cleanedConfirmPassword = confirmPassword.trim();
    if (cleanedPassword !== cleanedConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!licenseFile) {  // ✅ Check if the license file is uploaded
      alert("Please upload a license file.");
      return;
    }
    //console.log(formData); 
    //console.log("Data being sent:", formData);

    const data = new FormData();
    data.append("fullName", fullName);
    data.append("email", cleanedEmail);
    data.append("contact", contact);
    data.append("password", cleanedPassword);
    data.append("confirmPassword", cleanedConfirmPassword);
    data.append("hostelName", hostelName);
    data.append("hostelAddress", hostelAddress);
    data.append("licenseFile", licenseFile);

    //console.log("Data being sent:", Object.fromEntries(data.entries())); // ✅ Log to check data before sending
    console.log("🔵 FormData being sent:");
    for (let pair of data.entries()) {
     console.log(`${pair[0]}:`, pair[1]);  // Log each key-value pair
    }
    try {
      const response = await axios.post("http://localhost:5000/api/owners/owner-signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Response:", response.data);
      alert("Signup successful!");
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup failed. Try again.");

      if (error.response) {
        console.error("Server responded with:", error.response.data);
        alert(`Signup failed: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Please check your network.");
      } else {
        console.error("Error setting up request:", error.message);
        alert(`An error occurred: ${error.message}`);
      }
    }
  };

  return (
    <div className="register-container">
      <h2 className="logo">BOOK<span className="highlight">myHOSTEL</span></h2>
      <h2>Welcome</h2>
      <p>Create your account</p>

      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Enter your full name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Enter your email address" onChange={handleChange} required />
        <input type="tel" name="contact" placeholder="Enter your contact number" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Enter your password" onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm your password" onChange={handleChange} required />

        <h4>Hostel details</h4>
        <input type="text" name="hostelName" placeholder="Hostel Name" onChange={handleChange} required />
        <input type="text" name="hostelAddress" placeholder="Hostel address" onChange={handleChange} required />

        <p>Upload a copy of your license to manage hostels</p>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag and drop files to upload or</p>
          <button type="button">Browse</button>
        </div>
        {uploadedFileName && <p>Uploaded file: {uploadedFileName}</p>}

        {/* Show file error message */}
        {fileError && <p className="error">{fileError}</p>}


        <button type="submit" className="signup-btn">SIGN UP</button>
      </form>

      <p>OR</p>
      <button className="google-signin">Continue with Google</button>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default OwnerRegister;
