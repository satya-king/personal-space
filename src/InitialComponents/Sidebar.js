import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../InitialComponents/sidebar.css";

const menuData = [
    {
        id: "home",
        title: "Home",
        subItems: [
            { id: "toDoList", title: "To-Do List", path: "/toDoList" },
            { id: "homeSub2", title: "Sub Item 2", path: "#" },
            { id: "homeSub3", title: "Sub Item 3", path: "#" },
            { id: "homeSub4", title: "Sub Item 4", path: "#" }
        ]
    },
    {
        id: "about",
        title: "About",
        subItems: [
            { id: "aboutSub1", title: "Sub Item 1", path: "#" },
            { id: "aboutSub2", title: "Sub Item 2", path: "#" }
        ]
    },
    {
        id: "contact",
        title: "Contact",
        subItems: [
            { id: "contactSub1", title: "Aadhar OTP", path: "/AadharOTPValidation" },
            { id: "contactSub2", title: "Sub Item 2", path: "#" }
        ]
    },
    {
        id: "payment",
        title: "Payements",
        subItems: [
            { id: "pay1", title: "Razor", path: "/PaymentPage" },
            { id: "pay2", title: "QR Payement", path: "/PaymentByScanning" }
        ]
    }
];

const Sidebar = () => {
    const [openMenus, setOpenMenus] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const navigate = useNavigate();

    // const toggleMenu = (menuId) => {
    //     setOpenMenus((prevMenus) =>
    //         prevMenus.includes(menuId)
    //             ? prevMenus.filter((id) => id !== menuId)
    //             : [...prevMenus, menuId]
    //     );
    // };

    const toggleMenu = (menuId) => {
        setOpenMenus((prevMenus) =>
            prevMenus.includes(menuId) ? [] : [menuId]
        );
    };


    const handleSubItemClick = (item) => {
        setActiveItem(item.id);
        if (item.path && item.path !== "#") {
            navigate(item.path);
        }
    };

    return (
        <div className="sidebar cyber-sidebar">
            <h2 className="sidebar-title"
                onClick={() => navigate("/home")} style={{ cursor: "pointer" }}
            >
                💻 Hub
            </h2>
            <ul className="sidebar-list">
                {menuData.map((menuItem) => (
                    <li key={menuItem.id}>
                        <a
                            href={menuItem.path || "#"}
                            className="menu-link"
                            onClick={() => toggleMenu(menuItem.id)}
                        >
                            {menuItem.title}
                        </a>
                        <ul
                            className={`submenu ${openMenus.includes(menuItem.id) ? "visible" : ""
                                }`}
                        >
                            {menuItem.subItems.map((subItem) => (
                                <li key={subItem.id}>
                                    <a
                                        href={subItem.path || "#"}
                                        onClick={() => handleSubItemClick(subItem)}
                                        className={`submenu-link ${activeItem === subItem.id ? "active" : ""
                                            }`}
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
    );
};

export default Sidebar;
