import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaChevronLeft } from "react-icons/fa"; // For Home and Back icons
import { IoMdLogOut } from "react-icons/io"; // For Logout icon

const StickerHeader = ({ username }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/'); // Redirect to login page
    };

    const handleBack = () => {
        navigate(-1); // Go to the previous page
    };

    const handleHome = () => {
        navigate('/home'); // Go to the home page
    };

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    return (
        <div style={styles.headerContainer}>
            <div style={styles.leftSection}>
                <img src="/logo512.png" alt="Logo" style={styles.image} />
            </div>
            <div style={styles.middleSection}>
                <FaChevronLeft onClick={handleBack} style={styles.icon} />
            </div>
            <div style={styles.rightSection}>
                <FaHome onClick={handleHome} style={styles.icon} />
                <div style={styles.usernameContainer}>
                    <span style={styles.username} onClick={toggleDropdown}>
                        {username}
                    </span>
                    {dropdownVisible && (
                        <div style={styles.dropdownMenu}>
                            <div style={styles.dropdownItem} onClick={handleLogout}>
                                <IoMdLogOut style={styles.icon} /> Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    headerContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    leftSection: {
        flex: 1,
    },
    middleSection: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
    },
    rightSection: {
        display: "flex",
        alignItems: "center",
    },
    image: {
        height: "40px",
        width: "40px",
        borderRadius: "50%",
    },
    icon: {
        fontSize: "20px",
        cursor: "pointer",
        margin: "0 10px",
    },
    usernameContainer: {
        position: "relative",
    },
    username: {
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
    },
    dropdownMenu: {
        position: "absolute",
        top: "30px",
        right: "0",
        backgroundColor: "#fff",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
        zIndex: "10",
    },
    dropdownItem: {
        padding: "10px 20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
};

export default StickerHeader;
