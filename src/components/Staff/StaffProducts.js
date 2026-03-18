import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function StaffProducts() {
  const role = localStorage.getItem("role");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔒 Staff-only access
  if (role !== "staff") {
    return <Navigate to="/" replace />;
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  return (
    <div style={wrapper}>
      <div style={card}>
        <h2 style={title}>📦 Product Stock (View Only)</h2>
        <p style={subtitle}>
          Staff can view product stock levels only
        </p>

        {loading ? (
          <p style={{ marginTop: "20px" }}>Loading products...</p>
        ) : products.length === 0 ? (
          <p style={{ marginTop: "20px" }}>No products available.</p>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr style={theadRow}>
                    <th style={th}>Product ID</th>
                    <th style={th}>Product Name</th>
                    <th style={th}>Category</th>
                    <th style={th}>Current Stock</th>
                    <th style={th}>Minimum Stock</th>
                    <th style={th}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p) => {
                    const lowStock = p.stock < p.minStock;

                    return (
                      <tr
                        key={p._id}
                        style={{
                          ...row,
                          ...(lowStock ? lowStockRow : {}),
                        }}
                      >
                        <td style={td}>{p.productId}</td>
                        <td style={tdBold}>{p.name}</td>
                        <td style={td}>{p.category}</td>
                        <td style={td}>{p.stock}</td>
                        <td style={td}>{p.minStock}</td>
                        <td style={td}>
                          {lowStock ? (
                            <span style={badgeDanger}>Low</span>
                          ) : (
                            <span style={badgeSuccess}>Healthy</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p style={note}>
              ⚠ Products marked "Low" are below minimum stock level
            </p>
          </>
        )}
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

const lowStockRow = {
  background: "#fff7ed",
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

const badgeDanger = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
};

const badgeSuccess = {
  background: "#dcfce7",
  color: "#166534",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
};

const note = {
  marginTop: "15px",
  fontSize: "13px",
  color: "#64748b",
};

export default StaffProducts;