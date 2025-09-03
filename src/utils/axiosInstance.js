import axios from "axios";
import { API_URL } from "../APIURLs/Urls";
import { loaderHandler } from "./loaderHandler";
import { showNotification } from "./CommonFunctions";

const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Track refresh state
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

function addSubscriber(callback) {
    refreshSubscribers.push(callback);
}

// 🔹 Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        loaderHandler.show();
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // Wait for ongoing refresh to finish
                return new Promise((resolve) => {
                    addSubscriber((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            isRefreshing = true;
            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                localStorage.clear();
                showNotification("error", "Your session has expired. Please log in again.", "/login");
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(`${API_URL}/refresh-token`, {
                    refreshToken: refreshToken,
                });

                const newAccessToken = res.data.token;
                const newRefreshToken = res.data.refreshToken;

                localStorage.setItem("token", newAccessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                onRefreshed(newAccessToken);
                isRefreshing = false;

                // Retry original failed request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                localStorage.clear();
                showNotification("error", "Your session has expired. Please log in again.", "/login");
                return Promise.reject(refreshError);
            }
        } else if (error.response && error.response.status === 403) {
            showNotification("error", error.response.data || "Access Denied.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
