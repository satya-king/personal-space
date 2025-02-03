import React from "react";
import { useNavigate } from "react-router-dom";
import '../InitialComponents/LoginStyles.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        navigate("/");
    };

    return (
        <div className='sidebar-container'>
            {localStorage.getItem("isAuthenticated") && (
                <div className='sidebar'>
                    <h2>My App</h2>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
            )}

            <div className='mainContent'>
                <h2>Welcome to the Dashboard</h2>
                <button onClick={handleLogout} className='logout-button'>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
