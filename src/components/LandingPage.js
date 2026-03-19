import "../App.css";
import bgImage from "../assets/bg-warehouse.jpg";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // ================= LOGIN FUNCTION =================
  const handleLogin = async (e) => {
  if (e) e.preventDefault();

  if (!username || !password) {
    setError("Please enter username and password");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const API_URL =
      process.env.REACT_APP_API_URL ||
      "https://boxly-backend-xr97.onrender.com/api";

    console.log("API URL:", API_URL); // DEBUG

    const response = await axios.post(
      `${API_URL}/users/login`,
      { username, password }
    );

    // ✅ FIXED HERE
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("role", response.data.role);

    setUsername("");
    setPassword("");
    setShowLogin(false);

    // Redirect
    if (response.data.role === "admin") {
      navigate("/admin");
    } else if (response.data.role === "staff") {
      navigate("/staff");
    } else if (response.data.role === "supplier") {
      navigate("/supplier");
    }

  } catch (err) {
    console.log("ERROR:", err);

    if (err.response) {
      if (err.response.status === 401) {
        setError("Invalid username or password");
      } else if (err.response.status === 403) {
        setError("Account not verified.");
      } else {
        setError(err.response.data?.message || "Login failed");
      }
    } else {
      setError("Server not reachable");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="cinematic-bg"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* ===== NAVBAR ===== */}
      <header className="top-nav">
        <div className="logo">Boxly</div>

        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>

        <div className="nav-auth">
          <button className="auth-btn" onClick={() => setShowLogin(true)}>
            Login
          </button>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="cinematic-hero">
        <p className={`hero-eyebrow ${animate ? "fade-in" : ""}`}>
          WAREHOUSE · LOGISTICS · INVENTORY
        </p>

        <h1 className={`hero-title ${animate ? "boxly-animate" : ""}`}>
          BOXLY
        </h1>

        <button
          className={`hero-cta ${animate ? "cta-show" : ""}`}
          onClick={() => setShowLogin(true)}
        >
          LEARN MORE
        </button>
      </section>

      {/* ===== LOGIN MODAL ===== */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div
            className="login-card-new"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="login-header-new">
              <h3>Welcome Back!</h3>
              <button
                className="close-btn-new"
                onClick={() => setShowLogin(false)}
              >
                ✕
              </button>
            </div>

            <div className="login-body-new">
              {error && (
                <p style={{ color: "#ff4d4f", marginBottom: "15px", fontSize: "14px" }}>
                  {error}
                </p>
              )}

              <form onSubmit={handleLogin}>
                <div className="input-group-new">
                  <label>Username</label>
                  <div className="input-wrapper-new">
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="input-group-new">
                  <label>Password</label>
                  <div className="input-wrapper-new">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      className="input-icon"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </span>
                  </div>
                </div>

                <button
                  className="login-btn-new"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;