import { useEffect, useState } from "react";
import API from "../../api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import SessionTimeout from "../SessionTimeout";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productRes = await API.get("/api/products");
      const orderRes = await API.get("/api/orders");

      setProducts(productRes.data);
      setOrders(orderRes.data);

      const low = productRes.data.filter(
        (p) => p.stock <= p.minStock
      );
      setLowStock(low);
    } catch (err) {
      console.error(err);
    }
  };

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueByMonth = Array(12).fill(0);
  const ordersCountByMonth = Array(12).fill(0);

  orders.forEach((o) => {
    if (o.createdAt) {
      const date = new Date(o.createdAt);
      if (!isNaN(date)) {
        revenueByMonth[date.getMonth()] += Number(o.total || 0);
        ordersCountByMonth[date.getMonth()] += 1;
      }
    }
  });

  const monthlyData = monthNames.map((month, index) => ({
    month,
    orders: ordersCountByMonth[index],
  }));

  const salesData = monthNames.map((month, index) => ({
    month,
    sales: revenueByMonth[index],
  }));

  return (
    <>
      <SessionTimeout timeout={10 * 60 * 1000} />

      <div className="admin-container">
        <h2 className="welcome">
          Welcome back, {user?.username || "Admin"} 👋
        </h2>

        {/* ===== STAT CARDS ===== */}
        <div className="card-grid">
          <Card title="Total Products" value={totalProducts} />
          <Card title="Total Orders" value={totalOrders} />
          <div className="stat-card">
            <p>Total Revenue</p>
            <h2>₹ {totalSales}</h2>
            <select
              style={{
                marginTop: "12px",
                padding: "6px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                color: "#374151",
                outline: "none",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              <option value="">Monthly Revenue Breakdown</option>
              {monthNames.map((month, index) => (
                <option key={index} value={month}>
                  {month} - ₹ {revenueByMonth[index] || 0}
                </option>
              ))}
            </select>
          </div>
          <Card title="Low Stock Items" value={lowStock.length} />
        </div>

        {/* ===== CHARTS ===== */}
        <div className="chart-grid">
          <div className="chart-card">
            <h4>Sales Overview</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>Monthly Orders</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== LOW STOCK ALERT ===== */}
        {lowStock.length > 0 && (
          <div className="alert-box">
            ⚠ {lowStock.length} items are running low on stock!
          </div>
        )}

        {/* ===== RECENT ORDERS ===== */}
        <div className="table-card">
          <h4>Recent Orders</h4>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o._id}>
                  <td>{o.orderId}</td>
                  <td>{o.customer}</td>
                  <td>₹ {o.total}</td>
                  <td>
                    <span className="status">{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ===== CARD COMPONENT ===== */
function Card({ title, value }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

export default AdminDashboard;