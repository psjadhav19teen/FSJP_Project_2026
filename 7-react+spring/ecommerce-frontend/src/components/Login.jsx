import { useState } from "react";
import API from "../services/api";

function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data);
      onLogin();
    } catch {
      setError("Login failed. Check your username and password, then try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-card login-card">
        <div className="auth-logo" aria-hidden="true">🛒</div>
        <h1>E-Commerce Application</h1>
        <p className="auth-subtitle">Login to continue</p>
        <form onSubmit={handleLogin}>
          <label htmlFor="login-username">Username</label>
          <input id="login-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="primary-button auth-submit" disabled={busy}>{busy ? "Logging in…" : "Login"}</button>
        </form>
        <p className="auth-switch">Don’t have an account? <button onClick={onRegister}>Register</button></p>
      </section>
    </main>
  );
}

export default Login;
