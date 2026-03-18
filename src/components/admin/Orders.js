import { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    orderId: "",
    productName: "",
    quantity: "",
    customer: "",
    total: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const addOrder = async () => {
    if (!form.orderId || !form.customer) return;

    try {
      await axios.post("http://localhost:5000/api/orders", {
        ...form,
        status: "Pending"
      });

      setForm({
        orderId: "",
        productName: "",
        quantity: "",
        customer: "",
        total: "",
      });

      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.response?.data?.message || err.message);
    }
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    await axios.delete(`http://localhost:5000/api/orders/${id}`);
    fetchOrders();
  };

  // SEARCH FILTER
  const filteredOrders = orders.filter((o) => {
    const orderId = o.orderId ? o.orderId.toString() : "";
    const product = o.productName ? o.productName.toLowerCase() : "";
    const customer = o.customer ? o.customer.toLowerCase() : "";

    return (
      orderId.includes(search) ||
      product.includes(search.toLowerCase()) ||
      customer.includes(search.toLowerCase())
    );
  });
  return (
    <div className="orders-container">

      <h2 className="page-title">Orders</h2>

      {/* SEARCH BAR */}
      <input
        className="search-box"
        placeholder="Search orders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ADD ORDER */}
      <div className="form-card">

        <input
          placeholder="Order ID"
          value={form.orderId}
          onChange={(e) =>
            setForm({ ...form, orderId: e.target.value })
          }
        />

        <input
          placeholder="Product Name"
          value={form.productName}
          onChange={(e) =>
            setForm({ ...form, productName: e.target.value })
          }
        />

        <input
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
        />

        <input
          placeholder="Customer"
          value={form.customer}
          onChange={(e) =>
            setForm({ ...form, customer: e.target.value })
          }
        />

        <input
          placeholder="Total"
          type="number"
          value={form.total}
          onChange={(e) =>
            setForm({ ...form, total: e.target.value })
          }
        />

        <button className="primary-btn" onClick={addOrder}>
          Add Order
        </button>

      </div>

      {/* ORDERS TABLE */}
      <div className="table-card">

        <table>

          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>

            {filteredOrders.map((o) => (
              <tr key={o._id}>

                <td>{o.orderId}</td>
                <td>{o.productName}</td>
                <td>{o.quantity}</td>
                <td>{o.customer}</td>
                <td>₹ {o.total}</td>

                <td>
                  <span className={`status ${o.status?.toLowerCase()}`}>
                    {o.status}
                  </span>
                </td>

                <td>
                  <select
                    className="status-select"
                    value={o.status || "Pending"}
                    onChange={(e) =>
                      updateStatus(o._id, e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteOrder(o._id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Orders;