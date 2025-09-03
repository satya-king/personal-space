// Dashboard.js
import React from "react";

const Dashboard = () => {
    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <section style={styles.hero}>
                <h1 style={styles.title}>👨‍💻 Welcome to the Development World!</h1>
                <p style={styles.subtitle}>
                    Code, Debug, Deploy — Repeat! 🚀
                </p>
                <img
                    src="/walkingCodeGif.gif"
                    alt="Dev Coding"
                    style={styles.heroGif}
                />
            </section>

            {/* Cards Section */}
            <section style={styles.cardsContainer}>
                <div style={styles.card}>
                    <img
                        src="/funnyDevGif.gif"
                        alt="Coding fun"
                        style={styles.cardImage}
                    />
                    <h3 style={styles.cardTitle}>Keep Coding</h3>
                    <p style={styles.cardText}>
                        Every line of code takes you one step closer to mastery.
                    </p>
                </div>

                <div style={styles.card}>
                    <img
                        src="/funnyDevGif3.gif"
                        alt="Debugging"
                        style={styles.cardImage}
                    />
                    <h3 style={styles.cardTitle}>Debugging</h3>
                    <p style={styles.cardText}>
                        Debugging is like being the detective in a crime movie... where you
                        are also the murderer. 🕵️‍♂️
                    </p>
                </div>

                <div style={styles.card}>
                    <img
                        src="/funnyDevGif2.gif"
                        alt="Deploy"
                        style={styles.cardImage}
                    />
                    <h3 style={styles.cardTitle}>Deploy & Chill</h3>
                    <p style={styles.cardText}>
                        Nothing feels better than shipping your code and watching it run
                        live! ✨
                    </p>
                </div>
            </section>

            {/* Video Section */}
            <section style={styles.videoSection}>
                <h2 style={styles.videoTitle}>🎬 Inspiration for Developers</h2>
                <iframe
                    width="560"
                    height="315"
                    src="/Development Video.mp4"
                    title="Motivation for Developers"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={styles.video}
                ></iframe>
            </section>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        textAlign: "center",
        background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
        minHeight: "100vh",
    },
    hero: {
        marginBottom: "40px",
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "10px",
    },
    subtitle: {
        fontSize: "18px",
        color: "#555",
        marginBottom: "20px",
    },
    heroGif: {
        width: "350px",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    },
    cardsContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap",
        marginTop: "40px",
    },
    card: {
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        maxWidth: "300px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        textAlign: "center",
        transition: "transform 0.3s",
    },
    cardImage: {
        width: "100%",
        height: "180px",
        objectFit: "cover",
        borderRadius: "10px",
        marginBottom: "10px",
    },
    cardTitle: {
        fontSize: "20px",
        fontWeight: "600",
        margin: "10px 0",
        color: "#222",
    },
    cardText: {
        fontSize: "14px",
        color: "#555",
    },
    videoSection: {
        marginTop: "60px",
    },
    videoTitle: {
        fontSize: "24px",
        marginBottom: "20px",
        color: "#222",
    },
    video: {
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    },
};

export default Dashboard;
