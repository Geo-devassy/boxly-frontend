import { NavLink, Navigate, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function SupplierDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    setMounted(true);

    // Live clock
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🔐 Role Protection
  if (!user || role !== "supplier") {
    return <Navigate to="/" replace />;
  }

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div style={container}>
        {/* ================= SIDEBAR ================= */}
        <aside style={sidebar}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={logo}>Boxly</h2>
            </div>
            <p style={roleTag}>Supplier</p>

            <nav style={nav}>
              <SidebarBtn
                label="Summary"
                icon="📊"
                active={location.pathname === "/supplier"}
                onClick={() => navigate("/supplier")}
              />

              <SidebarBtn
                label="Orders"
                icon="📦"
                active={location.pathname.includes("orders")}
                onClick={() => navigate("/supplier/orders")}
              />

              <SidebarBtn
                label="Deliveries"
                icon="🚚"
                active={location.pathname.includes("deliveries")}
                onClick={() => navigate("/supplier/deliveries")}
              />

              <SidebarBtn
                label="Stock Requests"
                icon="📥"
                active={location.pathname.includes("stock-requests")}
                onClick={() => navigate("/supplier/stock-requests")}
              />

              <SidebarBtn
                label="Drivers"
                icon="🚗"
                active={location.pathname.includes("drivers")}
                onClick={() => navigate("/supplier/drivers")}
              />

              <SidebarBtn
                label="Assignments"
                icon="🗂️"
                active={location.pathname.includes("assignments")}
                onClick={() => navigate("/supplier/assignments")}
              />

              <SidebarBtn
                label="Return Requests"
                icon="⏪"
                active={location.pathname.includes("returns")}
                onClick={() => navigate("/supplier/returns")}
              />
            </nav>
          </div>

          <button
            onClick={logout}
            style={logoutBtn}
            onMouseEnter={(e) =>
              (e.target.style.background = "#dc2626")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "#ef4444")
            }
          >
            Logout
          </button>
        </aside>

        {/* ================= MAIN ================= */}
        <main
          style={{
            ...main,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.4s ease",
          }}
        >
          <header style={header}>
            <div>
              <h2 style={welcomeText}>
                Welome back, {user?.username || user?.name || "Supplier"} 👋
              </h2>
              <p style={subText}>
                Manage orders, deliveries, and supply chain operations.
              </p>
            </div>

            <div>
              <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>{time}</span>
            </div>
          </header>

          {/* 🔥 Nested Route Content */}
          <div style={{ marginTop: "20px" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function SidebarBtn({ label, icon, active, onClick }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...sidebarBtn,
        ...(active ? sidebarBtnActive : {}),
        ...(hover && !active
          ? { background: "rgba(255,255,255,0.1)", color: "#fff" }
          : {}),
      }}
    >
      <span style={{ marginRight: "10px", fontSize: "16px" }}>{icon}</span>
      {label}
    </button>
  );
}

/* ================= STYLES ================= */

const container = {
  display: "flex",
  height: "100vh",
  width: "100%",
  background: "#f8fafc",
  fontFamily: "Inter, sans-serif",
};

/* ================= SIDEBAR ================= */

const sidebar = {
  width: "260px",
  background: "#115e59",
  color: "#fff",
  padding: "30px 20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
};

const logo = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "700",
  letterSpacing: "0.5px",
};

const roleTag = {
  background: "rgba(255,255,255,0.15)",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  display: "inline-block",
  marginTop: "8px",
  marginBottom: "30px",
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const sidebarBtn = {
  background: "transparent",
  border: "none",
  color: "#ccfbf1",
  padding: "12px 15px",
  borderRadius: "12px",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s ease",
};

const sidebarBtnActive = {
  background: "rgba(255,255,255,0.2)",
  color: "#ffffff",
  fontWeight: "600",
};

const logoutBtn = {
  background: "#ef4444",
  border: "none",
  color: "#fff",
  padding: "12px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.2s ease",
};

/* ================= MAIN ================= */

const main = {
  flex: 1,
  padding: "40px",
  background: "#f1f5f9",
  overflowY: "auto",
};

const header = {
  marginBottom: "25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const welcomeText = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "600",
};

const subText = {
  color: "#64748b",
  marginTop: "6px",
};

export default SupplierDashboard;