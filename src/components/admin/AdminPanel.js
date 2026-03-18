import { Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import Orders from "./Orders";
import Products from "./Products";
import StockHistory from "./AdminStockHistory";
import LowStockAlerts from "./LowStockAlerts";
import UserManagement from "./UserManagement";

function AdminPanel() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === `/admin${path}`;
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#f3f4f6"
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0
        }}
      >
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ margin: 0, color: "#4f46e5" }}>Boxly</h2>
          <small style={{ color: "#6b7280" }}>
            Warehouse Admin
          </small>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}>
          <Link style={getLinkStyle(isActive(""))} to="/admin">
            Dashboard
          </Link>

          <Link style={getLinkStyle(isActive("/products"))} to="/admin/products">
            Products
          </Link>

          <Link style={getLinkStyle(isActive("/orders"))} to="/admin/orders">
            Orders
          </Link>

          <Link style={getLinkStyle(isActive("/history"))} to="/admin/history">
            Stock History
          </Link>

          <Link style={getLinkStyle(isActive("/low-stock"))} to="/admin/low-stock">
            Low Stock
          </Link>

          <Link style={getLinkStyle(isActive("/users"))} to="/admin/users">
            Users
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "12px",
            cursor: "pointer",
            borderRadius: "8px",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </div>

      {/* CONTENT AREA */}
      <div
        style={{
          marginLeft: "260px",
          flex: 1,
          padding: "40px",
          overflowY: "auto",
          minHeight: "100vh"
        }}
      >
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="history" element={<StockHistory />} />
          <Route path="low-stock" element={<LowStockAlerts />} />
          <Route path="users" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
}

const getLinkStyle = (active) => ({
  color: active ? "#ffffff" : "#374151",
  textDecoration: "none",
  padding: "12px 15px",
  borderRadius: "8px",
  background: active ? "#4f46e5" : "transparent",
  fontWeight: active ? "600" : "500",
  transition: "all 0.2s ease"
});

export default AdminPanel;
