import React, { useState, useEffect } from "react";
import axios from "axios";

const SupplierReturnRequests = () => {
    const [returnRequests, setReturnRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchReturnRequests();
    }, []);

    const fetchReturnRequests = async () => {
        try {
            // Fetching all return requests
            const res = await axios.get("http://localhost:5000/api/returnrequests");
            setReturnRequests(res.data);
        } catch (err) {
            console.error("Error fetching return requests", err);
        }
    };

    const handleUpdateStatus = async (id, action) => {
        setLoading(true);
        setMessage("");
        try {
            await axios.put(`http://localhost:5000/api/returnrequests/${id}/${action}`);
            setMessage(`Request successfully ${action}ed!`);
            fetchReturnRequests(); // Refresh the list
        } catch (err) {
            console.error(`Error updating status for ${id}`, err);
            setMessage("Failed to update status.");
        } finally {
            setLoading(false);

            // Clear message after 3 seconds
            setTimeout(() => setMessage(""), 3000);
        }
    };

    return (
        <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <h2 className="mb-4" style={{ color: "#343a40", fontWeight: "bold" }}>Pending Return Requests</h2>

            {message && (
                <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`} style={{ padding: "10px", borderRadius: "5px", marginBottom: "15px", backgroundColor: message.includes("success") ? "#d4edda" : "#f8d7da", color: message.includes("success") ? "#155724" : "#721c24" }}>
                    {message}
                </div>
            )}

            {/* Requests Table */}
            <div className="card shadow-sm p-4" style={{ backgroundColor: "white", borderRadius: "10px", border: "none" }}>
                <div className="table-responsive" style={{ overflowX: "auto" }}>
                    <table className="table table-striped table-hover mt-3" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead className="table-dark" style={{ backgroundColor: "#343a40", color: "white" }}>
                            <tr>
                                <th style={{ padding: "12px", textAlign: "left" }}>Product</th>
                                <th style={{ padding: "12px", textAlign: "left" }}>Quantity</th>
                                <th style={{ padding: "12px", textAlign: "left" }}>Reason</th>
                                <th style={{ padding: "12px", textAlign: "left" }}>Requested By</th>
                                <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
                                <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center" style={{ padding: "20px", textAlign: "center", color: "#6c757d" }}>
                                        No return requests available.
                                    </td>
                                </tr>
                            ) : (
                                returnRequests.map((req) => (
                                    <tr key={req._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                                        <td style={{ padding: "12px" }}>{req.productName}</td>
                                        <td style={{ padding: "12px" }}>{req.quantity}</td>
                                        <td style={{ padding: "12px" }}>{req.reason}</td>
                                        <td style={{ padding: "12px" }}>{req.requestedBy}</td>
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
                                            {req.status === "Pending Supplier Approval" ? (
                                                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleUpdateStatus(req._id, "approve")}
                                                        disabled={loading}
                                                        style={{ padding: "5px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleUpdateStatus(req._id, "reject")}
                                                        disabled={loading}
                                                        style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ color: "#6c757d", fontStyle: "italic" }}>Processed</span>
                                            )}
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

export default SupplierReturnRequests;
