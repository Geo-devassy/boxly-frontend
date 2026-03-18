import { useEffect, useState } from "react";
import axios from "axios";

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicleNumber: "",
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const res = await axios.get("http://localhost:5000/api/drivers");
    setDrivers(res.data);
  };

  const handleAdd = async () => {
    await axios.post("http://localhost:5000/api/drivers/add", form);
    setForm({ name: "", phone: "", vehicleNumber: "" });
    fetchDrivers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/drivers/${id}`);
    fetchDrivers();
  };

  return (
    <div className="drivers-container">
      <h2 className="page-title">🚚 Drivers Management</h2>

      {/* Add Driver Card */}
      <div className="card">
        <div className="form-row">
          <input
            placeholder="Driver Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            placeholder="Vehicle Number"
            value={form.vehicleNumber}
            onChange={(e) =>
              setForm({ ...form, vehicleNumber: e.target.value })
            }
          />
          <button className="primary-btn" onClick={handleAdd}>
            Add Driver
          </button>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="card">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td>{driver.name}</td>
                <td>{driver.phone}</td>
                <td>{driver.vehicleNumber}</td>
                <td>
                  <span className={`status ${driver.status}`}>
                    {driver.status}
                  </span>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(driver._id)}
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


export default Drivers;