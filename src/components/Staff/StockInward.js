import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function StockInward() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "Staff";

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    if (role === "staff") {
      fetchProducts();
    }
  }, [role]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  /* ================= STOCK INWARD ================= */
  const handleInward = async () => {
    if (!selectedProductId) {
      alert("Please select a product");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("Please enter valid quantity");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/products/inward/${selectedProductId}`,
        { quantity: Number(quantity) }
      );

      await axios.post("http://localhost:5000/api/stockhistory", {
        type: "Inward",
        productId: selectedProductId,
        quantity: Number(quantity),
        staffName: username,
        remarks: remarks || ""
      });

      alert("Stock inward recorded successfully ✅");

      setSelectedProductId("");
      setQuantity("");
      setRemarks("");

      fetchProducts();

    } catch (err) {
      console.error("Stock inward error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error updating stock ❌");
    }
  };

  /* ================= ROLE PROTECTION ================= */
  if (role !== "staff") {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={wrapper}>
      <div style={card}>
        <h2 style={title}>🔼 Stock Inward</h2>
        <p style={subtitle}>
          Record incoming stock (Staff only)
        </p>

        <div style={form}>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            style={input}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.productId})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity received"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={input}
          />

          <textarea
            placeholder="Enter notes (optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            style={textarea}
          />

          <button
            onClick={handleInward}
            style={primaryBtn}
          >
            Add Stock
          </button>

          <button
            onClick={() => navigate("/staff/summary")}
            style={secondaryBtn}
          >
            Back
          </button>
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
  maxWidth: "500px"
};

const title = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "600"
};

const subtitle = {
  color: "#64748b",
  marginTop: "6px",
  marginBottom: "25px"
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "14px"
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  outline: "none"
};

const textarea = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  minHeight: "80px",
  resize: "none",
  outline: "none"
};

const primaryBtn = {
  background: "linear-gradient(90deg, #7c3aed, #5b21b6)",
  color: "#fff",
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.2s ease"
};

const secondaryBtn = {
  background: "#f1f5f9",
  color: "#334155",
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  fontWeight: "500",
  cursor: "pointer"
};

export default StockInward;