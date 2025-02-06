import React, { useState } from "react";
import { FaRedo } from "react-icons/fa"; // Importing reload icon

const HumanVerificationMath = ({ onVerify }) => {
    const operations = ["+", "-"];

    const generateNewQuestion = () => {
        const num1 = Math.floor(Math.random() * 100) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1; 
        const operation = operations[Math.floor(Math.random() * operations.length)];
        return { num1, num2, operation };
    };

    const [question, setQuestion] = useState(generateNewQuestion());
    const [userAnswer, setUserAnswer] = useState("");
    const [error, setError] = useState("");

    const getCorrectAnswer = () => {
        switch (question.operation) {
            case "+": return question.num1 + question.num2;
            case "-": return question.num1 - question.num2;
            default: return null;
        }
    };

    const handleVerify = () => {
        const correctAnswer = getCorrectAnswer();
        if (parseFloat(userAnswer) === parseFloat(correctAnswer)) {
            onVerify(true);
        } else {
            setError("Incorrect! Try again with a new question.");
            setUserAnswer("");
            setQuestion(generateNewQuestion()); // Rerender new question
        }
    };

    const handleReload = () => {
        setError("");
        setUserAnswer("");
        setQuestion(generateNewQuestion());
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Verify You Are Human</h2>
            <div style={styles.questionContainer}>
                <p style={styles.question}>
                    Solve this: {question.num1} {question.operation} {question.num2} = ?
                </p>
                <FaRedo style={styles.reloadIcon} onClick={handleReload} title="Reload Question" />
            </div>
            <input 
                type="number" 
                value={userAnswer} 
                onChange={(e) => setUserAnswer(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleVerify} style={styles.button}>Verify</button>
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        margin: "50px auto",
        padding: "20px",
        maxWidth: "400px",
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
    },
    heading: {
        fontSize: "22px",
        color: "#333",
        marginBottom: "10px"
    },
    questionContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom:'3px'
    },
    question: {
        fontSize: "18px",
        color: "#555",
        marginRight: "10px"
    },
    reloadIcon: {
        fontSize: "20px",
        cursor: "pointer",
        color: "#007bff"
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        marginTop:'5px',
        marginBottom: "5px",
        width: "80%"
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "10px"
    },
    error: {
        color: "red",
        fontSize: "14px",
        marginTop: "10px"
    }
};

export default HumanVerificationMath;
