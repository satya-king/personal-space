import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../InitialComponents/LoginStyles.css';

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
            localStorage.setItem("userName", validUser);
            navigate("/home");
        } else {
            setError("Invalid Credentials");
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
