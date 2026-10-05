import { useState } from "react";
import API from "../services/api";

function Register({ onRegister, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setBusy(true);
    try {
      const response = await API.post("/auth/register", { username, password, role });
      setMessage(typeof response.data === "string" ? response.data : "Account created. You can log in now.");
      window.setTimeout(onRegister, 900);
    } catch (requestError) {
      setError(typeof requestError.response?.data === "string" ? requestError.response.data : "Could not create your account. Check the details and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-card register-card">
        <div className="auth-logo" aria-hidden="true">🛒</div>
        <h1>Create account</h1>
        <p className="auth-subtitle">Join the E-Commerce Application</p>
        <form onSubmit={handleRegister}>
          <label htmlFor="register-username">Username</label>
          <input id="register-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" type="password" autoComplete="new-password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <fieldset className="role-picker"><legend>Register as</legend>
            <label className={role === "CUSTOMER" ? "role-option selected" : "role-option"}><input type="radio" name="role" value="CUSTOMER" checked={role === "CUSTOMER"} onChange={() => setRole("CUSTOMER")} /><span>Customer</span></label>
            <label className={role === "SELLER" ? "role-option selected" : "role-option"}><input type="radio" name="role" value="SELLER" checked={role === "SELLER"} onChange={() => setRole("SELLER")} /><span>Seller</span></label>
          </fieldset>
          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-success" role="status">{message}</p>}
          <button className="primary-button auth-submit" disabled={busy}>{busy ? "Creating account…" : "Register"}</button>
        </form>
        <p className="auth-switch">Already have an account? <button onClick={onLogin}>Login</button></p>
      </section>
    </main>
  );
}

export default Register;
