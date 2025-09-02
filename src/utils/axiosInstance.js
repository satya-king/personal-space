import axios from "axios";
import { API_URL } from "../APIURLs/Urls";
import { loaderHandler } from "./loaderHandler";
import { showNotification } from "./CommonFunctions";

const axiosInstance = axios.create({
    baseURL: API_URL,
});

// 🔹 Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        loaderHandler.show();

        if (!config.url.includes("/login") && !config.url.includes("/refresh-token")) {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // const token = localStorage.getItem("token"); // get access token
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        loaderHandler.hide();
        return Promise.reject(error);
    }
);

// 🔹 Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        loaderHandler.hide();
        return response;
    },
    async (error) => {
        loaderHandler.hide();

        if (error.response && error.response.status === 401) {
            // 🔴 Prevent infinite loop on refresh-token call
            if (error.config.url.includes("/refresh-token")) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");

                showNotification("error", "Your session has expired. Please log in again.", "/login");

                return Promise.reject(error);
            }

            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                try {
                    const res = await axios.post(`${API_URL}/refresh-token`, {
                        refreshToken: refreshToken,
                    });

                    const newAccessToken = res.data.token;
                    const newRefreshToken = res.data.refreshToken;

                    localStorage.setItem("token", newAccessToken);
                    localStorage.setItem("refreshToken", newRefreshToken);

                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(error.config);
                } catch (refreshError) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");

                    showNotification("error", "Your session has expired. Please log in again.", "/login");
                }
            } else {
                showNotification("error", "Your session has expired. Please log in again.", "/login");
            }
        }

        return Promise.reject(error);
    }
);




export default axiosInstance;
