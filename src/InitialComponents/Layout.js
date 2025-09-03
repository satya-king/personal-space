// Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import StickerHeader from "./StickyHeader";
import Sidebar from "./Sidebar";

const Layout = () => {
    return (
        <div style={styles.pageWrapper}>
            {/* Sticky Header */}
            <header style={styles.header}>
                <StickerHeader />
            </header>

            <div style={styles.contentArea}>
                <Sidebar />
                <main style={styles.main}>
                    <Outlet />
                </main>
            </div>

            {/* Sticky Footer */}
            <footer style={styles.footer}>
                <p>© {new Date().getFullYear()} All Rights Reserved to SATYA.</p>
            </footer>
        </div>
    );
};

const styles = {
    pageWrapper: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
    },
    header: {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    contentArea: {
        display: "flex",
        flex: 1,
        overflow: "hidden", // prevent double scroll
    },
    main: {
        flex: 1,
        padding: "20px",
        background: "#e9f0fb",
        overflowY: "auto", // main scroll area
    },
    footer: {
        position: "sticky",
        bottom: 0,
        zIndex: 1000,
        background: "#495c6eff",
        color: "white",
        textAlign: "center",
        padding: "0px",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
    },
};

export default Layout;
