import { useState } from "react";

const categories = [
  { name: "Electronics", detail: "Everyday tech, made useful.", icon: "🎧", tone: "landing-blue" },
  { name: "Accessories", detail: "Small details, big difference.", icon: "⌚", tone: "landing-lilac" },
  { name: "Bags & more", detail: "Ready for wherever you’re going.", icon: "🎒", tone: "landing-mint" },
];

function LandingPage({ onLogin, onRegister }) {
  const [page, setPage] = useState("home");

  return (
    <div className="landing-page">
      <header className="landing-header">
        <button className="landing-brand brand-home" onClick={() => setPage("home")}><span aria-hidden="true">🛒</span> E-Commerce Application</button>
        <nav className="landing-nav" aria-label="Main navigation"><button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}>Home</button><button className={page === "about" ? "active" : ""} onClick={() => setPage("about")}>About</button><button className={page === "contact" ? "active" : ""} onClick={() => setPage("contact")}>Contact</button></nav>
        <div className="landing-actions"><button className="landing-login" onClick={onLogin}>Login</button><button className="primary-button landing-register" onClick={onRegister}>Register</button></div>
      </header>

      {page === "home" && <main id="top">
        <section className="landing-hero">
          <div className="landing-hero-copy"><span className="landing-kicker"><i /> A BETTER WAY TO FIND YOUR EVERYDAY</span><h1>Good things<br />are <em>closer</em> than ever.</h1><p>Discover useful finds for work, home, and everywhere in between. Shop with confidence, or bring your own products to the collection.</p><div className="landing-hero-actions"><button className="primary-button" onClick={onLogin}>Explore products <span>→</span></button><button className="text-button" onClick={onRegister}>Open a seller account</button></div><div className="landing-trust"><span>✓</span> A simple, secure place to shop and sell</div></div>
          <div className="landing-hero-visual"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-bag">🛍️</div><div className="hero-float float-phone">📱</div><div className="hero-float float-headphones">🎧</div><div className="hero-float float-box">📦</div><span className="hero-visual-caption">FIND YOUR NEXT FAVORITE</span></div>
        </section>

        <section className="landing-categories" aria-labelledby="categories-title"><div className="landing-section-heading"><div><span className="landing-kicker">A GOOD PLACE TO START</span><h2 id="categories-title">Explore the collection</h2></div><button className="landing-view-all" onClick={onLogin}>View products <span>→</span></button></div><div className="landing-category-grid">{categories.map((category) => <button className="landing-category-card" key={category.name} onClick={onLogin}><span className={`category-art ${category.tone}`}>{category.icon}</span><span className="category-card-info"><strong>{category.name}</strong><small>{category.detail}</small></span><span className="category-arrow">↗</span></button>)}</div></section>

      </main>}
      {page === "about" && <main className="simple-page"><span className="landing-kicker">ABOUT US</span><h1>Shopping and selling,<br /><em>made simple.</em></h1><p>Our e-commerce app brings customers and sellers together in one place. Customers can browse the product catalog, while sellers can add and manage their products through a secure account.</p><button className="primary-button" onClick={() => setPage("home")}>Back to Home</button></main>}
      {page === "contact" && <main className="simple-page contact-page"><span className="landing-kicker">CONTACT</span><h1>We’re here<br /><em>to help.</em></h1><p>Questions about your account or a product? Send our team a message and we’ll get back to you.</p><a className="contact-email" href="mailto:support@ecommerceapp.com">support@ecommerceapp.com</a><button className="primary-button" onClick={() => setPage("home")}>Back to Home</button></main>}
      <footer className="landing-footer"><button className="landing-brand brand-home" onClick={() => setPage("home")}><span aria-hidden="true">🛒</span> E-Commerce Application</button><span>Shopping and selling, made simple.</span><button onClick={onLogin}>Sign in →</button></footer>
    </div>
  );
}

export default LandingPage;
