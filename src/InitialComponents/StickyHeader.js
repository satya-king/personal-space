import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaChevronLeft, FaSortDown } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";

// role-based style mapping
const getRoleStyle = (roleId) => {
    const base = {
        padding: "4px 10px",
        borderRadius: "20px",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "16px",
        fontWeight: "500",
        transition: "0.3s",
    };

    switch (roleId) {
        case 99: // GOD USER
            return { ...base, background: "#ffe6e6", color: "red", fontWeight: "bold" };
        case 1: // ADMIN USER
            return { ...base, background: "#e6ffe6", color: "green" };
        case 3: // PREMIUM USER
            return { ...base, background: "#fff8dc", color: "gold", fontWeight: "bold" };
        case 4: // POWER USER
            return { ...base, background: "#fff0e0", color: "orange" };
        default: // Normal User
            return { ...base, background: "rgba(255,255,255,0.15)", color: "#fff" };
    }
};

// role-based icon mapping
const getRoleIcon = (roleId) => {
    switch (roleId) {
        case 99: return "👑"; // GOD USER
        case 1: return "🛡️"; // ADMIN USER
        case 3: return "⭐"; // PREMIUM USER
        case 4: return "⚡"; // POWER USER
        default: return "👤"; // Normal User
    }
};

const StickerHeader = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            text: "Are you sure you want to logout?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Success", "Logged out successfully", "success");
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("roleId");
                localStorage.removeItem("userName");
                navigate("/login");
            }
        });
    };

    const handleBack = () => navigate(-1);
    const handleHome = () => navigate("/home");
    const toggleDropdown = () => setDropdownVisible((prev) => !prev);

    // get stored role + username
    const roleId = Number(localStorage.getItem("roleId"));
    const userName = localStorage.getItem("userName") || "User";

    return (
        <div style={styles.headerContainer}>
            {/* Left - Back & Home */}
            <div style={styles.leftSection}>
                <FaChevronLeft size={22} onClick={handleBack} style={styles.icon} />
                <FaHome size={22} onClick={handleHome} style={styles.icon} />
            </div>

            {/* Right - User Info */}
            <div style={styles.rightSection}>
                <div style={styles.usernameContainer} onClick={toggleDropdown}>
                    <FaUserCircle size={26} style={styles.userIcon} />
                    <span style={getRoleStyle(roleId)}>
                        {getRoleIcon(roleId)} {userName}
                    </span>
                </div>

                {dropdownVisible && (
                    <div style={styles.dropdownMenu}>
                        <div style={styles.dropdownItem} onClick={handleLogout}>
                            <IoMdLogOut size={18} /> Logout
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    headerContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 25px",
        background: "linear-gradient(90deg,#185a9d, #7873f5, #71e59cff)",
        color: "white",
        boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
    },
    leftSection: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },
    rightSection: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    usernameContainer: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        gap: "10px",
    },
    userIcon: {
        marginRight: "4px",
        color: "white",
    },
    icon: {
        cursor: "pointer",
        transition: "0.2s",
    },
    dropdownMenu: {
        position: "absolute",
        top: "50px",
        right: 0,
        backgroundColor: "#fff",
        color: "#333",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        minWidth: "140px",
        overflow: "hidden",
        zIndex: 10,
    },
    dropdownItem: {
        padding: "10px 15px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        transition: "0.2s",
    },
};

export default StickerHeader;
