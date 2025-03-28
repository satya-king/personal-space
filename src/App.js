import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./InitialComponents/Login";
import Dashboard from "./InitialComponents/DashBoard";
import HumanVerificationMath from "./Verifications/HumanVerificationMath";
import ToDoList from "./Components/ToDoList";
import LoginPage from "./InitialComponents/LoginPage";
import HomePage from "./InitialComponents/HomePage";
import LandingPage from "./InitialComponents/LandingPage";

const HumanVerificationWrapper = ({ setIsVerified }) => {
  const navigate = useNavigate();

  const handleVerification = () => {
    setIsVerified(true);
    localStorage.clear()
    navigate("/login"); // Redirect to login page after verification
  };

  return <HumanVerificationMath onVerify={handleVerification} />;
};

function App() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <Router>
      <Routes>
        {
          (!isVerified && !localStorage.getItem('isAuthenticated')) ? (
            <Route path="*" element={<HumanVerificationWrapper setIsVerified={setIsVerified} />} />
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              {/* <Route path="/login" element={<HomePage />} /> */}
              {/* <Route path="/login" element={<LandingPage />} /> */}
              <Route path="/home" element={<Dashboard />} />
              <Route path="/toDoList" element={<ToDoList />} />
              {/* <Route path="/LandingPage" element={<LandingPage />} /> */}
             
            </>
          )
        }
      </Routes>
    </Router>
  );
}

export default App;
