import { useCallback, useEffect, useState } from "react";
import API from "../services/api";

const productIcons = [
  { match: /laptop|computer|notebook/i, icon: "💻" },
  { match: /phone|mobile/i, icon: "📱" },
  { match: /headphone|earbud|audio/i, icon: "🎧" },
  { match: /bag|backpack/i, icon: "🎒" },
  { match: /watch/i, icon: "⌚" },
  { match: /shoe|footwear/i, icon: "👟" },
  { match: /book/i, icon: "📚" },
];
const cardColors = ["card-blue", "card-violet", "card-mint", "card-peach", "card-sky", "card-lilac"];

function getProductIcon(product) {
  const description = `${product.name ?? ""} ${product.category ?? ""}`;
  return productIcons.find(({ match }) => match.test(description))?.icon ?? "📦";
}

function ProductList({ canManage, role, username, onAdd, onEdit, refreshKey }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await API.get("/products");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (error.response?.status === 401) setLoadError("Your session has expired. Please log in again.");
      else if (!error.response) setLoadError("Could not reach the store server. Make sure the backend is running.");
      else setLoadError("Products could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts, refreshKey]);

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await API.delete(`/products/${deletingProduct.id}`);
      setProducts((current) => current.filter((product) => product.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (error) {
      setDeleteError(error.response?.status === 403
        ? "You can only delete products that belong to your seller account."
        : "The product could not be deleted. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="products-heading"><h1>Product List</h1>{canManage && <button className="primary-button add-product-button" onClick={onAdd}><span aria-hidden="true">＋</span> Add Product</button>}</div>
      {loadError && <div className="notice error-notice" role="alert">{loadError} <button onClick={loadProducts}>Retry</button></div>}
      {loading && <div className="products-state">Loading products…</div>}
      {!loading && !loadError && products.length === 0 && <div className="products-state">No products yet. Add your first product to get started.</div>}
      {!loading && !loadError && products.length > 0 && <div className="product-grid">{products.map((product, index) => {
        const isOwner = role === "ADMIN" || product.seller?.username === username;
        return <article className="product-card" key={product.id}>
          <div className={`product-image ${cardColors[index % cardColors.length]}`}><span>{getProductIcon(product)}</span></div>
          <div className="product-card-body">
            <h2>{product.name}</h2>
            <span className="category-badge">{product.category}</span>
            <p className="product-price">₹{Number(product.price).toLocaleString("en-IN")}</p>
            <p className="product-quantity">Quantity: {product.quantity}</p>
            {canManage && isOwner && <div className="product-actions"><button className="edit-button" onClick={() => onEdit(product)}>Edit</button><button className="delete-button" onClick={() => { setDeleteError(""); setDeletingProduct(product); }}>Delete</button></div>}
          </div>
        </article>;
      })}</div>}
      {deletingProduct && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !deleting) setDeletingProduct(null); }}><section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title"><div className="delete-symbol">▣</div><h2 id="delete-title">Confirm Delete</h2><p>Are you sure you want to delete this product?</p><strong>{deletingProduct.name}</strong><span className="modal-category">({deletingProduct.category})</span>{deleteError && <p className="form-error" role="alert">{deleteError}</p>}<div className="modal-actions"><button className="delete-button" onClick={confirmDelete} disabled={deleting}>{deleting ? "Deleting…" : "Delete"}</button><button className="secondary-button" onClick={() => setDeletingProduct(null)} disabled={deleting}>Cancel</button></div></section></div>}
    </>
  );
}

export default ProductList;
