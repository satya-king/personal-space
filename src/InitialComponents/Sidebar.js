import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FaHome, FaUsers, FaChartBar, FaCog, FaFileAlt, FaBoxOpen,
    FaShoppingCart, FaTruck, FaWarehouse, FaClipboardList,
    FaMoneyBill, FaCalendarAlt, FaTools, FaDatabase, FaTags,
    FaUserShield, FaBell, FaPrint, FaSearch, FaStar, FaRegStar,
    FaChevronRight, FaChevronLeft, FaBars, FaLayerGroup,
    FaLink, FaThLarge, FaFilter, FaHistory, FaTrashAlt,
    FaAngleDown, FaTimes
} from "react-icons/fa";
import { MdDashboard, MdInventory, MdReport, MdPayment } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import CommonAPICallsService from "../utils/CommonAPICallsService";
import "./sidebar.css";

/* ─────────────────────────────────────────────
   Icon Resolver — keyword → react-icon
───────────────────────────────────────────── */
const iconMap = {
    home: <FaHome />, dashboard: <MdDashboard />, user: <FaUsers />,
    users: <FaUsers />, report: <FaChartBar />, reports: <HiOutlineDocumentReport />,
    setting: <FaCog />, settings: <FaCog />, config: <FaCog />,
    file: <FaFileAlt />, files: <FaFileAlt />, document: <FaFileAlt />,
    product: <FaBoxOpen />, products: <FaBoxOpen />, item: <FaTags />, items: <FaTags />,
    order: <FaShoppingCart />, orders: <FaShoppingCart />, cart: <FaShoppingCart />,
    delivery: <FaTruck />, transport: <FaTruck />, logistics: <FaTruck />,
    warehouse: <FaWarehouse />, stock: <FaWarehouse />, inventory: <MdInventory />,
    purchase: <FaClipboardList />, purchases: <FaClipboardList />,
    payment: <MdPayment />, finance: <FaMoneyBill />, billing: <FaMoneyBill />,
    calendar: <FaCalendarAlt />, schedule: <FaCalendarAlt />,
    tools: <FaTools />, utility: <FaTools />,
    data: <FaDatabase />, database: <FaDatabase />,
    role: <FaUserShield />, permission: <FaUserShield />, access: <FaUserShield />,
    notification: <FaBell />, alert: <FaBell />,
    print: <FaPrint />, print: <FaPrint />,
    category: <FaThLarge />, categories: <FaThLarge />,
    log: <FaHistory />, logs: <FaHistory />, audit: <FaHistory />,
};

const resolveIcon = (title = "") => {
    const key = title.toLowerCase().replace(/[^a-z]/g, "");
    for (const [k, icon] of Object.entries(iconMap)) {
        if (key.includes(k)) return icon;
    }
    return <FaLayerGroup />;
};

/* ─────────────────────────────────────────────
   Highlight matched search text
───────────────────────────────────────────── */
const Highlight = ({ text, query }) => {
    if (!query.trim()) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
        <span>
            {text.slice(0, idx)}
            <mark className="sb-highlight">{text.slice(idx, idx + query.length)}</mark>
            {text.slice(idx + query.length)}
        </span>
    );
};

