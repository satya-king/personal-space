import React, { useEffect, useState } from 'react';
import CommonAPICallsService from '../utils/CommonAPICallsService';
import DataTable from '../utils/DataTable';

function SampleComponent() {
    const [message, setMessage] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [retryAfter, setRetryAfter] = useState(0);
    const [limit, setLimit] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [visualRemaining, setVisualRemaining] = useState(0);
    const [refillDuration, setRefillDuration] = useState(300); // seconds from backend Retry-After or default

    useEffect(() => {
        handleSampleGet();
    }, []);

    // Countdown for retryAfter
    useEffect(() => {
        if (retryAfter > 0) {
            const interval = setInterval(() => {
                setRetryAfter(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [retryAfter]);

    // Smooth refill animation for quota
    useEffect(() => {
        if (remaining === 0 && limit > 0) {
            setVisualRemaining(0);
            const durationPerStep = (refillDuration * 1000) / limit;
            let step = 1;
            const interval = setInterval(() => {
                setVisualRemaining(prev => {
                    if (prev >= limit) {
                        clearInterval(interval);
                        return limit;
                    }
                    return step++;
                });
            }, durationPerStep);
            return () => clearInterval(interval);
        }
    }, [remaining, limit, refillDuration]);

    const handleSampleGet = async () => {
        try {
            const response = await CommonAPICallsService.getSampleOne();
            setMessage(response?.data || []);
            setErrorMsg("");
            setRetryAfter(0);

            // Read quota headers
            const limitVal = parseInt(response.headers["x-rate-limit-limit"] || "0");
            const remainingVal = parseInt(response.headers["x-rate-limit-remaining"] || "0");
            setLimit(limitVal);
            setRemaining(remainingVal);
            setVisualRemaining(remainingVal);
        } catch (error) {
            console.log("API Error:", error.response);
            if (error.response && error.response.status === 429) {
                const retry = parseInt(error.response.headers['retry-after'] || "30", 10);
                setRetryAfter(retry);
                setErrorMsg("⏳ You’ve hit our rate limit! Please wait before retrying.");
                setLimit(parseInt(error.response.headers["x-rate-limit-limit"] || "0"));
                setRemaining(0);
                setVisualRemaining(0);
                setRefillDuration(retry); // use backend provided retry duration
            } else {
                setErrorMsg("⚠️ Something went wrong. Please try again later.");
            }
        }
    };

    const percentage = limit > 0 ? Math.round((visualRemaining / limit) * 100) : 0;

    const columns = [
        { key: "id", label: "Sl.No", width: "5%", render: value => value },
        { key: "email", label: "Email ID", width: "10%", render: value => value },
        { key: "username", label: "User Name", width: "30%", render: value => value },
        { key: "createdAt", label: "Created On", width: "20%", render: value => (value ? new Date(value).toLocaleString() : "-") },
    ];

    return (
        <div style={{
            width: "auto",
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            padding: "25px",
            textAlign: "center"
        }}>
            <h2 style={{ marginBottom: "12px", color: "#222" }}>🚀 Sample API Rate Limiting</h2>

            {message?.length === 0 ? (
                <p style={{ color: "#555" }}>No data available. Click "Fetch Again" to load.</p>
            ) : (
                <DataTable title="Users" columns={columns} data={message} />
            )}

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
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                        <svg width="120" height="120">
                            <circle cx="60" cy="60" r="50" stroke="#eee" strokeWidth="12" fill="none" />
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                stroke={percentage > 50 ? "#4caf50" : percentage > 20 ? "#ff9800" : "#f44336"}
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={2 * Math.PI * 50}
                                strokeDashoffset={(2 * Math.PI * 50) * (1 - percentage / 100)}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
                            />
                            <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="18" fontWeight="bold" fill="#333">
                                {visualRemaining}/{limit}
                            </text>
                        </svg>
                    </div>
                    <p style={{ margin: "5px 0", fontWeight: "500", color: "#555" }}>
                        You have <b>{visualRemaining}</b> / <b>{limit}</b> requests left
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
            {(retryAfter > 0 || errorMsg) && (
                <div style={{
                    background: retryAfter > 0 ? "#fff5f5" : "#e6ffed",
                    border: retryAfter > 0 ? "1px solid #f5c2c2" : "1px solid #a6f4c5",
                    borderRadius: "10px",
                    padding: "15px",
                    marginBottom: "20px"
                }}>
                    <p style={{ margin: "5px 0", fontWeight: "bold", color: retryAfter > 0 ? "#d32f2f" : "rgba(16, 197, 0, 1)" }}>
                        {retryAfter > 0
                            ? "⏳ You’ve hit our rate limit! Please wait before retrying."
                            : "✅ You can now retry fetching data!"}
                    </p>
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
                </div>
            )}

            <button
                onClick={handleSampleGet}
                style={{
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: remaining > 0 ? "#007bff" : "#999",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "500",
                    transition: "background 0.2s"
                }}
                onMouseOver={e => remaining > 0 && (e.currentTarget.style.backgroundColor = "#0056b3")}
                onMouseOut={e => remaining > 0 && (e.currentTarget.style.backgroundColor = "#007bff")}
            >
                🔄 Fetch Again
            </button>
        </div>
    );
}

export default SampleComponent;
