import { Link, Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";

function AdminLayout() {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f3f4f6" }}>
      
      {/* SIDEBAR */}
      <aside style={{
        width: "250px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "25px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        <div>
          <h2 style={{ color: "#3b82f6", margin: 0 }}>Boxly</h2>
          <p style={{ color: "#6b7280", fontSize: "13px" }}>Warehouse Admin</p>

          <nav style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link style={linkStyle(isActive("/admin"))} to="/admin">Dashboard</Link>
            <Link style={linkStyle(isActive("/admin/products"))} to="/admin/products">Products</Link>
            <Link style={linkStyle(isActive("/admin/orders"))} to="/admin/orders">Orders</Link>
            <Link style={linkStyle(isActive("/admin/history"))} to="/admin/history">Stock History</Link>
            <Link style={linkStyle(isActive("/admin/low-stock"))} to="/admin/low-stock">Low Stock</Link>
            <Link style={linkStyle(isActive("/admin/Reg"))} to="/admin/Reg">UserReg</Link>
            <Link style={linkStyle(isActive("/admin/users"))} to="/admin/users">Users</Link>
            <Link style={linkStyle(isActive("/admin/Report"))} to="/admin/Report">Report</Link>
          </nav>
        </div>

        <button onClick={logout} style={{
          background: "#ef4444",
          border: "none",
          color: "#fff",
          padding: "10px",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

const linkStyle = (active) => ({
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: "8px",
  background: active ? "#3b82f6" : "transparent",
  color: active ? "#fff" : "#374151",
  fontWeight: 500
});

export default AdminLayout;
