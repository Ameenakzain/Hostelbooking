import React, { useState } from "react";
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
    if (rejectedFiles.length > 0) {
      setFileError("Only PDF files are allowed.");
      return;
    }

    setFileError("");
    setFormData({ ...formData, licenseFile: acceptedFiles[0] });
    setUploadedFileName(acceptedFiles[0].name);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] }, // ✅ Proper MIME type
    maxFiles: 1,
    onDrop,
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log(formData);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post("http://localhost:5000/api/owner/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Signup successful!");
    } catch (error) {
      console.error("Error:", error);
      alert("Signup failed. Try again.");
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

        <button type="submit" className="signup-btn">SIGN UP</button>
      </form>

      <p>OR</p>
      <button className="google-signin">Continue with Google</button>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default OwnerRegister;
