import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import LandingPage from "./components/LandingPage";

function readSession() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(payload));
    return { role: claims.role || "", username: claims.sub || "" };
  } catch {
    return null;
  }
}

function App() {
  const [session, setSession] = useState(readSession);
  const [view, setView] = useState(() => localStorage.getItem("token") ? "products" : "landing");
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const canManage = session?.role === "SELLER" || session?.role === "ADMIN";

  const handleLogin = () => {
    setSession(readSession());
    setView("products");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setSession(null);
    setEditingProduct(null);
    setView("landing");
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setView("form");
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setView("form");
  };

  const handleSaved = () => {
    setView("products");
    setRefreshKey((current) => current + 1);
  };

  if (!session || view === "login" || view === "register" || view === "landing") {
    if (view === "register") return <Register onRegister={() => setView("login")} onLogin={() => setView("login")} />;
    if (view === "login") return <Login onLogin={handleLogin} onRegister={() => setView("register")} />;
    return <LandingPage onLogin={() => setView("login")} onRegister={() => setView("register")} />;
  }

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <a className="dashboard-brand" href="#products" onClick={(event) => { event.preventDefault(); setView("products"); }}><span className="brand-cart" aria-hidden="true">🛒</span><span>E-Commerce Application</span></a>
        <div className="account-actions"><span className={`role-badge ${session.role === "CUSTOMER" ? "customer-badge" : "seller-badge"}`}>{session.role === "CUSTOMER" ? "Customer" : session.role === "ADMIN" ? "Admin" : "Seller"} ({session.username})</span><button className="logout-button" onClick={logout}>Logout</button></div>
      </header>
      <main className="dashboard-main">
        {view === "form" && canManage
          ? <ProductForm product={editingProduct} onSaved={handleSaved} onCancel={() => setView("products")} />
          : <ProductList canManage={canManage} role={session.role} username={session.username} onAdd={openAddForm} onEdit={openEditForm} refreshKey={refreshKey} />}
      </main>
    </div>
  );
}

export default App;
