import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../InitialComponents/LoginStyles.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Change BASE_URL to match local or server
    const BASE_URL = "http://localhost:8080/learn/login"; // Change when deploying

    const handleLogin = async () => {
        setError("");  // Clear previous errors

        try {
            const response = await fetch("http://localhost:8080/learn/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            console.log("Response Status:", response.status); // Debugging status

            const data = await response.text(); // Read response body

            console.log("Response Data:", data); // Print full response

            if (response.ok) {
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("userName", username);
                navigate("/home");
            } else {
                setError(data);
            }
        } catch (error) {
            console.error("Login Request Failed:", error);
            setError("Something went wrong. Try again.");
        }
    };


    return (
        <div className='container'>
            {!localStorage.getItem("isAuthenticated") && (
                <div className='card' style={{ border: '2px solid black' }}>
                    <h2>Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='inputField'
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='inputField'
                    />
                    <button onClick={handleLogin} className='button'>
                        Login
                    </button>
                    {error && <p className='error'>{error}</p>}
                </div>
            )}
        </div>
    );
};

export default Login;
