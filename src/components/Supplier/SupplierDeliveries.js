import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function SupplierDeliveries() {
  const role = localStorage.getItem("role");

  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (role === "supplier") {
      fetchDeliveries();

      // ✅ Auto refresh deliveries every 5 seconds
      const interval = setInterval(() => {
        fetchDeliveries();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [role]);

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/supplier/deliveries"
      );
      setDeliveries(res.data);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  /* FILTER FUNCTION */
  const applyFilters = useCallback(() => {
    let updated = [...deliveries];

    if (statusFilter !== "All") {
      updated = updated.filter((d) => d.status === statusFilter);
    }

    if (searchTerm.trim() !== "") {
      updated = updated.filter(
        (d) =>
          (d.orderId || "")
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (d.productName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDeliveries(updated);
  }, [deliveries, statusFilter, searchTerm]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  if (!role) return <p style={{ padding: "30px" }}>Checking access...</p>;
  if (role !== "supplier") return <Navigate to="/" replace />;
  if (loading) return <p style={{ padding: "30px" }}>Loading deliveries...</p>;

  return (
    <div>
      <h2>Deliveries</h2>
      <p>Delivery status for shipped orders</p>

      {/* FILTER + SEARCH */}
      <div style={filterContainer}>
        <input
          type="text"
          placeholder="Search by Order ID or Product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInput}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="All">All</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Delivery ID</th>
            <th>Order ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Delivery Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredDeliveries.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No deliveries found
              </td>
            </tr>
          ) : (
            filteredDeliveries.map((delivery) => (
              <tr key={delivery._id}>
                <td>{delivery._id.slice(-6).toUpperCase()}</td>
                <td>{delivery.orderId}</td>
                <td>{delivery.productName}</td>
                <td>{delivery.quantity}</td>
                <td>
                  {delivery.deliveryDate
                    ? new Date(delivery.deliveryDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <span
                    style={{
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background:
                        delivery.status === "Delivered"
                          ? "#e8f5e9"
                          : "#fff3e0",
                      color:
                        delivery.status === "Delivered"
                          ? "#2e7d32"
                          : "#f57c00",
                    }}
                  >
                    {delivery.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* Styles */

const filterContainer = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
  gap: "15px",
};

const searchInput = {
  flex: 1,
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const selectStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

export default SupplierDeliveries;