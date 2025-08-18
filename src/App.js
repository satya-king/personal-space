import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./InitialComponents/Login";
import Dashboard from "./InitialComponents/DashBoard";
import HumanVerificationMath from "./Verifications/HumanVerificationMath";
import ToDoList from "./Components/ToDoList";
import LoginPage from "./InitialComponents/LoginPage";
import HomePage from "./InitialComponents/HomePage";
import LandingPage from "./InitialComponents/LandingPage";
import PaymentPage from "./Components/Payments/PaymentPage";
import Layout from "./InitialComponents/Layout";
import PrivateRoute from "./InitialComponents/PrivateRoute";
import SampleComponent from "./Components/SampleComponent";

const HumanVerificationWrapper = ({ setIsVerified }) => {
  const navigate = useNavigate();

  const handleVerification = () => {
    setIsVerified(true);
    localStorage.setItem("isVerified", "true");

    if (localStorage.getItem("isAuthenticated")) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  return <HumanVerificationMath onVerify={handleVerification} />;
};

function App() {
  const [isVerified, setIsVerified] = useState(
    () => localStorage.getItem("isVerified") === "true"
  );

  return (
    <Router>
      <Routes>
        {!isVerified ? (
          <Route path="*" element={<HumanVerificationWrapper setIsVerified={setIsVerified} />} />
        ) : (
          <>
            {/* Redirect root "/" to "/home" */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route path="/login" element={<LoginPage />} />

            <Route
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="/home" element={<Dashboard />} />
              <Route path="/toDoList" element={<ToDoList />} />
              <Route path="/PaymentPage" element={<PaymentPage />} />
              <Route path="/SampleComponent" element={<SampleComponent />} />
            </Route>

            {/* Optional: 404 page */}
            <Route path="*" element={<h2>404 Page Not Found</h2>} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
