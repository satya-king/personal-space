import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaChevronLeft, FaSortDown } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";

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
                navigate("/login");
            }
        });
    };

    const handleBack = () => navigate(-1);
    const handleHome = () => navigate("/home");

    const toggleDropdown = () => setDropdownVisible((prev) => !prev);

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
                    <span style={styles.username}>
                        {localStorage.getItem("userName") || "User"}
                    </span>
                    <FaSortDown style={{ marginLeft: "5px" }} />
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
        // background: "linear-gradient(90deg, #185a9d ,#43cea2)",
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
        background: "rgba(255,255,255,0.15)",
        borderRadius: "30px",
        padding: "6px 12px",
        transition: "0.3s",
    },
    usernameContainerHover: {
        background: "rgba(255,255,255,0.25)",
    },
    userIcon: {
        marginRight: "8px",
    },
    username: {
        fontSize: "16px",
        fontWeight: "500",
    },
    icon: {
        cursor: "pointer",
        transition: "0.2s",
    },
    dropdownMenu: {
        position: "absolute",
        top: "45px",
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
    dropdownItemHover: {
        background: "#f5f5f5",
    },
};

export default StickerHeader;
