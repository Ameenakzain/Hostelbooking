import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage.jsx";
import Login from './components/Login.jsx';
import OwnerLogin from './components/OwnerLogin.jsx';
import OwnerRegister from './components/OwnerRegister.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/owner-login" element={<OwnerLogin />} />
        <Route path="/owner-signup" element={<OwnerRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
