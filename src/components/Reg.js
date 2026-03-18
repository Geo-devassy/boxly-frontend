import { useState } from "react";
import axios from "axios";

function Reg() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      setError("All fields required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await axios.post(
        "http://localhost:5000/api/users/add",
        form
      );

      setShowOTP(true);
      setMessage("OTP sent to email");

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

      await axios.post(
        "http://localhost:5000/api/users/verify-otp",
        {
          email: form.email,
          otp,
        }
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

  return (
    <div style={{ padding: "30px" }}>
      <h2>User Registration</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {!showOTP ? (
        <>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          /><br /><br />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          /><br /><br />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          /><br /><br />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
            <option value="supplier">Supplier</option>
          </select><br /><br />

          <button onClick={handleRegister} disabled={loading}>
            {loading ? "Creating..." : "Add User"}
          </button>
        </>
      ) : (
        <>
          <h4>Enter OTP</h4>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          /><br /><br />

          <button onClick={handleVerifyOTP} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
}

export default Reg;