import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register.jsx"; 
import Homepage from "./Homepage.jsx";
import Login from './components/Login.jsx';
import OwnerLogin from './components/OwnerLogin.jsx';
import OwnerRegister from './components/OwnerRegister.jsx';
import OwnerDashboard from './components/OwnerDashboard.jsx';
import AddHostel from "./components/AddHostel.jsx";
import UserDashboard from './components/UserDashboard.jsx';
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
//import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VerifyEmail from "./VerifyEmail";  // Your email verification page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/owner-login" element={<OwnerLogin />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/owner-signup" element={<OwnerRegister />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/add-hostel" element={<AddHostel />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
