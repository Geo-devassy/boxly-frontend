import { useEffect, useState } from "react";
import API from "../../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminReport() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/api/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // DOWNLOAD PDF
  const downloadReport = () => {

    const doc = new jsPDF();

    doc.text("Boxly Warehouse Report", 14, 10);

    const tableColumn = ["Product ID", "Product", "Category", "Stock"];

    const tableRows = [];

    products.forEach((p) => {
      const row = [
        p.productId,
        p.name,
        p.category,
        p.stock
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("warehouse_report.pdf");
  };

  return (
    <div style={{ padding: "30px" }}>

      <h2 style={{ marginBottom: "15px" }}>📊 Admin Report</h2>

      <button
        onClick={downloadReport}
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          marginBottom: "20px",
          cursor: "pointer"
        }}
      >
        ⬇ Download Report
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >

          <thead style={{ background: "#f3f4f6" }}>
            <tr>
              <th style={th}>Product ID</th>
              <th style={th}>Product</th>
              <th style={th}>Category</th>
              <th style={th}>Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => (
              <tr key={i}>
                <td style={td}>{p.productId}</td>
                <td style={td}>{p.name}</td>
                <td style={td}>{p.category}</td>
                <td style={td}>{p.stock}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "12px"
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #eee"
};

export default AdminReport;
