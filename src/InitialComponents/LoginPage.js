import { useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { FaVolumeUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../APIURLs/Urls";
import ForgotPasswordForm from "./ForgotPasswordForm";

const generateCaptcha = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    let captcha = [];

    const getRandomChar = (charSet) => {
        const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % charSet.length;
        return charSet[randomIndex];
    };

    captcha.push(getRandomChar(uppercase));
    captcha.push(getRandomChar(lowercase));
    captcha.push(getRandomChar(numbers));

    // Fill remaining slots with random characters from all categories
    const allCharacters = uppercase + lowercase + numbers;
    for (let i = 3; i < 6; i++) {
        captcha.push(getRandomChar(allCharacters));
    }

    // Securely shuffle the CAPTCHA
    const secureShuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
    };

    secureShuffle(captcha);

    return captcha.join('');
};
const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [captchaInput, setCaptchaInput] = useState('')
    const [registration, setRegistration] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false); // State to toggle forms

    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Function to regenerate Captcha
    const handleCaptchaRefresh = () => {
        setCaptcha(generateCaptcha());
    }

    const handleVoiceClick = () => {
        if (!captcha) return; // Ensure captcha exists

        const words = captcha.split(" "); // Split captcha into words
        words.forEach((word, index) => {
            setTimeout(() => {
                const speech = new SpeechSynthesisUtterance(word);
                speech.lang = "en-US";
                speech.volume = 1; // Volume level (0 to 1)
                speech.rate = 0.4; // Rate of speech (0.1 to 10)
                speech.pitch = 2; // Pitch of speech (0 to 2)

                window.speechSynthesis.speak(speech);
            }, index * 1000); // Delay each word for natural pacing
        });
    };

    const handleLogin = async () => {
        setError("");

        // Validate CAPTCHA
        if (captchaInput.trim() === "") {
            setError("Please enter the CAPTCHA.");
            return;
        }

        if (captchaInput !== captcha) {
            setError("Invalid CAPTCHA. Please try again.");
            return;
        }

        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.text();

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

    // Inline styles
    const styles = {
        container: {
            maxWidth: '500px',
            margin: '0 auto',
            padding: '80px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
        },
        heading: {
            textAlign: 'center',
            fontSize: '2rem',         // Larger font size for emphasis
            fontWeight: 'bold',       // Makes the text bold
            color: '#333',            // Dark gray color for readability
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',  // Adds a subtle shadow effect
            margin: '20px 0',         // Adds margin above and below
            fontFamily: "'Arial', sans-serif",  // Clean and modern font
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            textAlign: 'left',
            fontWeight: 'bold',
        },
        input: {
            width: '100%',
            padding: '10px',
            marginBottom: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
        },
        captchaContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        captchaButton: {
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        captchaButtonHover: {
            backgroundColor: '#0056b3',
        },
        voiceButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
        },
        submitButton: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        submitButtonHover: {
            backgroundColor: '#218838',
        },
    };

    const forgotPasswordStyle = {
        textAlign: "right",
        fontWeight: 'bold',
        color: "red",
        fontSize: "15px",
        cursor: "pointer",
    };

    const registerContainerStyle = {
        marginTop: "20px",
        fontSize: "15px",
    };

    const registerLinkStyle = {
        fontWeight: "bold",
        color: "#C76A13", // Orange shade
        cursor: "pointer",
        textDecoration: "none",
    };


    return (
        <>

            {
                !localStorage.getItem("isAuthenticated") &&
                <div>
                    {showForgotPassword ? (
                        <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
                    ) : (
                        <div style={styles.container}>
                            <h2 style={styles.heading}><u>Please Enter Your Details</u></h2>
                            <form
                            // onSubmit={handleLogin}
                            >
                                <div>
                                    <label style={styles.label} htmlFor="loginId">Login ID</label>
                                    <input
                                        style={styles.input}
                                        type="text"
                                        id="loginId"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={styles.label} htmlFor="password">Password</label>
                                    <input
                                        style={styles.input}
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div style={forgotPasswordStyle} onClick={() => setShowForgotPassword(true)}>
                                    <u>Forgot Password?</u>
                                </div>

                                <div>
                                    <label style={styles.label} htmlFor="captcha">Captcha: &nbsp;
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0px 5px',
                                            border: '2px solid black',
                                            borderRadius: '5px',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            fontFamily: "'Courier New', monospace",
                                            letterSpacing: '3px',
                                            background: 'linear-gradient(to right, #f7f7f7, #e0e0e0)',
                                            color: '#333',
                                            textAlign: 'center',
                                            boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                                            userSelect: 'none',
                                        }}>
                                            {captcha}
                                        </span>
                                        <span><BiRefresh onClick={handleCaptchaRefresh} size={35} /></span>
                                    </label>
                                    <input
                                        style={styles.input}
                                        type="text"
                                        id="captchaInput"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="button"
                                    style={styles.submitButton}
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                            </form>
                            &nbsp;
                            {/* <div style={{
                            padding: '20px',
                            background: 'linear-gradient(to right, #00c6ff, #0072ff)', // Gradient background
                            borderRadius: '5px',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                            maxWidth: '500px',
                            height:'40vh',
                            margin: 'auto',
                            textAlign: 'center',
                            color: '#fff'
                        }}>
                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#fff',
                                marginBottom: '20px',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                Software Development
                            </h2>
                            <p style={{
                                fontSize: '1.2rem',
                                color: '#f1f1f1',
                                lineHeight: '1.4',  // Reduced line height to reduce height
                                fontWeight: '300',
                                fontFamily: "'Roboto', sans-serif",
                                marginBottom: '0',
                                textAlign: 'justify',
                                width: '100%',  // Increased width (adjust as needed)
                                padding: '1px',  // Adjust padding for better appearance
                            }}>
                                Software development is the process of designing, creating, testing, and maintaining software applications or systems. It involves various stages like planning, coding, debugging, and deploying. With the rapid growth of technology, software development has become a vital part of almost every industry.
                            </p>

                        </div> */}
                        </div>
                    )}
                </div>
            }

        </>
    );
}

export default LoginPage;