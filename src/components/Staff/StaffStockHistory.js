import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function StaffStockHistory() {
  const [history, setHistory] = useState([]);
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (role !== "staff") return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/stockhistory"
        );

        const myHistory = res.data.filter(
          (h) => h.staffName === username || h.staffName === "Staff" || !h.staffName
        );

        setHistory(myHistory);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, [role, username]);

  if (role !== "staff") {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={wrapper}>
      <div style={card}>
        <h2 style={title}>📊 My Stock History</h2>
        <p style={subtitle}>
          View all stock movements performed by you
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr style={theadRow}>
                <th style={th}>Type</th>
                <th style={th}>Product</th>
                <th style={th}>Quantity</th>
                <th style={th}>Remarks</th>
                <th style={th}>Date</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" style={emptyCell}>
                    No records found
                  </td>
                </tr>
              ) : (
                history.map((h) => {
                  const productDisplay =
                    typeof h.productId === "string"
                      ? h.productId
                      : `${h.productId?.productId || ""} (${h.productId?.name || ""})`;

                  return (
                    <tr key={h._id} style={row}>
                      <td style={td}>
                        {h.type === "Inward" ? (
                          <span style={badgeInward}>🟢 Inward</span>
                        ) : (
                          <span style={badgeOutward}>🔴 Outward</span>
                        )}
                      </td>

                      <td style={tdBold}>{productDisplay}</td>

                      <td style={td}>{h.quantity}</td>

                      <td style={td}>{h.remarks || "-"}</td>

                      <td style={td}>
                        {new Date(h.date).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const wrapper = {
  padding: "30px 40px",
};

const card = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "30px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const title = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "600",
};

const subtitle = {
  color: "#64748b",
  marginTop: "6px",
  marginBottom: "25px",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const theadRow = {
  background: "#f8fafc",
};

const th = {
  padding: "14px",
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: "#64748b",
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
};

const row = {
  transition: "all 0.2s ease",
};

const td = {
  padding: "14px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: "14px",
};

const tdBold = {
  ...td,
  fontWeight: "600",
};

const emptyCell = {
  padding: "20px",
  textAlign: "center",
  color: "#94a3b8",
};

const badgeInward = {
  background: "#dcfce7",
  color: "#166534",
  padding: "5px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
};

const badgeOutward = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "5px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
};

export default StaffStockHistory;