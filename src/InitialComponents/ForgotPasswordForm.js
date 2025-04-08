import { useState } from "react";
import { API_URL } from "../APIURLs/Urls";

const ForgotPasswordForm = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [isEmail, setIsEmail] = useState(true); // Flag to check whether to use email or mobile
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const forgotPasswordStyle2 = {
        textAlign: "right",
        fontWeight: 'bold',
        color: "tomato",
        fontSize: "15px",
        cursor: "pointer",
    };

    const styles = {
        container: {
            maxWidth: '500px',
            margin: '0 auto',
            padding: '70px',
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

    const handleResetPassword = async () => {
        // Check if email or mobile is entered
        if (isEmail && !email) {
            setError("Please enter your email.");
            return;
        }
        if (!isEmail && !mobile) {
            setError("Please enter your mobile number.");
            return;
        }

        try {
            // Simulate API call
            const response = await fetch(`${API_URL}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [isEmail ? 'email' : 'mobile']: isEmail ? email : mobile }),
            });

            if (response.ok) {
                setMessage("Password reset link sent to your email or mobile.");
            } else {
                setError("Failed to send password reset link.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Reset Your Password</h2>

            <div>
                <label style={styles.label} htmlFor="contactMethod">Contact Method</label>
                <select
                    id="contactMethod"
                    value={isEmail ? 'email' : 'mobile'}
                    onChange={(e) => setIsEmail(e.target.value === 'email')}
                    style={styles.input}
                >
                    <option value="email">Email</option>
                    <option value="mobile">Mobile</option>
                </select>
            </div>

            {isEmail ? (
                <div>
                    <label style={styles.label} htmlFor="email">Email</label>
                    <input
                        style={styles.input}
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            ) : (
                <div>
                    <label style={styles.label} htmlFor="mobile">Mobile Number</label>
                    <input
                        style={styles.input}
                        type="tel"
                        id="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                    />
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <button
                type="button"
                style={styles.submitButton}
                onClick={handleResetPassword}
            >
                Reset Password
            </button>&nbsp;
            <div style={forgotPasswordStyle2} onClick={onBackToLogin}>
                <u>! Back to Login</u>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
