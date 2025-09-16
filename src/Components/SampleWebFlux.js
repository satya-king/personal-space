import React, { useEffect, useState } from 'react';

function SampleWebFlux({ seconds = 10 }) {
    const [count, setCount] = useState("Waiting...");
    const [status, setStatus] = useState("⏳ Connecting...");

    useEffect(() => {
        // Connect to backend SSE endpoint
        const eventSource = new EventSource(`http://localhost:8081/learn/countdown/${seconds}`);

        eventSource.onopen = () => {
            setStatus("✅ Connected to countdown stream");
        };

        eventSource.onmessage = (event) => {
            console.log("Received:", event.data);
            setCount(event.data);

            if (parseInt(event.data) === 0) {
                setStatus("🎉 Countdown finished!");
                eventSource.close();
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE error:", err);
            setStatus("⚠️ Connection lost");
            eventSource.close();
        };

        return () => {
            eventSource.close(); // cleanup when component unmounts
        };
    }, [seconds]);

    return (
        <div style={{
            textAlign: "center",
            marginTop: "40px",
            padding: "20px",
            border: "2px solid #ddd",
            borderRadius: "12px",
            maxWidth: "400px",
            margin: "auto",
            backgroundColor: "#f9f9f9"
        }}>
            <h2>🔥 WebFlux Countdown</h2>
            <p style={{ fontWeight: "bold", color: "#333" }}>{status}</p>
            <h1 style={{ fontSize: "60px", color: count === "🎉 Done!" ? "green" : "red" }}>
                {count}
            </h1>
        </div>
    );
}

export default SampleWebFlux;
