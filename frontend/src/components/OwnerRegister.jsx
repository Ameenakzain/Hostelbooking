// OwnerRegistration.js
import React, { useState } from 'react';
import axios from 'axios';

const OwnerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    hostelName: '',
    address: '',
    hostelPics: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, hostelPics: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('phoneNumber', formData.phoneNumber);
    formDataToSubmit.append('password', formData.password);
    formDataToSubmit.append('hostelName', formData.hostelName);
    formDataToSubmit.append('address', formData.address);

    // Append files to FormData
    for (let i = 0; i < formData.hostelPics.length; i++) {
      formDataToSubmit.append('hostelPics', formData.hostelPics[i]);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/owner/register', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Error registering owner');
    }
  };

  return (
    <div>
      <h2>Owner Registration</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
        <input type="text" name="hostelName" placeholder="Hostel Name" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        <input type="file" name="hostelPics" multiple onChange={handleFileChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default OwnerRegistration;
