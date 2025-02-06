import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaChevronLeft, FaSortDown } from "react-icons/fa"; // For Home and Back icons
import { IoMdLogOut } from "react-icons/io"; // For Logout icon
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";


const StickerHeader = ({ username }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            text: "Are you sure want to sign out?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yeap',
            cancelButtonText: 'Nope'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Success', 'Logged out successfully', 'success');
                localStorage.removeItem('isAuthenticated');
                navigate('/login'); // Redirect to login page
            }
        })

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
        <div style={styles?.headerContainer}>
            <div style={styles?.leftSection}>
                <FaChevronLeft size={25} onClick={handleBack} style={styles?.icon} />
                <FaHome size={25} onClick={handleHome} style={styles?.icon} />
            </div>
            <div style={styles?.rightSection}>
                <div style={styles?.usernameContainer} onClick={toggleDropdown}>
                    <FaUserCircle size={25} style={styles?.userIcon} />
                    <span style={styles?.username}>
                        {localStorage.getItem('userName')}
                    </span>
                    <FaSortDown style={{ marginBottom: '5px' }} />

                </div>
                {dropdownVisible && (
                    <div style={styles?.dropdownMenu}>
                        <div style={styles?.dropdownItem} onClick={handleLogout}>
                            <IoMdLogOut size={20} style={{ cursor: "pointer" }} /> Logout
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
        padding: "10px 20px",
        backgroundColor: 'rgba(0, 42, 150, 0.1)',
        boxShadow: "0 2px 10px rgba(205, 52, 52, 0.1)",
    },
    leftSection: {
        display: "flex",
        alignItems: "center",
        gap: "15px", // Gap between back and home icon
    },
    rightSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end", // Align items to the right
    },
    usernameContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center", // Center the username and icon horizontally
        cursor: "pointer",
        border: "1px solid black", // Border around the container
        borderRadius: "50px",
        width: "120px", // Set a specific width for the container
        padding: "5px", // Optional: add some padding for aesthetics
        justifyContent: "center", // Ensure content is centered vertically
    },
    userIcon: {
        fontSize: "30px",
    },
    username: {
        fontSize: "18px",
        marginLeft: '5px',
    },
    icon: {
        fontSize: "20px",
        cursor: "pointer",
        margin: "0 5px",
    },
    dropdownMenu: {
        position: "absolute",
        top: "55px",
        right: "10px",
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
