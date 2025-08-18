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
        padding: "50px",
        // border: "1px solid", // Add a solid black border, you can change the color and width
        borderRadius: "50px", // Add rounded corners
        margin: "20px", // Add margin for spacing outside the element
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)", // Add shadow for a subtle 3D effect
        overflow: "hidden", // Ensure that content doesn't overflow if it's too big
    };


    const rightSideStyle = {
        position: "relative",
        // backgroundImage: `url("/ap.png")`, // Update the image URL as per your directory
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        width: "100%", // Update the width if you want different sizing
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
        fontSize: "2.1rem",
        fontWeight: "bold",
        textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
    };

    return (
        <Container fluid style={containerStyle}>
            <Row style={rowStyle}>
                <Col md={6} style={{
                    ...rightSideStyle,
                    backgroundImage: 'url(/FastTechnology.png)',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    height: '100%', // Ensure height is defined if needed
                    position: 'relative' // For overlay positioning
                }}>
                    <div style={overlayStyle}></div>
                    <div style={textStyle}>
                    </div>
                </Col>

                <Col md={6} style={{
                    ...leftSideStyle,
                    backgroundImage: 'url(/.jpg)',
                    backgroundPosition: 'center',

                }}>
                    <LoginPage />
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;