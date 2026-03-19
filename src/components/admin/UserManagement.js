import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../../api";
import "./UserManagement.css";

function UserManagement() {
  const role = localStorage.getItem("role");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "staff",
  });

  const [editingId, setEditingId] = useState(null);
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);

  useEffect(() => {
    if (role !== "admin") return;
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.username || !form.email) {
      alert("All fields required");
      return;
    }

    try {
      if (editingId) {
        await API.put(
          `/api/users/${editingId}`,
          form
        );
        setEditingId(null);
        fetchUsers();
      } else {
        await API.post(
          "/api/users/add",
          {
            ...form,
            password: "123456",
          }
        );
        setShowOtpBox(true);
      }

      setForm({
        username: "",
        email: "",
        role: "staff",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await API.post(
        "/api/users/verify-otp",
        {
          email: form.email,
          otp,
        }
      );
      setShowOtpBox(false);
      setOtp("");
      fetchUsers();
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  const handleEdit = (user) => {
    setForm({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setEditingId(user._id);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await API.delete(`/api/users/${id}`);
    fetchUsers();
  };

  const handleVerifyManually = async (id) => {
    if (!window.confirm("Verify this user manually?")) return;
    try {
      await API.put(`/api/users/${id}`, { isVerified: true });
      fetchUsers();
    } catch (err) {
      alert("Failed to verify user");
    }
  };

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="users-container">
      <h2 className="page-title">User Management</h2>

      {/* ===== FORM CARD ===== */}
      <div className="form-card">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
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

        <button className="primary-btn" onClick={handleSubmit}>
          {editingId ? "Update User" : "Update User"}
        </button>
      </div>

      {/* ===== OTP BOX ===== */}
      {showOtpBox && (
        <div className="otp-card">
          <h4>Verify OTP</h4>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="primary-btn" onClick={handleVerifyOtp}>
            Verify OTP
          </button>
        </div>
      )}

      {/* ===== TABLE CARD ===== */}
      <div className="table-card">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`verify-badge ${u.isVerified ? "yes" : "no"}`}>
                        {u.isVerified ? "Verified" : "Not Verified"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(u)}
                      >
                        Edit
                      </button>
                      {!u.isVerified && (
                        <button
                          className="verify-btn"
                          onClick={() => handleVerifyManually(u._id)}
                          style={{ background: "#10b981", color: "white", marginLeft: "5px" }}
                        >
                          Verify
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
