import { useState } from "react";
import API from "../services/api";

const blankProduct = { name: "", category: "", price: "", quantity: "" };

function ProductForm({ product, onSaved, onCancel }) {
  const [form, setForm] = useState(() => product ? {
    name: product.name ?? "",
    category: product.category ?? "",
    price: product.price ?? "",
    quantity: product.quantity ?? "",
  } : blankProduct);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const editing = Boolean(product);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    const payload = { name: form.name, category: form.category, price: Number(form.price), quantity: Number(form.quantity) };
    try {
      if (editing) await API.put(`/products/${product.id}`, payload);
      else await API.post("/products", payload);
      onSaved();
    } catch (requestError) {
      if (requestError.response?.status === 401) setError("Your session expired. Please log in again.");
      else if (requestError.response?.status === 403) setError("You can only edit products that belong to your seller account.");
      else if (!requestError.response) setError("Could not reach the store server. Make sure the backend is running.");
      else setError(typeof requestError.response.data === "string" ? requestError.response.data : "The product could not be saved. Check the details and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="product-form-card">
      <div className={`form-titlebar ${editing ? "edit-titlebar" : "add-titlebar"}`}><span aria-hidden="true">{editing ? "✎" : "＋"}</span><h1>{editing ? "Edit Product" : "Add Product"}</h1></div>
      <form className="product-form" onSubmit={handleSubmit}>
        <label htmlFor="product-name">Product Name</label>
        <input id="product-name" name="name" value={form.name} onChange={handleChange} required />
        <label htmlFor="product-category">Category</label>
        <input id="product-category" name="category" value={form.category} onChange={handleChange} required />
        <label htmlFor="product-price">Price</label>
        <input id="product-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
        <label htmlFor="product-quantity">Quantity</label>
        <input id="product-quantity" name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={handleChange} required />
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><button type="submit" className="primary-button" disabled={busy}>{busy ? "Saving…" : editing ? "▣  Update Product" : "＋  Add Product"}</button><button type="button" className="secondary-button" onClick={onCancel}>Cancel</button></div>
      </form>
    </section>
  );
}

export default ProductForm;
