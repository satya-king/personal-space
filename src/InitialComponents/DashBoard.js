import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../InitialComponents/LoginStyles.css';
import StickerHeader from "./StickyHeader";

// Define the JSON data for the sidebar
const menuData = [
    {
        "id": "home",
        "title": "Home",
        "subItems": [
            { "id": "homeSub1", "title": "Sub Item 1" },
            { "id": "homeSub2", "title": "Sub Item 2" }
        ]
    },
    {
        "id": "about",
        "title": "About",
        "subItems": [
            { "id": "aboutSub1", "title": "Sub Item 1" },
            { "id": "aboutSub2", "title": "Sub Item 2" }
        ]
    },
    {
        "id": "contact",
        "title": "Contact",
        "subItems": [
            { "id": "contactSub1", "title": "Sub Item 1" },
            { "id": "contactSub2", "title": "Sub Item 2" }
        ]
    }
];

const Dashboard = () => {
    const navigate = useNavigate();

    // Manage which menus are open (store as an array of open menu IDs)
    const [openMenus, setOpenMenus] = useState([]);
    // Manage the active submenu item
    const [activeItem, setActiveItem] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
    };

    const toggleMenu = (menuId) => {
        // Toggle the clicked menu in the list of open menus
        setOpenMenus((prevMenus) =>
            prevMenus.includes(menuId)
                ? prevMenus.filter((id) => id !== menuId) // Close if it's already open
                : [...prevMenus, menuId] // Open if it's not open
        );
    };

    const handleSubItemClick = (itemId) => {
        // Set the clicked submenu item as active
        setActiveItem(itemId);
    };

    return (
        <>
            <StickerHeader />
            <div className='sidebar-container'>

                {localStorage.getItem("isAuthenticated") && (
                    <div className='sidebar'>
                        <h2 className="h2">Menu</h2>
                        <ul>
                            {menuData.map(menuItem => (
                                <li key={menuItem.id}>
                                    <a href="#" onClick={() => toggleMenu(menuItem.id)}>
                                        {menuItem.title}
                                    </a>
                                    {/* Submenu items */}
                                    <ul className={`submenu ${openMenus.includes(menuItem.id) ? 'visible' : ''}`}>
                                        {menuItem.subItems.map(subItem => (
                                            <li key={subItem.id}>
                                                <a
                                                    href="#"
                                                    onClick={() => handleSubItemClick(subItem.id)}
                                                    className={activeItem === subItem.id ? 'active' : ''}
                                                >
                                                    {subItem.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mainContent">
                    <img src="/funnyDev.jpg" alt="Logo" />
                    <h2>Welcome to the Dashboard</h2>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>

            </div>
        </>
    );
};

export default Dashboard;
