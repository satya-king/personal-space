import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../InitialComponents/LoginStyles.css';

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
        <div className="container" >
            <h2>Welcome to Home</h2>
            <button onClick={handleLogout} className='logout-button'>Logout</button>
        </div>
    );
};

export default Dashboard;
