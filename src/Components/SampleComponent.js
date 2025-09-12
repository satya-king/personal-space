import React, { useEffect, useState } from 'react'
import CommonAPICallsService from '../utils/CommonAPICallsService';

function SampleComponent() {
    const [sample, setSample] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [retryAfter, setRetryAfter] = useState(0)
    const [limit, setLimit] = useState(0)
    const [remaining, setRemaining] = useState(0)
    const [funFact, setFunFact] = useState("")

    const funFacts = [
        "🔐 Rate limiting prevents brute-force attacks.",
        "⚖️ It ensures fair usage for everyone, like queues at an amusement park.",
        "🚦 Think of it as a traffic light – too many cars at once cause jams.",
        "🌍 Big APIs like Twitter, GitHub, and Google also enforce rate limits.",
        "⚡ Without rate limits, servers could crash from overload!"
    ]

    useEffect(() => {
        handleSampleGet()
    }, [])

    // Countdown effect for retryAfter
    useEffect(() => {
        if (retryAfter > 0) {
            const interval = setInterval(() => {
                setRetryAfter(prev => (prev > 0 ? prev - 1 : 0))
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [retryAfter])

    const handleSampleGet = async () => {
        try {
            const response = await CommonAPICallsService.getSampleOne();

            setSample(response?.data)
            setErrorMsg("")
            setRetryAfter(0)

            // read headers
            setLimit(parseInt(response.headers["x-rate-limit-limit"] || "0"))
            setRemaining(parseInt(response.headers["x-rate-limit-remaining"] || "0"))
        } catch (error) {
            if (error.response && error.response.status === 429) {
                const retry = parseInt(error.response.headers['retry-after'] || "30", 10)
                setRetryAfter(retry)
                setErrorMsg("⏳ You’ve hit our rate limit! Please wait before retrying.")
                setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)])
                setLimit(parseInt(error.response.headers["x-rate-limit-limit"] || "0"))
                setRemaining(parseInt(error.response.headers["x-rate-limit-remaining"] || "0"))
            } else {
                setErrorMsg("⚠️ Something went wrong. Please try again later.")
            }
        }
    };

    const percentage = limit > 0 ? Math.round((remaining / limit) * 100) : 0

    return (
        <div style={{
            width: "550px",
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            padding: "25px",
            textAlign: "center"
        }}>
            <h2 style={{ marginBottom: "12px", color: "#222" }}>🚀 Sample API Rate limiting</h2>
            {sample && <p style={{ fontSize: "16px", marginBottom: "20px", color: "#444" }}>{sample}</p>}

            {/* Quota Meter Section */}
            {limit > 0 && (
                <div style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    padding: "15px",
                    marginBottom: "20px",
                    background: "#fafafa"
                }}>
                    <h4 style={{ marginBottom: "8px", color: "#333" }}>📊 API Quota</h4>

                    {/* Circular Gauge */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                        <svg width="120" height="120">
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                stroke="#eee"
                                strokeWidth="12"
                                fill="none"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                stroke={
                                    percentage > 50 ? "#4caf50"
                                        : percentage > 20 ? "#ff9800"
                                            : "#f44336"
                                }
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={2 * Math.PI * 50}
                                strokeDashoffset={(2 * Math.PI * 50) * (1 - percentage / 100)}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
                            />
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dy=".3em"
                                fontSize="18"
                                fontWeight="bold"
                                fill="#333"
                            >
                                {remaining}/{limit}
                            </text>
                        </svg>
                    </div>

                    {/* Progress Bar */}
                    <p style={{ margin: "5px 0", fontWeight: "500", color: "#555" }}>
                        You have <b>{remaining}</b> / <b>{limit}</b> requests left
                    </p>
                    <div style={{
                        width: "100%",
                        height: "18px",
                        borderRadius: "10px",
                        background: "#eee",
                        overflow: "hidden",
                        border: "1px solid #ccc"
                    }}>
                        <div style={{
                            width: `${percentage}%`,
                            height: "100%",
                            background: percentage > 50 ? "linear-gradient(90deg,#4caf50,#66bb6a)"
                                : percentage > 20 ? "linear-gradient(90deg,#ff9800,#ffb74d)"
                                    : "linear-gradient(90deg,#f44336,#e57373)",
                            transition: "width 0.5s ease-in-out"
                        }} />
                    </div>
                </div>
            )}

            {/* Error / Retry Block */}
            {errorMsg && (
                <div style={{
                    background: "#fff5f5",
                    border: "1px solid #f5c2c2",
                    borderRadius: "10px",
                    padding: "15px",
                    marginBottom: "20px"
                }}>
                    <p style={{ margin: "5px 0", fontWeight: "bold", color: "#d32f2f" }}>{errorMsg}</p>
                    {retryAfter > 0 && (
                        <span style={{
                            display: "inline-block",
                            margin: "8px 0",
                            padding: "6px 12px",
                            background: "#ffcccc",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            color: "#a00"
                        }}>
                            ⏱ Retry available in {retryAfter}s
                        </span>
                    )}
                    {funFact && (
                        <p style={{ marginTop: "10px", fontStyle: "italic", color: "#555" }}>
                            💡 {funFact}
                        </p>
                    )}
                </div>
            )}

            <button
                onClick={handleSampleGet}
                style={{
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#007bff",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "500",
                    transition: "background 0.2s"
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = "#0056b3"}
                onMouseOut={e => e.currentTarget.style.backgroundColor = "#007bff"}
            >
                🔄 Fetch Again
            </button>
        </div>
    )
}

export default SampleComponent
