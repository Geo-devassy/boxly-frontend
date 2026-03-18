import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./StockHistory.css";

function StockHistory() {
  const [history, setHistory] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") return;

    axios
      .get("http://localhost:5000/api/stockhistory")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  }, [role]);

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const filteredHistory = history.filter((h) => {
    const matchesType =
      filterType === "ALL" ||
      (h.type || "").toLowerCase() === filterType.toLowerCase();

    let productValue = "";
    if (typeof h.productId === "string") {
      productValue = h.productId;
    } else if (h.productId && typeof h.productId === "object") {
      productValue = h.productId.productId || "";
    }

    const matchesSearch = productValue
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="history-container">
      <h2 className="page-title">Stock History (Admin)</h2>
      <p className="subtitle">
        Complete inward & outward audit log
      </p>

      {/* ===== FILTER BAR ===== */}
      <div className="filter-bar">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="Inward">Inward</option>
          <option value="Outward">Outward</option>
        </select>

        <input
          type="text"
          placeholder="Search by Product ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Staff</th>
              <th>Remarks</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">
                  No records found
                </td>
              </tr>
            ) : (
              filteredHistory.map((h) => {
                const productDisplay =
                  typeof h.productId === "string"
                    ? h.productId
                    : `${h.productId?.productId || ""} (${h.productId?.name || ""})`;

                return (
                  <tr key={h._id}>
                    <td>
                      <span
                        className={`badge ${
                          h.type?.toLowerCase()
                        }`}
                      >
                        {h.type}
                      </span>
                    </td>

                    <td>{productDisplay}</td>
                    <td>{h.quantity}</td>
                    <td>{h.staffName || "-"}</td>
                    <td>{h.remarks || "-"}</td>
                    <td>
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
  );
}

export default StockHistory;