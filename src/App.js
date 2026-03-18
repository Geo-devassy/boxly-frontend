import "./App.css";
import { Routes, Route } from "react-router-dom";

/* ADMIN */
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import Products from "./components/admin/Products";
import Orders from "./components/admin/Orders";
import AdminStockHistory from "./components/admin/AdminStockHistory";
import LowStockAlerts from "./components/admin/LowStockAlerts";
import UserManagement from "./components/admin/UserManagement";
import Reg from "./components/admin/Reg";
import AdminReport from "./components/admin/AdminReport";


/* STAFF */
import StaffDashboard from "./components/Staff/StaffDashboard";
import StaffProducts from "./components/Staff/StaffProducts";
import StockInward from "./components/Staff/StockInward";
import StockOutward from "./components/Staff/StockOutward";
import StaffStockHistory from "./components/Staff/StaffStockHistory";
import StaffSummary from "./components/Staff/StaffSummary";
import StaffReturnRequests from "./components/Staff/StaffReturnRequests";

/* SUPPLIER */
import SupplierDashboard from "./components/Supplier/SupplierDashboard";
import SupplierHome from "./components/Supplier/SupplierHome";
import SupplierOrders from "./components/Supplier/SupplierOrders";
import SupplierDeliveries from "./components/Supplier/SupplierDeliveries";
import SupplierStockRequests from "./components/Supplier/SupplierStockRequests";
import SupplierDrivers from "./components/Supplier/Drivers";
import Assignments from "./components/Supplier/Assignments";
import SupplierReturnRequests from "./components/Supplier/SupplierReturnRequests";

/* LANDING */
import LandingPage from "./components/LandingPage";
import About from "./components/About";

function App() {
  return (
    <Routes>

      {/* LANDING */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="history" element={<AdminStockHistory />} />
        <Route path="low-stock" element={<LowStockAlerts />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="Reg" element={<Reg />} />
        <Route path="Report" element={<AdminReport />} />
      </Route>

      {/* STAFF */}
      <Route path="/staff" element={<StaffDashboard />}>
        <Route index element={<StaffSummary />} />
        <Route path="products" element={<StaffProducts />} />
        <Route path="inward" element={<StockInward />} />
        <Route path="outward" element={<StockOutward />} />
        <Route path="history" element={<StaffStockHistory />} />
        <Route path="summary" element={<StaffSummary />} />
        <Route path="returns" element={<StaffReturnRequests />} />
      </Route>

      {/* SUPPLIER */}
      <Route path="/supplier" element={<SupplierDashboard />}>
        <Route index element={<SupplierHome />} />
        <Route path="orders" element={<SupplierOrders />} />
        <Route path="deliveries" element={<SupplierDeliveries />} />
        <Route path="stock-requests" element={<SupplierStockRequests />} />
        <Route path="drivers" element={<SupplierDrivers />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="returns" element={<SupplierReturnRequests />} />
      </Route>

    </Routes>
  );
}

export default App;