import axios from "axios";
import { API_URL } from "../APIURLs/Urls";
import { loaderHandler } from "./loaderHandler";

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
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                try {
                    const res = await axiosInstance.post("/refresh-token", {
                        refreshToken: refreshToken,
                    });

                    const newAccessToken = res.data.token;
                    const newRefreshToken = res.data.refreshToken;

                    localStorage.setItem("token", newAccessToken);
                    localStorage.setItem("refreshToken", newRefreshToken);

                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(error.config);
                } catch (refreshError) {
                    console.error("Refresh token expired. Redirecting to login.");
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login";
                }
            } else {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;