/* ─────────────────────────────────────────────
   Main Sidebar
───────────────────────────────────────────── */
const Sidebar = () => {
    const [menuData, setMenuData] = useState([]);
    const [openMenus, setOpenMenus] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");      // "all" | "favs"
    const [favorites, setFavorites] = useState(() => {
        try { return JSON.parse(localStorage.getItem("sb_favorites") || "[]"); }
        catch { return []; }
    });
    const [recentItems, setRecentItems] = useState(() => {
        try { return JSON.parse(localStorage.getItem("sb_recent") || "[]"); }
        catch { return []; }
    });
    const [showRecent, setShowRecent] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    /* ── Load menus ── */
    useEffect(() => {
        const stored = localStorage.getItem("menuData");
        if (stored) {
            try { setMenuData(JSON.parse(stored)); } catch { fetchMenus(); }
        } else {
            fetchMenus();
        }
    }, []);

    const fetchMenus = async () => {
        const response = await CommonAPICallsService.getRoleServices();
        if (response?.data) {
            setMenuData(response.data);
            localStorage.setItem("menuData", JSON.stringify(response.data));
        } else {
            setMenuData([]);
        }
    };

    /* ── Sync active item from URL ── */
    useEffect(() => {
        if (!menuData.length) return;
        for (const menu of menuData) {
            for (const sub of menu.subItems || []) {
                if (sub.path && location.pathname.startsWith(sub.path)) {
                    setActiveItem(sub.id);
                    setOpenMenus([menu.id]);
                    return;
                }
            }
        }
    }, [location.pathname, menuData]);

    /* ── Persist favorites ── */
    useEffect(() => {
        localStorage.setItem("sb_favorites", JSON.stringify(favorites));
    }, [favorites]);

    /* ── Persist recent ── */
    useEffect(() => {
        localStorage.setItem("sb_recent", JSON.stringify(recentItems));
    }, [recentItems]);

    /* ── Keyboard shortcut: Ctrl+K → focus search ── */
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                if (!collapsed) searchRef.current?.focus();
                else { setCollapsed(false); setTimeout(() => searchRef.current?.focus(), 300); }
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [collapsed]);

    /* ── Helpers ── */
    const toggleMenu = (id) =>
        setOpenMenus((prev) => (prev.includes(id) ? [] : [id]));

    const isFav = (id) => favorites.includes(id);

    const toggleFav = (e, id) => {
        e.stopPropagation();
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    const handleSubItemClick = (item, e) => {
        e.preventDefault();
        setActiveItem(item.id);
        // Push to recent (max 5, no dups)
        setRecentItems((prev) => {
            const filtered = prev.filter((r) => r.id !== item.id);
            return [{ id: item.id, title: item.title, path: item.path }, ...filtered].slice(0, 5);
        });
        if (item.path && item.path !== "#") navigate(item.path);
    };

    /* ── Filter logic ── */
    const getFilteredMenus = useCallback(() => {
        let data = menuData;

        if (activeTab === "favs") {
            data = data
                .map((m) => ({
                    ...m,
                    subItems: (m.subItems || []).filter((s) => isFav(s.id)),
                }))
                .filter((m) => isFav(m.id) || m.subItems.length > 0);
        }

        if (!searchQuery.trim()) return data;

        const q = searchQuery.toLowerCase();
        return data
            .map((m) => ({
                ...m,
                subItems: (m.subItems || []).filter((s) =>
                    s.title?.toLowerCase().includes(q)
                ),
                _parentMatch: m.title?.toLowerCase().includes(q),
            }))
            .filter((m) => m._parentMatch || m.subItems.length > 0);
    }, [menuData, searchQuery, activeTab, favorites]);

    const filtered = getFilteredMenus();
    const favCount = favorites.length;

    return (
        <div className={`sb-root ${collapsed ? "sb-collapsed" : ""}`}>
            {/* ── Animated Background ── */}
            <div className="sb-bg">
                <div className="sb-bg-gradient" />
                <div className="sb-bg-orb sb-bg-orb1" />
                <div className="sb-bg-orb sb-bg-orb2" />
                <div className="sb-bg-grid" />
            </div>

            {/* ── Top Brand ── */}
            <div className="sb-brand" onClick={() => navigate("/home")}>
                <div className="sb-brand-icon">⬡</div>
                {!collapsed && <span className="sb-brand-text">Learner</span>}
                <button
                    className="sb-collapse-btn"
                    onClick={(e) => { e.stopPropagation(); setCollapsed((p) => !p); }}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <RiMenuUnfoldLine size={16} /> : <RiMenuFoldLine size={16} />}
                </button>
            </div>

            {!collapsed && (
                <>
                    {/* ── Search ── */}
                    <div className="sb-search-wrap">
                        <FaSearch className="sb-search-icon" size={12} />
                        <input
                            ref={searchRef}
                            className="sb-search"
                            placeholder="Search… (Ctrl+K)"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (e.target.value) setOpenMenus(menuData.map((m) => m.id));
                            }}
                        />
                        {searchQuery && (
                            <button className="sb-search-clear" onClick={() => setSearchQuery("")}>
                                <FaTimes size={10} />
                            </button>
                        )}
                    </div>

                    {/* ── Tabs ── */}
                    <div className="sb-tabs">
                        <button
                            className={`sb-tab ${activeTab === "all" ? "sb-tab-active" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            <FaBars size={11} /> All
                        </button>
                        <button
                            className={`sb-tab ${activeTab === "favs" ? "sb-tab-active" : ""}`}
                            onClick={() => setActiveTab("favs")}
                        >
                            <FaStar size={11} />
                            Favorites
                            {favCount > 0 && <span className="sb-badge">{favCount}</span>}
                        </button>
                    </div>

                    {/* ── Recent (if any, collapsible) ── */}
                    {recentItems.length > 0 && activeTab === "all" && !searchQuery && (
                        <div className="sb-section">
                            <button
                                className="sb-section-header"
                                onClick={() => setShowRecent((p) => !p)}
                            >
                                <FaHistory size={10} />
                                <span>Recent</span>
                                <FaAngleDown
                                    size={10}
                                    style={{
                                        marginLeft: "auto",
                                        transform: showRecent ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.2s",
                                    }}
                                />
                            </button>
                            {showRecent && (
                                <ul className="sb-recent-list">
                                    {recentItems.map((r) => (
                                        <li key={r.id}>
                                            <a
                                                href={r.path || "#"}
                                                className={`sb-recent-item ${activeItem === r.id ? "active" : ""}`}
                                                onClick={(e) => handleSubItemClick(r, e)}
                                            >
                                                <span className="sb-recent-dot" />
                                                {r.title}
                                            </a>
                                        </li>
                                    ))}
                                    <li>
                                        <button
                                            className="sb-clear-recent"
                                            onClick={() => { setRecentItems([]); setShowRecent(false); }}
                                        >
                                            <FaTrashAlt size={9} /> Clear
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}

                    {/* ── Empty Favs ── */}
                    {activeTab === "favs" && filtered.length === 0 && (
                        <div className="sb-empty">
                            <FaRegStar size={28} />
                            <p>No favorites yet</p>
                            <span>Star items to pin them here</span>
                        </div>
                    )}
                </>
            )
            }

            {/* ── Menu List ── */}
            <ul className="sb-menu">
                {filtered.map((menuItem, idx) => {
                    const isOpen = openMenus.includes(menuItem.id);
                    const hasChildren = (menuItem.subItems || []).length > 0;
                    const parentFav = isFav(menuItem.id);
                    const icon = resolveIcon(menuItem.title);

                    return (
                        <li
                            key={menuItem.id}
                            className="sb-menu-item"
                            style={{ animationDelay: `${idx * 0.04}s` }}
                        >
                            {/* Parent row */}
                            <div
                                className={`sb-parent-row ${isOpen ? "sb-parent-open" : ""}`}
                                onClick={() => {
                                    if (collapsed) setCollapsed(false);
                                    toggleMenu(menuItem.id);
                                }}
                                title={collapsed ? menuItem.title : ""}
                            >
                                <span className="sb-item-icon">{icon}</span>

                                {!collapsed && (
                                    <>
                                        <span className="sb-item-label">
                                            <Highlight text={menuItem.title} query={searchQuery} />
                                        </span>

                                        <span className="sb-item-actions">
                                            <button
                                                className={`sb-star ${parentFav ? "sb-star-on" : ""}`}
                                                onClick={(e) => toggleFav(e, menuItem.id)}
                                                title={parentFav ? "Remove favorite" : "Add to favorites"}
                                            >
                                                {parentFav ? <FaStar size={11} /> : <FaRegStar size={11} />}
                                            </button>
                                            {hasChildren && (
                                                <FaChevronRight
                                                    size={10}
                                                    className={`sb-chevron ${isOpen ? "sb-chevron-open" : ""}`}
                                                />
                                            )}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Sub-items */}
                            {!collapsed && hasChildren && (
                                <ul className={`sb-submenu ${isOpen ? "sb-submenu-open" : ""}`}>
                                    {menuItem.subItems.map((sub, sIdx) => {
                                        const subIcon = resolveIcon(sub.title);
                                        const subFav = isFav(sub.id);
                                        const isActive = activeItem === sub.id;

                                        return (
                                            <li key={sub.id}>
                                                <a
                                                    href={sub.path || "#"}
                                                    className={`sb-sub-row ${isActive ? "sb-sub-active" : ""}`}
                                                    onClick={(e) => handleSubItemClick(sub, e)}
                                                >
                                                    <span className="sb-sub-icon">{subIcon}</span>
                                                    <span className="sb-sub-label">
                                                        <Highlight text={sub.title} query={searchQuery} />
                                                    </span>
                                                    <button
                                                        className={`sb-star sb-sub-star ${subFav ? "sb-star-on" : ""}`}
                                                        onClick={(e) => toggleFav(e, sub.id)}
                                                    >
                                                        {subFav ? <FaStar size={10} /> : <FaRegStar size={10} />}
                                                    </button>
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )
                            }

                            {/* Collapsed tooltip submenu */}
                            {collapsed && hasChildren && (
                                <div className="sb-tooltip-menu">
                                    <div className="sb-tooltip-title">{menuItem.title}</div>
                                    {menuItem.subItems.map((sub) => (
                                        <a
                                            key={sub.id}
                                            href={sub.path || "#"}
                                            className={`sb-tooltip-item ${activeItem === sub.id ? "active" : ""}`}
                                            onClick={(e) => handleSubItemClick(sub, e)}
                                        >
                                            {sub.title}
                                        </a>
                                    ))}
                                </div>
                            )
                            }
                        </li >
                    );
                })}
            </ul >

            {/* ── Bottom: Version ── */}
            {
                !collapsed && (
                    <div className="sb-footer">
                        <div className="sb-footer-dot" />
                        <span>v1.0.0</span>
                    </div>
                )
            }
        </div >
    );
};

export default Sidebar;