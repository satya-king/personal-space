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
                    <div className='sidebar'
                        style={{
                            backgroundImage: 'url(/roboticImage.jpg)',
                            backgroundSize: 'auto 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
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

                <div className="mainContent"
                    style={{
                        // backgroundImage: 'url(/GirlDancingGif.gif)',
                        backgroundSize: '30%',  // Keep this line to make the image smaller
                        backgroundPosition: 'center'
                    }}>
                    <img src="/funnyDevGif3.gif" alt="Logo" />
                    <h1 style={{ marginTop: '5px', color: 'red' }}>Welcome to the Development World!</h1>
                </div>


                {/* <div className="mainContent" style={{backgroundImage}}>
                    <img src="/funnyDevGif3.gif" alt="Logo" />
                    <h2 style={{ marginTop: '5px' }}>Welcome to the Development World!</h2>
                </div> */}

            </div>
        </>
    );
};

export default Dashboard;
