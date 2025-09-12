import React, { useState, useEffect } from "react";

function getBinaryLine(len = 40) {
    return Array.from({ length: len }, () => (Math.random() > 0.5 ? "1" : "0")).join("");
}

function getRandomLog() {
    const pool = [
        "[INIT] Launching exploit...",
        "[TRACE] Connection rerouted...",
        "[SCAN] Scanning open ports...",
        "[WARNING] IDS bypassed",
        "[SUCCESS] Root privileges obtained",
        "[UPLOAD] Deploying payload...",
        "[EXFIL] Extracting data packets...",
        "[CLEANUP] Covering tracks...",
    ];
    return pool[Math.floor(Math.random() * pool.length)];
}

function HackerDesktop() {
    const [logs, setLogs] = useState([]);
    const [binary, setBinary] = useState([]);
    const [windows, setWindows] = useState([
        { id: 1, title: "Terminal 1", x: 100, y: 80, minimized: false, content: "logs", z: 1 },
        { id: 2, title: "System Hacks", x: 350, y: 150, minimized: false, content: "progress", z: 2 },
        { id: 3, title: "Target List", x: 650, y: 200, minimized: false, content: "targets", z: 3 },
        { id: 4, title: "Binary Stream", x: 450, y: 50, minimized: false, content: "binary", z: 4 }
    ]);

    const [progressTasks, setProgressTasks] = useState([
        { task: "Firewall Breach", progress: 0, target: 100 }
    ]);

    const targets = [
        { ip: "192.168.0.45", status: "Compromised", location: "US-East" },
        { ip: "10.0.2.33", status: "Scanning...", location: "EU-West" },
        { ip: "172.16.5.99", status: "Encrypted", location: "Asia-South" }
    ];

    // Infinite logs feed
    useEffect(() => {
        const interval = setInterval(() => {
            setLogs((prev) => [...prev.slice(-30), getRandomLog()]); // keep only last 30
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    // Progress animation loop
    useEffect(() => {
        const interval = setInterval(() => {
            setProgressTasks((prev) =>
                prev.map((p, i) => {
                    if (p.progress < p.target) {
                        return { ...p, progress: p.progress + 2 };
                    } else if (i === prev.length - 1) {
                        // When last task completes, add new one
                        return { ...p }; // keep last one at 100%
                    }
                    return p;
                })
            );
        }, 200);
        return () => clearInterval(interval);
    }, []);

    // Add a new task when last hits 100%
    useEffect(() => {
        if (progressTasks[progressTasks.length - 1].progress >= 100) {
            const newTasks = [
                "Database Decrypt",
                "Payload Injection",
                "IP Spoofing",
                "Malware Deployment",
                "Data Exfiltration"
            ];
            const newTask = newTasks[Math.floor(Math.random() * newTasks.length)];
            setProgressTasks((prev) => [...prev, { task: newTask, progress: 0, target: 100 }]);
        }
    }, [progressTasks]);

    // Binary rain
    useEffect(() => {
        const interval = setInterval(() => {
            setBinary((prev) => [getBinaryLine(60), ...prev.slice(0, 20)]);
        }, 150);
        return () => clearInterval(interval);
    }, []);

    // Minimize window
    const toggleWindow = (id) => {
        setWindows((prev) =>
            prev.map((w) =>
                w.id === id ? { ...w, minimized: !w.minimized } : w
            )
        );
    };

    // Bring window to top
    const bringToFront = (id) => {
        const maxZ = Math.max(...windows.map((w) => w.z));
        setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, z: maxZ + 1 } : w))
        );
    };

    // Dragging
    const handleDrag = (e, id) => {
        bringToFront(id);
        const rect = e.target.getBoundingClientRect();
        const shiftX = e.clientX - rect.left;
        const shiftY = e.clientY - rect.top;

        const onMouseMove = (ev) => {
            setWindows((prev) =>
                prev.map((w) =>
                    w.id === id ? { ...w, x: ev.pageX - shiftX, y: ev.pageY - shiftY } : w
                )
            );
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", onMouseMove);
        }, { once: true });
    };

    return (
        <div className="desktop">
            <style>{`
        :root {
          --bg: #000;
          --text: #00ff00;
          --muted: #008f11;
          --panel: rgba(0, 20, 0, 0.85);
        }
        .desktop {
          background: black;
          color: var(--text);
          font-family: "Courier New", monospace;
          min-height: 100vh;
          overflow: hidden;
          position: relative;
        }
        .matrix {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          font-size: 12px;
          color: var(--muted);
          opacity: 0.2;
          pointer-events: none;
        }
        .matrix-line {
          white-space: nowrap;
        }
        .window {
          position: absolute;
          width: 500px;
          height: 400px;
          background: var(--panel);
          border: 1px solid var(--muted);
          box-shadow: 0 0 25px rgba(0,255,0,0.4);
          border-radius: 6px;
          resize: both;
          overflow: auto;
        }
        .title-bar {
          background: #003300;
          padding: 6px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          cursor: move;
          user-select: none;
        }
        .content {
          padding: 8px;
          font-size: 12px;
          max-height: 250px;
          overflow-y: auto;
        }
        .progress {
          background: #001100;
          height: 12px;
          border-radius: 6px;
          margin: 4px 0;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: var(--text);
          transition: width 0.2s;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        td, th {
          border-bottom: 1px dashed var(--muted);
          padding: 4px;
        }
        .glitch {
          animation: glitch 1s infinite;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 red, -2px 0 blue; }
          50% { text-shadow: -2px 0 lime, 2px 0 magenta; }
          100% { text-shadow: 2px 0 red, -2px 0 blue; }
        }
      `}</style>

            {/* Binary rain background */}
            <div className="matrix">
                {binary.map((line, i) => (
                    <div key={i} className="matrix-line">{line}</div>
                ))}
            </div>

            {/* Windows */}
            {windows.map((w) => (
                <div
                    key={w.id}
                    className="window"
                    style={{ top: w.y, left: w.x, zIndex: w.z }}
                    onMouseDown={() => bringToFront(w.id)}
                >
                    <div
                        className="title-bar"
                        onMouseDown={(e) => handleDrag(e, w.id)}
                    >
                        <span className="glitch">{w.title}</span>
                        <span onClick={() => toggleWindow(w.id)} style={{ cursor: "pointer" }}>
                            {w.minimized ? "[+]" : "[-]"}
                        </span>
                    </div>

                    {!w.minimized && (
                        <div className="content">
                            {w.content === "logs" &&
                                logs.map((log, i) => <div key={i}>{log}</div>)
                            }

                            {w.content === "progress" &&
                                progressTasks.map((p, i) => (
                                    <div key={i}>
                                        <div>{p.task} ({p.progress}%)</div>
                                        <div className="progress">
                                            <div className="progress-bar" style={{ width: `${p.progress}%` }}></div>
                                        </div>
                                    </div>
                                ))
                            }

                            {w.content === "targets" &&
                                <table>
                                    <thead>
                                        <tr><th>IP</th><th>Status</th><th>Location</th></tr>
                                    </thead>
                                    <tbody>
                                        {targets.map((t) => (
                                            <tr key={t.ip}>
                                                <td>{t.ip}</td>
                                                <td>{t.status}</td>
                                                <td>{t.location}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }

                            {w.content === "binary" &&
                                binary.map((line, i) => <div key={i}>{line}</div>)
                            }
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default HackerDesktop;
