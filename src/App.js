import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./InitialComponents/Login";
import Dashboard from "./InitialComponents/DashBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
