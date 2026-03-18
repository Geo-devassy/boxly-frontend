import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function StockOutward() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "Staff";

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    if (role !== "staff") return;
    fetchProducts();
  }, [role]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= STOCK OUTWARD ================= */
  const handleOutward = async () => {
    if (!selectedProduct || !quantity || Number(quantity) <= 0) {
      alert("Please select product and enter valid quantity");
      return;
    }

    try {
      // 1️⃣ Reduce stock
      await axios.put(
        `http://localhost:5000/api/products/outward/${selectedProduct._id}`,
        { quantity: Number(quantity) }
      );

      // 2️⃣ Save history
      await axios.post("http://localhost:5000/api/stockhistory", {
        type: "Outward",
        productId: selectedProduct._id,
        quantity: Number(quantity),
        staffName: username || "Staff",
        remarks: ""
      });

      alert("Stock outward recorded successfully ✅");

      setSelectedProduct(null);
      setQuantity("");

      fetchProducts();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error reducing stock");
    }
  };

  /* ================= ROLE CHECK ================= */
  if (role !== "staff") {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={wrapper}>
      <div style={card}>
        <h2 style={title}>🔽 Stock Outward</h2>
        <p style={subtitle}>
          Record outgoing stock (Staff only)
        </p>

        <div style={form}>
          <select
            value={selectedProduct?._id || ""}
            onChange={(e) => {
              const product = products.find(
                (p) => p._id === e.target.value
              );
              setSelectedProduct(product);
            }}
            style={input}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.stock} available)
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity dispatched"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={input}
          />

          <button onClick={handleOutward} style={dangerBtn}>
            Reduce Stock
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
  maxWidth: "500px",
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

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  outline: "none",
};

const dangerBtn = {
  background: "linear-gradient(90deg, #ef4444, #b91c1c)",
  color: "#fff",
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.2s ease",
};

const secondaryBtn = {
  background: "#f1f5f9",
  color: "#334155",
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  fontWeight: "500",
  cursor: "pointer",
};

export default StockOutward;