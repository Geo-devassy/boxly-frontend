import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../../api";
import "./LowStock.css";

function LowStockAlerts() {
  const [products, setProducts] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") return;

    const fetchProducts = async () => {
      try {
        const res = await API.get("/api/products");
        const reqRes = await API.get("/api/supplier/stock-requests");

        const formatted = res.data.map((p) => ({
          ...p,
          stock: Number(p.stock) || 0,
          minStock: Number(p.minStock) || 0,
        }));

        setProducts(formatted);
        setPendingRequests(reqRes.data.filter(r => r.status === "Pending"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [role]);

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const lowStockItems = products.filter(
    (p) => p.minStock > 0 && p.stock <= p.minStock
  );

  const handleRequestStock = async (product) => {
    setRequestingId(product._id);
    try {
      await API.post("/api/supplier/stock-requests", {
        productName: product.name,
        quantity: product.minStock * 2 || 50,
        requestedBy: "Admin",
      });

      // Refresh pending requests
      const reqRes = await API.get("/api/supplier/stock-requests");
      setPendingRequests(reqRes.data.filter(r => r.status === "Pending"));
      alert("Stock request submitted successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit stock request");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="lowstock-container">
      <h2 className="page-title">Low Stock Alerts</h2>
      <p className="subtitle">
        Products that need immediate restocking
      </p>

      {loading ? (
        <p>Loading products...</p>
      ) : lowStockItems.length > 0 ? (
        <>
          <div className="alert-summary">
            ⚠ {lowStockItems.length} product(s) require restocking
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Current Stock</th>
                  <th>Min Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((p) => {
                  const isPending = pendingRequests.some(r => r.productName === p.name);
                  return (
                    <tr key={p._id}>
                      <td>{p.productId}</td>
                      <td>{p.name}</td>
                      <td>{p.stock}</td>
                      <td>{p.minStock}</td>
                      <td>
                        <span className="low-badge">
                          Low Stock
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleRequestStock(p)}
                          disabled={isPending || requestingId === p._id}
                          style={{
                            padding: "5px 10px",
                            background: isPending ? "#ccc" : "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: isPending ? "not-allowed" : "pointer"
                          }}
                        >
                          {isPending ? "Requested" : requestingId === p._id ? "Sending..." : "Request Stock"}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="success-box">
          🟢 All products are sufficiently stocked
        </div>
      )}
    </div>
  );
}

export default LowStockAlerts;