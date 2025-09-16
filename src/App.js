import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, Suspense } from "react";
import LoginPage from "./InitialComponents/LoginPage";
import HumanVerificationMath from "./Verifications/HumanVerificationMath";
import Layout from "./InitialComponents/Layout";
import PrivateRoute from "./InitialComponents/PrivateRoute";
import routes from "./config/routes";

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
      <Suspense fallback={<div>Loading...</div>}>
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

              {/* Wrap private routes inside Layout + PrivateRoute */}
              <Route
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                {routes.map(({ path, element }, index) => (
                  <Route key={index} path={path} element={element} />
                ))}
              </Route>

              <Route path="*" element={<h2>404 Page Not Found</h2>} />
            </>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
