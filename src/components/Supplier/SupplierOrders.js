import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../../api";

function SupplierOrders() {
  const role = localStorage.getItem("role");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch Orders
  useEffect(() => {
    if (role === "supplier") {
      fetchOrders();

      // Auto refresh every 5 seconds (for assignment updates)
      const interval = setInterval(() => {
        fetchOrders();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [role]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/api/supplier/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Manual Delivered Button
  const markDelivered = async (id) => {
    try {
      await API.put(
        `/api/supplier/orders/${id}`,
        { status: "Delivered" }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "Delivered" } : order
        )
      );
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  if (!role) {
    return <p style={{ padding: "30px" }}>Checking access...</p>;
  }

  if (role !== "supplier") {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading orders...</p>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Orders</h2>
      <p>Orders received from warehouse</p>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                <td>
                  <span
                    style={{
                      color:
                        order.status === "Delivered"
                          ? "#2e7d32"
                          : "#f57c00",
                      fontWeight: 600,
                    }}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  {order.status === "Pending" ? (
                    <button
                      onClick={() => markDelivered(order._id)}
                      style={deliverBtn}
                    >
                      Mark Delivered
                    </button>
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
  borderRadius: "8px",
  overflow: "hidden",
};

const deliverBtn = {
  padding: "6px 12px",
  background: "#2e7d32",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default SupplierOrders;