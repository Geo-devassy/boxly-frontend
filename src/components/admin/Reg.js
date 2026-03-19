import { useState } from "react";
import API from "../../api";
import "./Reg.css";

function Reg() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await API.post(
        "/api/users/add",
        form
      );

      setMessage("OTP sent to user's email.");
      setShowOTP(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Enter OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await API.post(
        "/api/users/verify-otp",
        { email: form.email, otp }
      );

      setMessage("Account verified successfully!");
      setShowOTP(false);

      setForm({
        username: "",
        email: "",
        password: "",
        role: "staff",
      });
      setOtp("");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await API.post(
        "/api/users/resend-otp",
        { email: form.email }
      );

      setMessage("New OTP sent.");
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-container">
      <div className="reg-card">
        <h2>User Registration</h2>

        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}

        {!showOTP ? (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="supplier">Supplier</option>
            </select>

            <button
              className="primary-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Creating..." : "Add User"}
            </button>
          </>
        ) : (
          <>
            <h4>Verify OTP</h4>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="primary-btn"
              onClick={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              className="secondary-btn"
              onClick={handleResendOTP}
              disabled={loading}
            >
              Resend OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Reg;