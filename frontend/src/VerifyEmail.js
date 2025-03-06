import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/verify-email/${token}`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => setMessage("Verification failed"));
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;