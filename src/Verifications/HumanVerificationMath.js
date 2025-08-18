import React, { useState } from "react";
import { FaRedo, FaArrowLeft } from "react-icons/fa";

const HumanVerificationMath = ({ onVerify, onBack }) => {
    const operations = ["+", "-"];

    const generateNewQuestion = () => {
        const num1 = Math.floor(Math.random() * 100) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operation =
            operations[Math.floor(Math.random() * operations.length)];
        return { num1, num2, operation };
    };

    const [question, setQuestion] = useState(generateNewQuestion());
    const [userAnswer, setUserAnswer] = useState("");
    const [error, setError] = useState("");

    const getCorrectAnswer = () => {
        switch (question.operation) {
            case "+":
                return question.num1 + question.num2;
            case "-":
                return question.num1 - question.num2;
            default:
                return null;
        }
    };

    const handleVerify = () => {
        const correctAnswer = getCorrectAnswer();
        if (parseFloat(userAnswer) === parseFloat(correctAnswer)) {
            onVerify(true);
        } else {
            setError("❌ Incorrect! Try again.");
            setUserAnswer("");
            setQuestion(generateNewQuestion());
        }
    };

    const handleReload = () => {
        setError("");
        setUserAnswer("");
        setQuestion(generateNewQuestion());
    };

    return (
        <div style={styles.fullScreen}>
            <div style={styles.card}>
                {/* Back button */}
                {onBack && (
                    <button style={styles.backButton} onClick={onBack}>
                        <FaArrowLeft style={{ marginRight: "6px" }} /> Back
                    </button>
                )}

                <h2 style={styles.heading}>🤖 Human Verification</h2>
                <p style={styles.subHeading}>Please solve the math problem below</p>

                <div style={styles.questionContainer}>
                    <p style={styles.question}>
                        {question.num1} {question.operation} {question.num2} = ?
                    </p>
                    <FaRedo
                        style={styles.reloadIcon}
                        onClick={handleReload}
                        title="New Question"
                    />
                </div>

                <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    style={styles.input}
                    placeholder="Enter your answer"
                />

                <button onClick={handleVerify} style={styles.verifyButton}>
                    ✅ Verify
                </button>

                {error && <p style={styles.error}>{error}</p>}
            </div>
        </div>
    );
};

const styles = {
    fullScreen: {
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #6dd5ed, #2193b0)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
    },
    card: {
        width: "100%",
        maxWidth: "450px",
        backgroundColor: "#fff",
        borderRadius: "15px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        padding: "30px",
        textAlign: "center",
        position: "relative",
    },
    backButton: {
        position: "absolute",
        top: "15px",
        left: "15px",
        background: "transparent",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
        color: "#007bff",
        display: "flex",
        alignItems: "center",
    },
    heading: {
        fontSize: "26px",
        color: "#333",
        marginBottom: "8px",
    },
    subHeading: {
        fontSize: "16px",
        color: "#666",
        marginBottom: "20px",
    },
    questionContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "15px",
    },
    question: {
        fontSize: "22px",
        fontWeight: "600",
        color: "#444",
        marginRight: "10px",
    },
    reloadIcon: {
        fontSize: "22px",
        cursor: "pointer",
        color: "#007bff",
    },
    input: {
        width: "100%",
        padding: "12px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        marginBottom: "15px",
        textAlign: "center",
    },
    verifyButton: {
        padding: "12px 25px",
        fontSize: "16px",
        background: "linear-gradient(135deg, #28a745, #218838)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "0.3s",
    },
    error: {
        color: "red",
        fontSize: "14px",
        marginTop: "12px",
    },
};

export default HumanVerificationMath;
