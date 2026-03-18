import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function SupplierStockRequests() {
  const role = localStorage.getItem("role");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === "supplier") {
      fetchRequests();

      // Auto refresh every 5 seconds
      const interval = setInterval(() => {
        fetchRequests();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [role]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/supplier/stock-requests"
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching stock requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/supplier/stock-requests/${id}`,
        { status }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status } : req
        )
      );
    } catch (err) {
      console.error(`Error updating request to ${status}:`, err);
    }
  };

  if (!role) return <p style={{ padding: "30px" }}>Checking access...</p>;
  if (role !== "supplier") return <Navigate to="/" replace />;
  if (loading) return <p style={{ padding: "30px" }}>Loading requests...</p>;

  return (
    <div>
      <h2>Stock Requests</h2>
      <p>Requests received from warehouses</p>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Requested By</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                No requests found
              </td>
            </tr>
          ) : (
            requests.map((req) => (
              <tr key={req._id}>
                <td>{req._id.slice(-6).toUpperCase()}</td>
                <td>{req.productName || "-"}</td>
                <td>{req.quantity || "-"}</td>
                <td>{req.requestedBy || "-"}</td>

                <td>
                  {req.createdAt
                    ? new Date(req.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  <span
                    style={{
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background:
                        req.status === "Approved"
                          ? "#e8f5e9"
                          : req.status === "Rejected"
                            ? "#ffebee"
                            : "#fff3e0",
                      color:
                        req.status === "Approved"
                          ? "#2e7d32"
                          : req.status === "Rejected"
                            ? "#c62828"
                            : "#f57c00",
                    }}
                  >
                    {req.status}
                  </span>
                </td>

                <td>
                  {req.status === "Pending" ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleRequest(req._id, "Approved")}
                        style={approveBtn}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequest(req._id, "Rejected")}
                        style={declineBtn}
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ===== Styles ===== */

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

const approveBtn = {
  padding: "6px 12px",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const declineBtn = {
  padding: "6px 12px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default SupplierStockRequests;