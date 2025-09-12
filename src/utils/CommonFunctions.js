import Swal from "sweetalert2";
import axios from 'axios'

export const showNotification = (type, message, redirectUrl = null) => {
    let icon = "info";
    let title = "Info";

    if (type === "success") {
        icon = "success";
        title = "Success";
    } else if (type === "error") {
        icon = "error";
        title = "Error";
    } else if (type === "warning") {
        icon = "warning";
        title = "Warning";
    }

    return Swal.fire({
        icon,
        title,
        text: message,
        confirmButtonText: "OK"
    }).then(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    });
};


export const getTokenFromLocalStorage = async () => {
    let token = ''
    token = localStorage.getItem('token')
    if (token !== '' && token !== undefined && token !== null) {
        return token
    }
}


export const getRoleStyle = (roleId) => {
    const baseStyle = {
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: "6px",
        transition: "all 0.2s ease-in-out",
        cursor: "pointer"
    };

    switch (roleId) {
        case 99:
            return { ...baseStyle, backgroundColor: "#ffe6e6", color: "red", fontWeight: "bold" };
        case 1:
            return { ...baseStyle, backgroundColor: "#e6ffe6", color: "green" };
        case 3:
            return { ...baseStyle, backgroundColor: "#fff8dc", color: "gold" };
        case 4:
            return { ...baseStyle, backgroundColor: "#fff0e0", color: "orange" };
        default:
            return { ...baseStyle, backgroundColor: "#f0f0f0", color: "#333" };
    }
};

export const getRoleIcon = (roleId) => {
    switch (roleId) {
        case 99:
            return "👑";
        case 1:
            return "🛡️";
        case 3:
            return "⭐";
        case 4:
            return "⚡";
        default:
            return "👤";
    }
};
