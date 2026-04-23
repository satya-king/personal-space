import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { showNotification } from "../utils/CommonFunctions";
import ForgotPasswordForm from "./ForgotPasswordForm";
import "./LoginPage.css";

// ── helpers ──────────────────────────────────────────────────────────────────
const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars
    return Array.from({ length: 6 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
};

const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
        { label: "Too short", color: "#ff4757" },
        { label: "Weak", color: "#ff6b35" },
        { label: "Fair", color: "#ffa502" },
        { label: "Strong", color: "#2ed573" },
        { label: "Very strong", color: "#1e90ff" },
    ];
    return { score, ...map[score] };
};

// ── Particle canvas ───────────────────────────────────────────────────────────
const ParticleCanvas = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let raf;
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.2,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(130,180,255,${p.alpha})`;
                ctx.fill();
            });
            // draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(
                        particles[i].x - particles[j].x,
                        particles[i].y - particles[j].y
                    );
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(130,180,255,${0.12 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
        };
    }, []);
    return <canvas ref={canvasRef} className="lp-canvas" />;
};

// ── FloatingInput ─────────────────────────────────────────────────────────────
const FloatingInput = ({
    id,
    label,
    type = "text",
    value,
    onChange,
    icon,
    suffix,
    error,
    autoComplete,
}) => (
    <div className={`lp-field ${value ? "lp-field--has-value" : ""} ${error ? "lp-field--error" : ""}`}>
        <span className="lp-field-icon">{icon}</span>
        <input
            id={id}
            className="lp-field-input"
            type={type}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            placeholder=" "
        />
        <label htmlFor={id} className="lp-field-label">
            {label}
        </label>
        {suffix && <span className="lp-field-suffix">{suffix}</span>}
        {error && <p className="lp-field-error-msg">{error}</p>}
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [captchaInput, setCaptchaInput] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [dark, setDark] = useState(true);
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();
    const strength = getPasswordStrength(password);

    useEffect(() => {
        setTimeout(() => setMounted(true), 50);
    }, []);

    const validate = () => {
        const e = {};
        if (!username.trim()) e.username = "Username is required";
        if (!password) e.password = "Password is required";
        else if (password.length < 4) e.password = "Password too short";
        if (!captchaInput.trim()) e.captcha = "Enter the CAPTCHA";
        else if (captchaInput !== captcha) e.captcha = "Incorrect CAPTCHA";
        return e;
    };

    const handleLogin = async () => {
        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            if (e.captcha) {
                setCaptcha(generateCaptcha());
                setCaptchaInput("");
            }
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            const response = await axiosInstance.post("/login", { username, password });
            localStorage.setItem("token", response?.data?.token);
            localStorage.setItem("refreshToken", response?.data?.refreshToken);
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("userName", response?.data?.username);
            localStorage.setItem("roleId", response?.data?.roleId);
            localStorage.setItem("exp", response?.data?.exp);
            navigate("/home");
        } catch (err) {
            showNotification("error", err?.response?.data?.message || "Invalid credentials");
            setCaptcha(generateCaptcha());
            setCaptchaInput("");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className={`lp-root ${dark ? "lp-dark" : "lp-light"} ${mounted ? "lp-mounted" : ""}`}>
            <ParticleCanvas />

            {/* Ambient orbs */}
            <div className="lp-orb lp-orb--1" />
            <div className="lp-orb lp-orb--2" />
            <div className="lp-orb lp-orb--3" />

            {/* Dark/light toggle */}
            <button
                className="lp-theme-toggle"
                onClick={() => setDark((d) => !d)}
                aria-label="Toggle theme"
            >
                <span className="lp-theme-toggle-track">
                    <span className="lp-theme-toggle-thumb">{dark ? "🌙" : "☀️"}</span>
                </span>
            </button>

            <div className="lp-card">
                {/* Glowing border top */}
                <div className="lp-card-glow" />

                {/* Logo / branding */}
                <div className="lp-brand">
                    <div className="lp-logo-ring">
                        <svg viewBox="0 0 40 40" fill="none" className="lp-logo-svg">
                            <circle cx="20" cy="20" r="18" stroke="url(#g1)" strokeWidth="2" />
                            <path
                                d="M13 20 L20 13 L27 20 L20 27 Z"
                                fill="url(#g2)"
                            />
                            <defs>
                                <linearGradient id="g1" x1="0" y1="0" x2="40" y2="40">
                                    <stop offset="0%" stopColor="#60a5fa" />
                                    <stop offset="100%" stopColor="#a78bfa" />
                                </linearGradient>
                                <linearGradient id="g2" x1="0" y1="0" x2="40" y2="40">
                                    <stop offset="0%" stopColor="#60a5fa" />
                                    <stop offset="100%" stopColor="#a78bfa" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="lp-title">Knowledge Hub</h1>
                    <p className="lp-subtitle">Your personal tech universe</p>
                </div>

                {showForgotPassword ? (
                    <div className="lp-forgot-wrapper">
                        <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
                    </div>
                ) : (
                    <div className="lp-form" onKeyDown={handleKeyDown}>
                        {/* Username */}
                        <FloatingInput
                            id="username"
                            label="Username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
                            }}
                            autoComplete="username"
                            error={errors.username}
                            icon={
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                </svg>
                            }
                        />

                        {/* Password */}
                        <FloatingInput
                            id="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                            }}
                            autoComplete="current-password"
                            error={errors.password}
                            icon={
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            }
                            suffix={
                                <button
                                    type="button"
                                    className="lp-eye-btn"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10 10 0 0112 20C7 20 2.73 16.11 1 11c.738-2.058 2.106-3.847 3.87-5.13M9.9 4.24A9.12 9.12 0 0112 4c5 0 9.27 3.89 11 9-1.006 2.806-2.87 5.2-5.27 6.76M1 1l22 22" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12C2.73 6.89 7 3 12 3s9.27 3.89 11 9c-1.73 5.11-6 9-11 9S2.73 17.11 1 12z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            }
                        />

                        {/* Password strength */}
                        {password && (
                            <div className="lp-strength">
                                <div className="lp-strength-bars">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="lp-strength-bar"
                                            style={{
                                                background: i <= strength.score ? strength.color : undefined,
                                                opacity: i <= strength.score ? 1 : 0.2,
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="lp-strength-label" style={{ color: strength.color }}>
                                    {strength.label}
                                </span>
                            </div>
                        )}

                        {/* Forgot password */}
                        <button
                            type="button"
                            className="lp-forgot-btn"
                            onClick={() => setShowForgotPassword(true)}
                        >
                            Forgot password?
                        </button>

                        {/* CAPTCHA */}
                        <div className="lp-captcha-row">
                            <div className="lp-captcha-display">
                                <span className="lp-captcha-text">{captcha}</span>
                                <button
                                    type="button"
                                    className="lp-captcha-refresh"
                                    onClick={() => {
                                        setCaptcha(generateCaptcha());
                                        setCaptchaInput("");
                                    }}
                                    aria-label="Refresh CAPTCHA"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M1 4v6h6M23 20v-6h-6" />
                                        <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" />
                                    </svg>
                                </button>
                            </div>
                            <FloatingInput
                                id="captcha"
                                label="Enter CAPTCHA"
                                value={captchaInput}
                                onChange={(e) => {
                                    setCaptchaInput(e.target.value);
                                    if (errors.captcha) setErrors((prev) => ({ ...prev, captcha: "" }));
                                }}
                                error={errors.captcha}
                                icon={
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                }
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="button"
                            className={`lp-submit ${loading ? "lp-submit--loading" : ""}`}
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="lp-spinner" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="lp-submit-arrow">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                            <span className="lp-submit-shine" />
                        </button>
                    </div>
                )}

                {/* Footer */}
                <div className="lp-footer">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="lp-footer-link" aria-label="GitHub">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                    </a>
                    <span className="lp-footer-sep" />
                    <span className="lp-footer-copy">© 2025 Knowledge Hub</span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;