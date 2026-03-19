import React, { useState, useEffect } from "react";
import API from "../../api";

// Assume we have styles and UI components. Since this is an existing app, I'll use common UI patterns seen in similar apps.
// Alternatively I could use bootstrap if it's there, but I'll write clean custom UI.

const StaffReturnRequests = () => {
    const [returnRequests, setReturnRequests] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        productName: "",
        quantity: "",
        reason: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const staffName = localStorage.getItem("username") || "Staff";

    useEffect(() => {
        fetchProducts();
        fetchReturnRequests();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get("/api/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products", err);
        }
    };

    const fetchReturnRequests = async () => {
        try {
            const res = await API.get("/api/returnrequests");
            // Filter only requests by this staff if necessary, or show all.
            // Assuming staff want to see all or their own. We'll filter for visual simplicity.
            const myReturns = res.data.filter((req) => req.requestedBy === staffName);
            setReturnRequests(myReturns);
        } catch (err) {
            console.error("Error fetching return requests", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await API.post("/api/returnrequests", {
                ...formData,
                requestedBy: staffName,
            });
            setMessage("Return Request Submitted Successfully!");
            setFormData({ productName: "", quantity: "", reason: "" });
            fetchReturnRequests();
        } catch (err) {
            console.error(err);
            setMessage("Failed to submit return request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <h2 className="mb-4" style={{ color: "#343a40", fontWeight: "bold" }}>Return Requests</h2>

            {/* Request Form */}
            <div className="card p-4 mb-4 shadow-sm" style={{ border: "none", borderRadius: "10px" }}>
                <h4 className="mb-3">Submit a New Return Request</h4>
                {message && <div className={`alert ${message.includes("Success") ? "alert-success" : "alert-danger"}`} style={{ padding: "10px", borderRadius: "5px", marginBottom: "15px", backgroundColor: message.includes("Success") ? "#d4edda" : "#f8d7da", color: message.includes("Success") ? "#155724" : "#721c24" }}>{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4 mb-3" style={{ marginBottom: "1rem" }}>
                            <label className="form-label" style={{ fontWeight: "bold" }}>Product Name</label>
                            <select
                                className="form-select"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                required
                                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ced4da" }}
                            >
                                <option value="">Select Product</option>
                                {products.map((p) => (
                                    <option key={p._id} value={p.name}>
                                        {p.name} (Stock: {p.stock})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 mb-3" style={{ marginBottom: "1rem" }}>
                            <label className="form-label" style={{ fontWeight: "bold" }}>Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                min="1"
                                required
                                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ced4da", boxSizing: "border-box" }}
                            />
                        </div>
                        <div className="col-md-4 mb-3" style={{ marginBottom: "1rem" }}>
                            <label className="form-label" style={{ fontWeight: "bold" }}>Reason for Return</label>
                            <input
                                type="text"
                                className="form-control"
                                name="reason"
                                value={formData.reason}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. Damaged, Expired"
                                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ced4da", boxSizing: "border-box" }}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2" disabled={loading} style={{ padding: "10px 20px", backgroundColor: "#007bff", border: "none", color: "white", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                        {loading ? "Submitting..." : "Submit Return"}
                    </button>
                </form>
            </div>

            {/* History Table */}
            <div className="card shadow-sm p-4" style={{ backgroundColor: "white", borderRadius: "10px", border: "none" }}>
                <h4 className="mb-3">My Return Requests</h4>
                <div className="table-responsive" style={{ overflowX: "auto" }}>
                    <table className="table table-striped table-hover mt-3" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead className="table-dark" style={{ backgroundColor: "#343a40", color: "white" }}>
                            <tr>
                                <th style={{ padding: "12px", textAlign: "left" }}>Product</th>
                                <th style={{ padding: "12px", textAlign: "left" }}>Quantity</th>
                                <th style={{ padding: "12px", textAlign: "left" }}>Reason</th>
                                <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
                                <th style={{ padding: "12px", textAlign: "center" }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center" style={{ padding: "20px", textAlign: "center", color: "#6c757d" }}>
                                        No return requests found.
                                    </td>
                                </tr>
                            ) : (
                                returnRequests.map((req) => (
                                    <tr key={req._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                                        <td style={{ padding: "12px" }}>{req.productName}</td>
                                        <td style={{ padding: "12px" }}>{req.quantity}</td>
                                        <td style={{ padding: "12px" }}>{req.reason}</td>
                                        <td className="text-center" style={{ padding: "12px", textAlign: "center" }}>
                                            <span
                                                className={`badge ${req.status === "Approved"
                                                        ? "bg-success"
                                                        : req.status === "Rejected"
                                                            ? "bg-danger"
                                                            : "bg-warning text-dark"
                                                    }`}
                                                style={{
                                                    padding: "5px 10px",
                                                    borderRadius: "20px",
                                                    fontSize: "0.85em",
                                                    backgroundColor: req.status === "Approved" ? "#28a745" : req.status === "Rejected" ? "#dc3545" : "#ffc107",
                                                    color: req.status === "Pending Supplier Approval" ? "#212529" : "white",
                                                }}
                                            >
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="text-center" style={{ padding: "12px", textAlign: "center" }}>
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffReturnRequests;
