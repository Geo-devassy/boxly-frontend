import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function Inventory() {
  // ✅ HOOKS FIRST
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role");

  // 🔄 LOAD PRODUCTS
  useEffect(() => {
    if (role !== "admin") return;

    const stored =
      JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
  }, [role]);

  // 🔒 PROTECT ADMIN ROUTE
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 🔍 SEARCH FILTER
  const filteredProducts = products.filter((p) =>
    `${p.id} ${p.name} ${p.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "30px" }}>
      <h2>📦 Inventory Overview</h2>
      <p style={{ color: "#666" }}>
        Complete stock visibility (Admin only)
      </p>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by ID, name or category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

      {/* TABLE */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Min Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr
              key={p.id}
              style={{
                background:
                  p.stock < p.minStock ? "#ffecec" : "white",
              }}
            >
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.stock}</td>
              <td>{p.minStock}</td>
              <td>
                {p.stock < p.minStock ? (
                  <span style={{ color: "red", fontWeight: "600" }}>
                    Low Stock
                  </span>
                ) : (
                  <span style={{ color: "green" }}>
                    OK
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredProducts.length === 0 && (
        <p style={{ marginTop: "20px", color: "#999" }}>
          No products found
        </p>
      )}
    </div>
  );
}

/* STYLES */
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const searchStyle = {
  padding: "8px",
  width: "300px",
  marginTop: "15px",
};

export default Inventory;
