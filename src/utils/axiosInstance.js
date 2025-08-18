import axios from "axios";
import { API_URL } from "../APIURLs/Urls";
import { loaderHandler } from "./loaderHandler";

const axiosInstance = axios.create({
    baseURL: API_URL, // adjust for your backend
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        loaderHandler.show();
        return config;
    },
    (error) => {
        loaderHandler.hide();
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        loaderHandler.hide();
        return response;
    },
    (error) => {
        loaderHandler.hide();
        return Promise.reject(error);
    }
);

export default axiosInstance;
