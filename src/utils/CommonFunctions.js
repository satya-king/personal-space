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