import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const isAdmin = localStorage.getItem("isAdmin");

    // 🚫 Block unauthenticated users or admins
    if (!user || isAdmin === "true") {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>User Dashboard</h1>
      <p>You are logged in as a user.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
