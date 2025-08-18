// src/context/LoaderContext.js
import React, { createContext, useContext, useState } from "react";
import { loaderHandler } from "../utils/loaderHandler";

const LoaderContext = createContext();


export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    // Register with handler
    React.useEffect(() => {
        loaderHandler.register(showLoader, hideLoader);
    }, []);

    return (
        <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
            {children}
            {loading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
        </LoaderContext.Provider>
    );
};


export const useLoader = () => useContext(LoaderContext);

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    spinner: {
        width: "50px",
        height: "50px",
        border: "5px solid #f3f3f3",
        borderTop: "5px solid #007bff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
};
