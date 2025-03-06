import LoginPage from "./LoginPage";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const HomePage = () => {
    const containerStyle = {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
    };

    const rowStyle = {
        width: "100%",
        height: "100%",
        display: "flex",
    };

    const leftSideStyle = {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        width: "30%", // Update the width if you want different sizing
        padding: "20px",
    };

    const rightSideStyle = {
        position: "relative",
        backgroundImage: `url("/ap.png")`, // Update the image URL as per your directory
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        width: "70%", // Update the width if you want different sizing
        height: "100%",
    };

    const overlayStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    };

    const textStyle = {
        position: "relative",
        zIndex: 1,
        fontSize: "2.5rem",
        fontWeight: "bold",
        textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
    };

    return (
        <Container fluid style={containerStyle}>
            <Row style={rowStyle}>
                {/* Right Side - Welcome Section */}
                <Col md={6} style={rightSideStyle}>
                    <div style={overlayStyle}></div>
                    <div style={textStyle}>
                        <h1>Welcome to <br /> Learners World</h1>
                    </div>
                </Col>

                {/* Left Side - Login Form */}
                <Col md={6} style={leftSideStyle}>
                    <LoginPage />
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;