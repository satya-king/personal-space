import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../InitialComponents/LoginStyles.css"; // Adjust path if needed

const menuData = [
    {
        id: "home",
        title: "Home",
        subItems: [
            { id: "toDoList", title: "To-Do List", path: "/toDoList" },
            { id: "homeSub2", title: "Sub Item 2", path: "#" }
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
            { id: "contactSub1", title: "Sub Item 1", path: "#" },
            { id: "contactSub2", title: "Sub Item 2", path: "#" }
        ]
    }
];

const Sidebar = () => {
    const [openMenus, setOpenMenus] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const navigate = useNavigate();

    const toggleMenu = (menuId) => {
        setOpenMenus((prevMenus) =>
            prevMenus.includes(menuId)
                ? prevMenus.filter((id) => id !== menuId)
                : [...prevMenus, menuId]
        );
    };

    const handleSubItemClick = (item) => {
        setActiveItem(item.id);
        if (item.path && item.path !== "#") {
            navigate(item.path);
        }
    };

    return (
        <div
            className="sidebar"
            style={{
                backgroundImage: "url(/roboticImage.jpg)",
                backgroundSize: "auto 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            <h2 className="h2">Menu</h2>
            <ul>
                {menuData.map((menuItem) => (
                    <li key={menuItem.id}>
                        <a href="#" onClick={() => toggleMenu(menuItem.id)}>
                            {menuItem.title}
                        </a>
                        <ul className={`submenu ${openMenus.includes(menuItem.id) ? "visible" : ""}`}>
                            {menuItem.subItems.map((subItem) => (
                                <li key={subItem.id}>
                                    <a
                                        href="#"
                                        onClick={() => handleSubItemClick(subItem)}
                                        className={activeItem === subItem.id ? "active" : ""}
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
