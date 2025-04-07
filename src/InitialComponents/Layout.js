// Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import StickerHeader from "./StickyHeader";
import Sidebar from "./Sidebar";

const Layout = () => {
    return (
        <>
            <StickerHeader />
            <div className="sidebar-container">
                <Sidebar />
                <div className="mainContent">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Layout;
