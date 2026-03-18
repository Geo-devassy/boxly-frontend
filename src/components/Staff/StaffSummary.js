import { useEffect, useState } from "react";
import axios from "axios";

function StaffSummary() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    inward: 0,
    outward: 0,
    returns: 0,
    todayInward: 0,
    todayOutward: 0,
    todayReturns: 0,
    todayTransactions: 0,
    yesterdayInward: 0,
    yesterdayOutward: 0,
    yesterdayReturns: 0,
    yesterdayTransactions: 0,
  });

  const [activityView, setActivityView] = useState("Today");

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      // Get products
      const productsRes = await axios.get(
        "http://localhost:5000/api/products"
      );

      const products = productsRes.data;

      // Get history
      const historyRes = await axios.get(
        "http://localhost:5000/api/stockhistory"
      );
      const history = historyRes.data;

      // Get returns
      const returnsRes = await axios.get(
        "http://localhost:5000/api/returnrequests"
      );
      const returns = returnsRes.data;

      // Calculate values
      const totalProducts = products.length;

      const lowStock = products.filter(
        (p) => p.stock <= p.minStock
      ).length;

      const inward = history.filter(
        (h) => h.type === "Inward" || h.type === "INWARD"
      ).length;

      const outward = history.filter(
        (h) => h.type === "Outward" || h.type === "OUTWARD"
      ).length;

      const returnsCount = returns.length;

      // Calculate Today's Activity
      const today = new Date();
      today.setHours(0, 0, 0, 0); // start of today

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1); // start of yesterday

      // Today
      const todayInward = history.filter((h) => {
        const d = new Date(h.date || h.createdAt);
        return (h.type === "Inward" || h.type === "INWARD") && d >= today;
      }).reduce((sum, h) => sum + (h.quantity || 1), 0);

      const todayOutward = history.filter((h) => {
        const d = new Date(h.date || h.createdAt);
        return (h.type === "Outward" || h.type === "OUTWARD") && d >= today;
      }).reduce((sum, h) => sum + (h.quantity || 1), 0);

      const todayReturns = returns.filter((r) => {
        const d = new Date(r.createdAt);
        return d >= today;
      }).reduce((sum, r) => sum + (r.quantity || 1), 0);

      const todayTransactions = history.filter((h) => {
        const d = new Date(h.date || h.createdAt);
        return d >= today;
      }).length + returns.filter((r) => {
        const d = new Date(r.createdAt);
        return d >= today;
      }).length;

      // Yesterday
      const yesterdayInward = history.filter((h) => {
        const d = new Date(h.date || h.createdAt);
        return (h.type === "Inward" || h.type === "INWARD") && d >= yesterday && d < today;
      }).reduce((sum, h) => sum + (h.quantity || 1), 0);

      const yesterdayOutward = history.filter((h) => {
        const d = new Date(h.date || h.createdAt);
        return (h.type === "Outward" || h.type === "OUTWARD") && d >= yesterday && d < today;
      }).reduce((sum, h) => sum + (h.quantity || 1), 0);

      const yesterdayReturns = returns.filter((r) => {
        const d = new Date(r.createdAt);
        return d >= yesterday && d < today;
      }).reduce((sum, r) => sum + (r.quantity || 1), 0);

      const yesterdayTransactions = history.filter((h) => {
        const d = new Date(h.date || h.createdAt);
        return d >= yesterday && d < today;
      }).length + returns.filter((r) => {
        const d = new Date(r.createdAt);
        return d >= yesterday && d < today;
      }).length;

      setStats({
        totalProducts,
        lowStock,
        inward,
        outward,
        returns: returnsCount,
        todayInward,
        todayOutward,
        todayReturns,
        todayTransactions,
        yesterdayInward,
        yesterdayOutward,
        yesterdayReturns,
        yesterdayTransactions,
      });

    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const maxMovement = Math.max(stats.inward, stats.outward, stats.returns, 1);

  return (
    <>
      <div style={grid}>
        <Card title="Total Products" value={stats.totalProducts} />
        <Card title="Low Stock Items" value={stats.lowStock} />
        <Card title="Stock Inward" value={stats.inward} />
        <Card title="Stock Outward" value={stats.outward} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px", marginTop: "25px" }}>

        {/* CHART WIDGET */}
        <div style={chartCardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, fontWeight: "600", fontSize: "1.2rem", color: "#1e293b" }}>Stock Movement Chart 📊</h3>
          </div>

          <div style={barContainer}>
            <div style={barRow}>
              <span style={barLabel}>Inward</span>
              <div style={barBg}>
                <div style={{ ...barFill, width: `${(stats.inward / maxMovement) * 100}%`, background: "#7c3aed" }}></div>
              </div>
            </div>
            <div style={barRow}>
              <span style={barLabel}>Outward</span>
              <div style={barBg}>
                <div style={{ ...barFill, width: `${(stats.outward / maxMovement) * 100}%`, background: "#7c3aed" }}></div>
              </div>
            </div>
            <div style={barRow}>
              <span style={barLabel}>Returns</span>
              <div style={barBg}>
                <div style={{ ...barFill, width: `${(stats.returns / maxMovement) * 100}%`, background: "#7c3aed" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVITY WIDGET */}
        <div style={chartCardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, fontWeight: "600", fontSize: "1.2rem", color: "#1e293b" }}>
              {activityView} Activity
            </h3>
            <select
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                color: "#475569",
                outline: "none",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "13px"
              }}
              value={activityView}
              onChange={(e) => setActivityView(e.target.value)}
            >
              <option value="Today's">Today</option>
              <option value="Yesterday's">Yesterday</option>
            </select>
          </div>

          <div style={{ ...barContainer, gap: "16px", padding: "24px 20px" }}>
            <div style={activityRow}>
              <span style={activityLabel}>Stock Inward</span>
              <span style={activityValue}>{activityView === "Today's" ? stats.todayInward : stats.yesterdayInward} items</span>
            </div>
            <div style={activityRow}>
              <span style={activityLabel}>Stock Outward</span>
              <span style={activityValue}>{activityView === "Today's" ? stats.todayOutward : stats.yesterdayOutward} items</span>
            </div>
            <div style={activityRow}>
              <span style={activityLabel}>Returns</span>
              <span style={activityValue}>{activityView === "Today's" ? stats.todayReturns : stats.yesterdayReturns} items</span>
            </div>
            <div style={{ borderTop: "1px dashed #cbd5e1", margin: "4px 0" }}></div>
            <div style={activityRow}>
              <span style={activityLabelBold}>Transactions</span>
              <span style={activityValueBold}>{activityView === "Today's" ? stats.todayTransactions : stats.yesterdayTransactions}</span>
            </div>
          </div>
        </div>

      </div >
    </>
  );
}

function Card({ title, value }) {
  return (
    <div style={card}>
      <p style={{ opacity: 0.8 }}>{title}</p>
      <h2 style={{ marginTop: "10px" }}>{value}</h2>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
};

const card = {
  background: "linear-gradient(135deg, #7c3aed, #6366f1)",
  color: "#fff",
  padding: "20px",
  borderRadius: "15px",
};

const chartCardStyle = {
  marginTop: "25px",
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
  width: "70px",
  color: "#475569",
  fontSize: "14px",
  fontWeight: "600",
};

const barBg = {
  flex: 1,
  height: "18px",
  display: "flex",
  alignItems: "center",
};

const barFill = {
  height: "100%",
  borderRadius: "2px",
  transition: "width 0.5s ease-out",
};

const activityRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const activityLabel = {
  color: "#475569",
  fontSize: "15px",
  fontWeight: "500",
};

const activityValue = {
  color: "#1e293b",
  fontSize: "15px",
  fontWeight: "600",
};

const activityLabelBold = {
  ...activityLabel,
  color: "#334155",
  fontWeight: "600",
};

const activityValueBold = {
  ...activityValue,
  color: "#7c3aed",
  fontWeight: "700",
  fontSize: "16px",
};

export default StaffSummary;