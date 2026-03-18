import { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    productId: "",
    name: "",
    category: "",
    stock: "",
    minStock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!form.productId || !form.name) {
      alert("Fill required fields");
      return;
    }

    try {
      const payload = {
        ...form,
        stock: Number(form.stock) || 0,
        minStock: Number(form.minStock) || 0,
      };

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          payload
        );
        setEditingId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          payload
        );
      }

      setForm({
        productId: "",
        name: "",
        category: "",
        stock: "",
        minStock: "",
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="products-container">
      <h2 className="page-title">Product Management</h2>

      {/* ===== FORM CARD ===== */}
      <div className="form-card">
        <input
          placeholder="Product ID"
          value={form.productId}
          onChange={(e) =>
            setForm({ ...form, productId: e.target.value })
          }
        />
        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Min Stock"
          value={form.minStock}
          onChange={(e) =>
            setForm({ ...form, minStock: e.target.value })
          }
        />

        <button className="primary-btn" onClick={handleSubmit}>
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Min Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.productId}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>
                  <span
                    className={
                      p.stock <= p.minStock
                        ? "low-stock"
                        : "in-stock"
                    }
                  >
                    {p.stock}
                  </span>
                </td>
                <td>{p.minStock}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(p._id)}
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

export default Products;