import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function Assignments() {
  const role = localStorage.getItem("role");

  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    orderId: "",
    driverId: "",
  });

  useEffect(() => {
    if (role === "supplier") {
      fetchAllData();
    }
  }, [role]);

  const fetchAllData = async () => {
    try {
      const [aRes, dRes, oRes] = await Promise.all([
        axios.get("http://localhost:5000/api/assignments"),
        axios.get("http://localhost:5000/api/drivers"),
        axios.get("http://localhost:5000/api/supplier/orders"),
      ]);

      const assignmentsData = aRes.data;
      setAssignments(assignmentsData);
      setDrivers(dRes.data);

      // Filter out already assigned orders
      const assignedOrderIds = new Set(
        assignmentsData
          .filter(a => a.orderId)
          .map(a => a.orderId._id ? a.orderId._id.toString() : a.orderId.toString())
      );

      const availableOrders = oRes.data.filter(
        o => !assignedOrderIds.has(o._id.toString())
      );

      setOrders(availableOrders);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!form.orderId || !form.driverId) {
      alert("Please select both order and driver");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/assignments",
        form
      );

      setForm({ orderId: "", driverId: "" });
      fetchAllData();
    } catch (err) {
      console.error("Assignment failed:", err);
      alert(err.response?.data?.message || "Assignment failed. Please try again.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/assignments/${id}`,
        { status }
      );
      fetchAllData();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (!role) return <p style={{ padding: "30px" }}>Checking access...</p>;
  if (role !== "supplier") return <Navigate to="/" replace />;
  if (loading) return <p style={{ padding: "30px" }}>Loading assignments...</p>;

  return (
    <div className="assignments-container">
      <h2 className="page-title">📦 Assignments</h2>

      {/* Assign Section */}
      <div className="card">
        <div className="form-row">

          {/* Order Dropdown */}
          <select
            value={form.orderId}
            onChange={(e) =>
              setForm({ ...form, orderId: e.target.value })
            }
          >
            <option value="">Select Order</option>
            {orders.map((order) => (
              <option key={order._id} value={order._id}>
                {order.orderId || order._id.slice(-6)}
              </option>
            ))}
          </select>

          {/* Driver Dropdown */}
          <select
            value={form.driverId}
            onChange={(e) =>
              setForm({ ...form, driverId: e.target.value })
            }
          >
            <option value="">Select Driver</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.name}
              </option>
            ))}
          </select>

          <button className="primary-btn" onClick={handleAssign}>
            Assign
          </button>

        </div>
      </div>

      {/* Assignments Table */}
      <div className="card">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No assignments found
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr key={a._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                    {a.type === "Return" ? (
                      <span style={{ color: "#d97706" }}>Return Request</span>
                    ) : (
                      `#${a.orderId?._id?.substring(0, 6) || "N/A"}`
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {a.type === "Return" ? (
                      <>{a.returnRequestId?.productName || "Unknown"} (Qty: {a.returnRequestId?.quantity || 0})</>
                    ) : (
                      <>{a.orderId?.productName || "Unknown"} (Qty: {a.orderId?.quantity || 0})</>
                    )}
                  </td>
                  <td>{a.driverId?.name || "N/A"}</td>
                  <td>
                    <span className={`status ${a.status}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {a.status !== "delivered" && (
                      <>
                        <button
                          className="secondary-btn"
                          onClick={() =>
                            updateStatus(a._id, "in_transit")
                          }
                        >
                          In Transit
                        </button>

                        <button
                          className="success-btn"
                          onClick={() =>
                            updateStatus(a._id, "delivered")
                          }
                        >
                          Delivered
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assignments;