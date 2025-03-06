import { useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { FaVolumeUp } from "react-icons/fa";

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
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [captchaInput, setCaptchaInput] = useState('')
    const [registration, setRegistration] = useState(false)

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

    // Handle login form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (captchaInput !== captcha) {
            alert('Invalid Captcha!');
        } else {
            alert('Logged in successfully');
            // Handle login logic here
        }
    }

    // Inline styles
    const styles = {
        container: {
            maxWidth: '400px',
            margin: '0 auto',
            padding: '20px',
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
        fontSize: "12px",
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

            <div style={styles.container}>
                <h2 style={styles.heading}><u>Please Enter Your Details</u></h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={styles.label} htmlFor="loginId">Login ID</label>
                        <input
                            style={styles.input}
                            type="text"
                            id="loginId"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
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
                    {/* Forgot Password */}
                    <div style={forgotPasswordStyle}>Forgot Password ?</div>
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
                                userSelect: 'none'
                            }}>
                                {captcha}
                            </span> &nbsp;
                            <span> <button
                                type="button"
                                style={styles.voiceButton}
                                onClick={handleVoiceClick}
                            >
                                <FaVolumeUp size={30} color="violet" />
                            </button></span>
                            <span> <BiRefresh onClick={handleCaptchaRefresh} size={35} /></span>
                        </label>
                        <div style={styles.captchaContainer}>
                            <input
                                style={styles.input}
                                type="text"
                                id="captchaInput"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                required
                            />



                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            style={styles.submitButton}
                            onMouseOver={(e) => e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor}
                            onMouseOut={(e) => e.target.style.backgroundColor = styles.submitButton.backgroundColor}
                        >
                            Login
                        </button>
                    </div>
                    {/* Register Link */}
                    <div style={registerContainerStyle}>
                        Don’t have an Account?{" "}
                        <span style={registerLinkStyle} onClick={() => setRegistration(true)}>
                            Register
                        </span>
                    </div>
                </form>
            </div>

        </>
    );
}

export default LoginPage;