import React from "react";
import LoginPage from "./LoginPage";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

const LandingPage = () => {
    const styles = {
        landingPage: {
            fontFamily: "Arial, sans-serif",
            //   backgroundImage: "url('/ladylanding.jpg')",
            // backgroundImage: "url('/lady2.png')",
            backgroundImage: "url('/both.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            height: "100vh",
            display: "flex",
            flexDirection: "column"
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 50px",
            background: "rgba(0, 0, 0, 0.7)"
        },
        logo: {
            fontSize: "30px",
            fontWeight: "bold",
            color: "#0ff"
        },
        navLink: {
            color: "#fff",
            margin: "0 15px",
            textDecoration: "none",
            fontSize: "16px"
        },
        searchBar: {
            padding: "5px 15px",
            border: "none",
            borderRadius: "20px"
        },
        heroSection: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "2 0px"
        },
        content: {},
        heading: {
            fontSize: "48px"
        },
        paragraph: {
            margin: "25px 0",
            fontSize: "18px"
        },
        ctaButton: {
            backgroundColor: "#00ffcc",
            color: "#000",
            padding: "10px 20px",
            border: "none",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "16px"
        },
        socialIcons: {
            display: "flex",
            gap: "15px"
        },
        icon: {
            fontSize: "30px",
            cursor: "pointer"
        },
        sideInfo: {
            textAlign: "center"
        },
        sideHeading: {
            fontSize: "24px"
        },
        heroImage: {
            width: "250px",
            marginTop: "20px",
            borderRadius: "10px"
        }
    };

    return (
        <div style={styles.landingPage}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.logo}>Landing Page</div>
                <nav>
                    <a href="#home" style={styles.navLink}>Home</a>
                    <a href="#about" style={styles.navLink}>About</a>
                    <a href="#workshop" style={styles.navLink}>Materials</a>
                    <a href="#contact" style={styles.navLink}>Orders</a>
                </nav>
                <input type="text" placeholder="Search" style={styles.searchBar} />
            </header>

            {/* Hero Section */}
            <div style={styles.heroSection}>
            <div style={styles.content}>
            <h1 style={styles.heading}>GROW YOUR BUSINESS WITH US!</h1>
           <div>
            <button style={styles.ctaButton}>GET IN TOUCH</button>
            </div>&nbsp;
            <div style={styles.socialIcons}>
                <FaInstagram style={styles.icon} />
                <FaFacebookF style={styles.icon} />
                <FaTwitter style={styles.icon} />
                <FaWhatsapp style={styles.icon} />
            </div>
        </div>
                <div style={styles.sideInfo}>
                    {/* <h2 style={styles.sideHeading}>NO.1 DIGITAL MARKETING AGENCY</h2> */}
                    {/* <img src="/businessman.png" alt="Businessman" style={styles.heroImage} /> */}
                    <LoginPage />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
