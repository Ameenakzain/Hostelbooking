import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register.jsx"; 
import Homepage from "./Homepage.jsx";
import Login from './components/Login.jsx';
import OwnerLogin from './components/OwnerLogin.jsx';
import OwnerRegister from './components/OwnerRegister.jsx';
import OwnerDashboard from './components/OwnerDashboard.jsx';
import UserDashboard from './components/UserDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/owner-login" element={<OwnerLogin />} />
        <Route path="/owner-signup" element={<OwnerRegister />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;