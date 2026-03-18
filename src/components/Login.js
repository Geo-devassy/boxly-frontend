import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Base URL (with fallback for safety)
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://boxly-backend-xr97.onrender.com/api";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/users/login`,
        { username, password }
      );

      // ✅ Save user data
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);

      // ✅ Redirect based on role
      if (response.data.role === "admin") {
        navigate("/admin");
      } else if (response.data.role === "supplier") {
        navigate("/supplier");
      } else {
        navigate("/staff");
      }

    } catch (err) {
      console.error(err);

      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid username or password");
        } else if (err.response.status === 403) {
          setError("Account not verified. Please verify OTP.");
        } else {
          setError(err.response.data?.message || "Login failed");
        }
      } else {
        setError("Server not reachable (check backend or URL)");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      {error && (
        <p style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;