import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaChevronLeft, FaUserCircle, FaClock } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import Swal from "sweetalert2";
import { getRoleIcon, getRoleStyle } from "../utils/CommonFunctions";

/* ─────────────────────────────────────────────
   Helper: parse "DD-MM-YYYY HH:MM:SS" → Date
───────────────────────────────────────────── */
const parseExpiry = (raw) => {
    if (!raw) return null;
    // raw = "23-04-2026 16:17:50"
    const [datePart, timePart] = raw.trim().split(" ");
    if (!datePart || !timePart) return null;
    const [dd, mm, yyyy] = datePart.split("-");
    // Build ISO: "YYYY-MM-DDTHH:MM:SS"
    return new Date(`${yyyy}-${mm}-${dd}T${timePart}`);
};

/* ─────────────────────────────────────────────
   Helper: seconds → "MM:SS" or "HH:MM:SS"
───────────────────────────────────────────── */
const formatCountdown = (totalSecs) => {
    if (totalSecs <= 0) return "00:00";
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

/* ─────────────────────────────────────────────
   Animated Wave Background (pure SVG/CSS)
───────────────────────────────────────────── */
const WaveBackground = () => (
    <div style={waveStyles.wrapper}>
        {/* Static gradient base */}
        <div style={waveStyles.gradientBase} />

        {/* Wave 1 – slow, large */}
        <svg
            style={{ ...waveStyles.waveSvg, opacity: 0.18, animationDuration: "10s" }}
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
        >
            <path
                d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
                fill="white"
            />
        </svg>

        {/* Wave 2 – medium speed */}
        <svg
            style={{ ...waveStyles.waveSvg, opacity: 0.12, animationDuration: "7s", animationDelay: "-3s" }}
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
        >
            <path
                d="M0,20 C360,60 720,0 1080,40 C1260,60 1380,20 1440,30 L1440,80 L0,80 Z"
                fill="white"
            />
        </svg>

        {/* Wave 3 – fast, subtle */}
        <svg
            style={{ ...waveStyles.waveSvg, opacity: 0.08, animationDuration: "5s", animationDelay: "-1.5s" }}
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
        >
            <path
                d="M0,50 C180,20 360,60 540,35 C720,10 900,55 1080,30 C1260,5 1380,45 1440,25 L1440,80 L0,80 Z"
                fill="white"
            />
        </svg>

        {/* Glow orbs */}
        <div style={waveStyles.orb1} />
        <div style={waveStyles.orb2} />
    </div>
);

/* ─────────────────────────────────────────────
   Timer Pill Component
───────────────────────────────────────────── */
const TimerPill = ({ remaining, total }) => {
    const pct = total > 0 ? remaining / total : 0;
    const urgent = remaining <= 300; // last 5 minutes
    const warning = remaining <= 600; // last 10 minutes

    const pillColor = urgent
        ? "rgba(255,80,80,0.25)"
        : warning
            ? "rgba(255,180,0,0.2)"
            : "rgba(255,255,255,0.15)";

    const textColor = urgent ? "#ff6b6b" : warning ? "#ffd93d" : "rgba(255,255,255,0.9)";

    return (
        <div style={{ ...timerStyles.pill, background: pillColor, border: `1px solid ${textColor}33` }}>
            {/* Progress arc */}
            <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
                {/* Track */}
                <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                {/* Progress */}
                <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke={textColor}
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 8}`}
                    strokeDashoffset={`${2 * Math.PI * 8 * (1 - pct)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 10 10)"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                />
            </svg>
            <span style={{ ...timerStyles.text, color: textColor }}>
                {remaining > 0 ? formatCountdown(remaining) : "Expired"}
            </span>
            {urgent && (
                <span style={timerStyles.urgentDot} />
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const StickerHeader = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [remaining, setRemaining] = useState(null); // seconds left
    const [total, setTotal] = useState(null);         // total session seconds
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const roleId = Number(localStorage.getItem("roleId"));
    const userName = localStorage.getItem("userName") || "User";

    /* ── Session countdown ── */
    useEffect(() => {
        const expRaw = localStorage.getItem("exp");
        const expDate = parseExpiry(expRaw);
        if (!expDate) return;

        const calcRemaining = () => Math.max(0, Math.floor((expDate - Date.now()) / 1000));

        // Set total once
        const initialRemaining = calcRemaining();
        setRemaining(initialRemaining);
        setTotal(initialRemaining);

        const tick = setInterval(() => {
            const secs = calcRemaining();
            setRemaining(secs);

            if (secs === 0) {
                clearInterval(tick);
                // Auto-logout
                Swal.fire({
                    title: "Session Expired",
                    text: "Your session has expired. Please log in again.",
                    icon: "warning",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                    allowOutsideClick: false,
                }).then(() => {
                    localStorage.clear();
                    navigate("/login");
                });
            } else if (secs === 300) {
                // 5-min warning toast
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Session expires in 5 minutes",
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                });
            }
        }, 1000);

        return () => clearInterval(tick);
    }, [navigate]);

    /* ── Close dropdown on outside click ── */
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        setDropdownVisible(false);
        Swal.fire({
            text: "Are you sure you want to logout?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                Swal.fire("Success", "Logged out successfully", "success");
                navigate("/login");
            }
        });
    };

    return (
        <>
            {/* Inject keyframe animation globally once */}
            <style>{`
                @keyframes waveFlow {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes orbFloat {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50%       { transform: translateY(-8px) scale(1.05); }
                }
                @keyframes urgentPulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.3; }
                }
                @keyframes dropIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .sh-nav-icon {
                    cursor: pointer;
                    padding: 7px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }
                .sh-nav-icon:hover { background: rgba(255,255,255,0.18); }
                .sh-dropdown-item:hover { background: #f0f4ff; }
            `}</style>

            <header style={styles.headerContainer}>
                <WaveBackground />

                {/* ── Left: Back + Home ── */}
                <div style={styles.leftSection}>
                    <button
                        className="sh-nav-icon"
                        onClick={() => navigate(-1)}
                        title="Go back"
                        style={styles.iconBtn}
                    >
                        <FaChevronLeft size={20} color="white" />
                    </button>
                    &nbsp;
                    <button
                        className="sh-nav-icon"
                        onClick={() => navigate("/home")}
                        title="Home"
                        style={styles.iconBtn}
                    >
                        <FaHome size={20} color="white" />
                    </button>
                </div>

                {/* ── Center: Brand / App name (optional) ── */}
                <div style={styles.centerSection}>
                    {/* Swap this text with your app logo/name */}
                    <span style={styles.brandText}>⬡ Learner ⬡</span>
                </div>

                {/* ── Right: Timer + User Dropdown ── */}
                <div style={styles.rightSection}>
                    {/* Session Timer */}
                    {remaining !== null && (
                        <TimerPill remaining={remaining} total={total} />
                    )}

                    {/* User badge + dropdown */}
                    <div ref={dropdownRef} style={{ position: "relative" }}>
                        <button
                            style={styles.userBadge}
                            onClick={() => setDropdownVisible((p) => !p)}
                        >
                            <FaUserCircle size={22} style={{ flexShrink: 0 }} />
                            <div style={styles.userInfo}>
                                <span style={styles.userName}>{userName}</span>
                                <span style={styles.userRole}>
                                    {getRoleIcon(roleId)}&nbsp;
                                    {/* {["", "Admin", "Manager", "Staff"][roleId] || "Member"} */}
                                </span>
                            </div>
                            <svg
                                width="10" height="10" viewBox="0 0 10 10"
                                style={{
                                    transition: "transform 0.2s",
                                    transform: dropdownVisible ? "rotate(180deg)" : "rotate(0deg)",
                                    opacity: 0.7,
                                }}
                            >
                                <path d="M1 3 L5 7 L9 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                            </svg>
                        </button>

                        {dropdownVisible && (
                            <div style={styles.dropdownMenu}>
                                {/* User info header inside dropdown */}
                                <div style={styles.dropdownHeader}>
                                    <FaUserCircle size={32} color="#7873f5" />
                                    <div>
                                        <div style={styles.dropdownName}>{userName}</div>
                                        <div style={styles.dropdownRole} role={getRoleStyle(roleId)}>
                                            {getRoleIcon(roleId)} Role - {roleId}
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.dropdownDivider} />
                                <button
                                    className="sh-dropdown-item"
                                    style={styles.dropdownItem}
                                    onClick={handleLogout}
                                >
                                    <IoMdLogOut size={18} color="#e74c3c" />
                                    <span style={{ color: "#e74c3c", fontWeight: 500 }}>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
const styles = {
    headerContainer: {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        height: "62px",
        boxShadow: "0 4px 20px rgba(24,90,157,0.35)",
    },
    leftSection: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        zIndex: 1,
    },
    centerSection: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1,
    },
    brandText: {
        color: "rgba(255,255,255,0.85)",
        fontSize: "15px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textShadow: "0 1px 8px rgba(0,0,0,0.2)",
    },
    rightSection: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 1,
    },
    iconBtn: {
        background: "none",
        border: "none",
        outline: "none",
        padding: 0,
        cursor: "pointer",
    },
    userBadge: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: "50px",
        padding: "6px 12px 6px 8px",
        cursor: "pointer",
        color: "white",
        transition: "background 0.2s",
    },
    userInfo: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        lineHeight: 1.2,
    },
    userName: {
        fontSize: "13px",
        fontWeight: 700,
        color: "white",
        maxWidth: "100px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    userRole: {
        fontSize: "10px",
        color: "rgba(255,255,255,0.7)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    dropdownMenu: {
        position: "absolute",
        top: "calc(100% + 10px)",
        right: 0,
        backgroundColor: "#fff",
        borderRadius: "14px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        minWidth: "200px",
        overflow: "hidden",
        zIndex: 9999,
        animation: "dropIn 0.2s ease",
    },
    dropdownHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        background: "linear-gradient(135deg, #f0f4ff, #fafafa)",
    },
    dropdownName: {
        fontWeight: 700,
        fontSize: "14px",
        color: "#1a1a2e",
    },
    dropdownRole: {
        fontSize: "11px",
        color: "#888",
        marginTop: "2px",
    },
    dropdownDivider: {
        height: "1px",
        background: "#f0f0f0",
    },
    dropdownItem: {
        width: "100%",
        padding: "11px 16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        background: "none",
        border: "none",
        fontSize: "14px",
        transition: "background 0.15s",
        textAlign: "left",
    },
};

const waveStyles = {
    wrapper: {
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
    },
    gradientBase: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(105deg, #0f3460 0%, #185a9d 35%, #7873f5 70%, #43cea2 100%)",
    },
    waveSvg: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "200%",
        height: "100%",
        animation: "waveFlow linear infinite",
    },
    orb1: {
        position: "absolute",
        top: "-20px",
        left: "30%",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(120,115,245,0.45) 0%, transparent 70%)",
        animation: "orbFloat 6s ease-in-out infinite",
    },
    orb2: {
        position: "absolute",
        top: "-10px",
        right: "20%",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(67,206,162,0.4) 0%, transparent 70%)",
        animation: "orbFloat 8s ease-in-out infinite reverse",
    },
};

const timerStyles = {
    pill: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 11px 5px 8px",
        borderRadius: "50px",
        backdropFilter: "blur(8px)",
        transition: "background 0.5s, border 0.5s",
    },
    text: {
        fontSize: "12px",
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "0.04em",
        transition: "color 0.5s",
    },
    urgentDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#ff6b6b",
        animation: "urgentPulse 1s ease-in-out infinite",
    },
};

export default StickerHeader;