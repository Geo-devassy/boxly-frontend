import { Navigate, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import SessionTimeout from "../SessionTimeout";

function StaffDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔐 Role Protection
  if (!user || role !== "staff") {
    return <Navigate to="/" replace />;
  }

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <SessionTimeout timeout={10 * 60 * 1000} />

      <div style={container}>
        {/* ================= SIDEBAR ================= */}
        <aside style={sidebar}>
          <div>
            <h2 style={logo}>Boxly</h2>
            <p style={roleTag}>Staff</p>

            <nav style={nav}>
              <SidebarBtn
                label="Summary"
                active={location.pathname.includes("summary")}
                onClick={() => navigate("/staff/summary")}
              />

              <SidebarBtn
                label="Products"
                active={location.pathname.includes("products")}
                onClick={() => navigate("/staff/products")}
              />

              <SidebarBtn
                label="Stock Inward"
                active={location.pathname.includes("inward")}
                onClick={() => navigate("/staff/inward")}
              />

              <SidebarBtn
                label="Stock Outward"
                active={location.pathname.includes("outward")}
                onClick={() => navigate("/staff/outward")}
              />

              <SidebarBtn
                label="History"
                active={location.pathname.includes("history")}
                onClick={() => navigate("/staff/history")}
              />

              <SidebarBtn
                label="Returns"
                active={location.pathname.includes("returns")}
                onClick={() => navigate("/staff/returns")}
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
                Hello {user?.username || user?.name || "Staff"} 👋
              </h2>
              <p style={subText}>
                Manage stock movements and monitor inventory levels.
              </p>
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

function SidebarBtn({ label, active, onClick }) {
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
  width: "250px",
  background: "linear-gradient(180deg, #6d28d9, #4c1d95)",
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
  color: "#ddd6fe",
  padding: "12px 15px",
  borderRadius: "12px",
  textAlign: "left",
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

export default StaffDashboard;