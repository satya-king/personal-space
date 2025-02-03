import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("isAuthenticated")) {
            navigate("/");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        navigate("/");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Welcome to Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
