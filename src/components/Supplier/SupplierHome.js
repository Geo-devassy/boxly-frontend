import React, { useState, useEffect } from "react";
import API from "../../api";

function SupplierHome() {
  const [stats, setStats] = useState({
    products: 5, // Keep static for now or fetch later
    pendingOrders: 3,
    deliveredOrders: 12,
    pendingDeliveries: 0,
    deliveryStatus: {
      assigned: 0,
      in_transit: 0,
      delivered: 0,
      returned: 0
    }
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await API.get("/api/assignments");
      // Count assignments that are assigned or in_transit, filtering for those related to the supplier where possible
      const pendingDeliveriesCount = res.data.filter(
        (a) => a.status === "assigned" || a.status === "in_transit"
      ).length;

      const assigned = res.data.filter((a) => a.status === "assigned").length;
      const inTransit = res.data.filter((a) => a.status === "in_transit").length;
      const delivered = res.data.filter((a) => a.status === "delivered").length;
      const returned = res.data.filter((a) => a.status === "returned").length;

      setStats((prev) => ({
        ...prev,
        pendingDeliveries: pendingDeliveriesCount,
        deliveryStatus: { assigned, in_transit: inTransit, delivered, returned }
      }));
    } catch (err) {
      console.error("Error fetching assignments for summary", err);
    }
  };

  return (
    <>
      <h1>Supplier Dashboard</h1>

      <div style={cardGrid}>
        <div style={cardStyle}>
          <h3>Total Products Supplied</h3>
          <p style={countStyle}>{stats.products}</p>
        </div>

        <div style={cardStyle}>
          <h3>Pending Orders</h3>
          <p style={countStyle}>{stats.pendingOrders}</p>
        </div>

        <div style={cardStyle}>
          <h3>Delivered Orders</h3>
          <p style={countStyle}>{stats.deliveredOrders}</p>
        </div>

        <div style={cardStyle}>
          <h3 style={{ color: "#0f766e" }}>Pending Deliveries</h3>
          <p style={{ ...countStyle, color: "#0f766e" }}>{stats.pendingDeliveries}</p>
        </div>
      </div>

      <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
        {/* CHART WIDGET */}
        <div style={chartCardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, fontWeight: "600", fontSize: "1.2rem", color: "#1e293b" }}>Delivery Status Chart 🚚</h3>
          </div>

          <div style={barContainer}>
            <div style={barRow}>
              <span style={barLabel}>Assigned</span>
              <div style={barBg}>
                <div style={{ ...barFill, width: `${(stats.deliveryStatus.assigned / Math.max(stats.deliveryStatus.assigned, stats.deliveryStatus.in_transit, stats.deliveryStatus.delivered, stats.deliveryStatus.returned, 1)) * 100}%`, background: "#0f766e" }}></div>
              </div>
              <span style={barValue}>{stats.deliveryStatus.assigned}</span>
            </div>
            <div style={barRow}>
              <span style={barLabel}>In Transit</span>
              <div style={barBg}>
                <div style={{ ...barFill, width: `${(stats.deliveryStatus.in_transit / Math.max(stats.deliveryStatus.assigned, stats.deliveryStatus.in_transit, stats.deliveryStatus.delivered, stats.deliveryStatus.returned, 1)) * 100}%`, background: "#0f766e" }}></div>
              </div>
              <span style={barValue}>{stats.deliveryStatus.in_transit}</span>
            </div>
            <div style={barRow}>
              <span style={barLabel}>Delivered</span>
              <div style={barBg}>
                <div style={{ ...barFill, width: `${(stats.deliveryStatus.delivered / Math.max(stats.deliveryStatus.assigned, stats.deliveryStatus.in_transit, stats.deliveryStatus.delivered, stats.deliveryStatus.returned, 1)) * 100}%`, background: "#0f766e" }}></div>
              </div>
              <span style={barValue}>{stats.deliveryStatus.delivered}</span>
            </div>
            <div style={barRow}>
              <span style={barLabel}>Returned</span>
              <div style={barBg}>
                <div style={{ ...barFill, width: `${(stats.deliveryStatus.returned / Math.max(stats.deliveryStatus.assigned, stats.deliveryStatus.in_transit, stats.deliveryStatus.delivered, stats.deliveryStatus.returned, 1)) * 100}%`, background: "#0f766e" }}></div>
              </div>
              <span style={barValue}>{stats.deliveryStatus.returned}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "25px",
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const countStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  marginTop: "10px",
};

const chartCardStyle = {
  background: "#ffffff",
  color: "#334155",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const barContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  background: "#f8fafc",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
};

const barRow = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const barLabel = {
  width: "80px",
  color: "#475569",
  fontSize: "14px",
  fontWeight: "600",
};

const barBg = {
  flex: 1,
  height: "18px",
  display: "flex",
  alignItems: "center",
  background: "#e2e8f0",
  borderRadius: "2px",
};

const barFill = {
  height: "100%",
  borderRadius: "2px",
  transition: "width 0.5s ease-out",
};

const barValue = {
  width: "30px",
  textAlign: "right",
  color: "#1e293b",
  fontSize: "14px",
  fontWeight: "bold",
};

export default SupplierHome;
