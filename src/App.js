import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./InitialComponents/DashBoard";
import HumanVerificationMath from "./Verifications/HumanVerificationMath";
import ToDoList from "./Components/ToDoList";
import LoginPage from "./InitialComponents/LoginPage";
import PaymentPage from "./Components/Payments/PaymentPage";
import Layout from "./InitialComponents/Layout";
import PrivateRoute from "./InitialComponents/PrivateRoute";
import SampleComponent from "./Components/SampleComponent";
import PaymentByScanning from "./Components/Payments/PaymentByScanning";
import AadharOTPValidation from "./Components/ThirdPartyRelated/AadharOTPValidation";

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
          <>
            <Route path="/verify" element={<HumanVerificationWrapper setIsVerified={setIsVerified} />} />
            <Route path="*" element={<Navigate to="/verify" replace />} />
          </>
        ) : (
          <>
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
              <Route path="/PaymentByScanning" element={<PaymentByScanning />} />
              <Route path="/SampleComponent" element={<SampleComponent />} />
              <Route path="/AadharOTPValidation" element={<AadharOTPValidation />} />
            </Route>

            <Route path="*" element={<h2>404 Page Not Found</h2>} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
