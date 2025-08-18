import { useState } from "react";
import { BiRefresh, BiUser } from "react-icons/bi";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../APIURLs/Urls";
import ForgotPasswordForm from "./ForgotPasswordForm";
import "./LoginPage.css";
import axiosInstance from "../utils/axiosInstance";


const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
};

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [captchaInput, setCaptchaInput] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCaptchaRefresh = () => setCaptcha(generateCaptcha());

    const handleLogin = async () => {
        setError("");

        // Captcha validation
        if (captchaInput.trim() === "" || captchaInput !== captcha) {
            setError("Invalid CAPTCHA. Please try again.");
            return;
        }

        try {
            // const response = await fetch(`${API_URL}/login`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ username, password }),
            // });

            const response = await axiosInstance.post("/login", {
                username,
                password,
            });

            console.log("Login Response:", response);
            

            if (!response.status || response.status !== 200) {
                const errorText = await response.text();
                throw new Error(errorText || "Invalid credentials");
            }



            // Assuming backend returns JWT token
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("userName", response.data.username);

            navigate("/home");
        } catch (error) {
            console.error("Login Request Failed:", error);
            setError(error.message || "Something went wrong. Try again.");
        }
    };

    return (
        <div className="login-background">
            <div className="login-overlay">
                <div className="login-card">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                        alt="App Logo"
                        className="login-logo"
                    />
                    <h2 className="login-title">Welcome Back 👋</h2>
                    <p className="login-subtitle">Please login to continue</p>

                    {showForgotPassword ? (
                        <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
                    ) : (
                        <>
                            <div className="login-input-group">
                                <BiUser size={20} className="login-icon" />
                                <input
                                    className="login-input"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="login-input-group">
                                <FaLock size={20} className="login-icon" />
                                <input
                                    className="login-input"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            <div
                                className="login-forgot"
                                onClick={() => setShowForgotPassword(true)}
                            >
                                Forgot Password?
                            </div>

                            <div className="login-captcha-box">
                                <span className="login-captcha">{captcha}</span>
                                <BiRefresh
                                    size={25}
                                    onClick={handleCaptchaRefresh}
                                    className="login-refresh-icon"
                                />
                            </div>

                            <input
                                className="login-input"
                                type="text"
                                placeholder="Enter CAPTCHA"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                            />

                            <button className="login-button" onClick={handleLogin}>
                                Login
                            </button>

                            {error && <p className="login-error">{error}</p>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
