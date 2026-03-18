import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg-warehouse.jpg";
import "../App.css";

function About() {
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="cinematic-bg"
            style={{ backgroundImage: `url(${bgImage})`, minHeight: "100vh", overflowY: "auto" }}
        >
            {/* ===== NAVBAR ===== */}
            <header className="top-nav">
                <div className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Boxly</div>

                <nav className="nav-links">
                    <a href="/">Home</a>
                    <a href="/about" style={{ color: "white", fontWeight: "600" }}>About</a>
                </nav>

                <div className="nav-auth">
                    <button className="auth-btn" onClick={() => navigate("/")}>
                        Login
                    </button>
                </div>
            </header>

            {/* ===== ABOUT CONTENT ===== */}
            <section className={`about-container ${animate ? "fade-in" : ""}`} style={{ zIndex: 2, padding: "120px 20px 60px 20px", color: "white", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <h1 style={{ fontSize: "4rem", fontWeight: "800", marginBottom: "20px", letterSpacing: "3px", textTransform: "uppercase" }}>About Boxly</h1>
                <p style={{ fontSize: "1.2rem", color: "#d1d5db", maxWidth: "800px", lineHeight: "1.8", marginBottom: "60px" }}>
                    Boxly is a next-generation warehouse and logistics management platform designed to streamline the complex operations of inventory tracking and supply chain management. By uniting Admins, Staff, and Suppliers into one seamless digital ecosystem, Boxly ensures real-time visibility, maximum efficiency, and intelligent data-driven solutions.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px", maxWidth: "1200px", width: "100%" }}>

                    <div style={{ flex: "1 1 300px", background: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", transition: "transform 0.3s ease", cursor: "default" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                        <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🎯</div>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", fontWeight: "600" }}>Our Mission</h3>
                        <p style={{ color: "#9ca3af", lineHeight: "1.6" }}>To bridge the gap between complex logistical operations and intuitive digital solutions, empowering businesses to scale gracefully.</p>
                    </div>

                    <div style={{ flex: "1 1 300px", background: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", transition: "transform 0.3s ease", cursor: "default" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                        <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🛡️</div>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", fontWeight: "600" }}>Our Vision</h3>
                        <p style={{ color: "#9ca3af", lineHeight: "1.6" }}>To become the global standard for modern warehouse infrastructure, setting precedence in reliability, security, and speed.</p>
                    </div>

                    <div style={{ flex: "1 1 300px", background: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", transition: "transform 0.3s ease", cursor: "default" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                        <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⚡</div>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", fontWeight: "600" }}>Our Technology</h3>
                        <p style={{ color: "#9ca3af", lineHeight: "1.6" }}>Built heavily upon a strict stack of MERN. We maximize responsive design frameworks, robust APIs, and cloud databases for flawless continuity.</p>
                    </div>

                </div>

                <div style={{ marginTop: "80px", background: "rgba(245, 158, 11, 0.1)", padding: "40px 60px", borderRadius: "20px", border: "1px solid rgba(245, 158, 11, 0.3)", maxWidth: "800px" }}>
                    <h2 style={{ color: "#f59e0b", marginBottom: "15px", fontSize: "2rem" }}>Join the Future of Warehousing</h2>
                    <p style={{ color: "#e5e7eb", marginBottom: "25px", fontSize: "1.1rem" }}>Register your company and migrate your internal logistics natively into Boxly.</p>
                    <button style={{ background: "#f59e0b", color: "black", padding: "12px 30px", border: "none", borderRadius: "50px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.background = "#fbbf24"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#f59e0b"; }} onClick={() => navigate("/")}>
                        Get Started
                    </button>
                </div>

            </section>
        </div>
    );
}

export default About;
