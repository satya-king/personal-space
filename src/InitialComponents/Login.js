import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        const validUser = "admin";
        const validPass = "password";

        if (username === validUser && password === validPass) {
            localStorage.setItem("isAuthenticated", "true");
            navigate("/dashboard");
        } else {
            setError("Invalid Credentials");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleLogin}>Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;
