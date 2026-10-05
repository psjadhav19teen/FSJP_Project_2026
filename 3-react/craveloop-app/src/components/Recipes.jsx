import { useEffect, useMemo, useState } from 'react';

const MENU_TABS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Vegetarian'];
const USD_TO_INR = 83;

function getRecipePrice(recipe) {
  const dollarPrice = Math.max(8, Math.round(recipe.caloriesPerServing / 35));
  return dollarPrice * USD_TO_INR;
}

function getRecipeMatchText(recipe) {
  return [
    recipe.name,
    recipe.cuisine,
    ...(recipe.tags ?? []),
    ...(recipe.mealType ?? []),
  ]
    .join(' ')
    .toLowerCase();
}

function formatMinutes(totalMinutes) {
  if (!totalMinutes) return 'Quick';
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

function RecipeCard({ recipe, onSelect, onAdd }) {
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  return (
    <article className="card">
      <div className="card-image-wrap">
        <img className="card-image" src={recipe.image} alt={recipe.name} loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-title-row">
          <h3>{recipe.name}</h3>
          <span className="price-chip">₹{getRecipePrice(recipe)}</span>
        </div>
        <p className="card-copy">{recipe.tags?.slice(0, 3).join(' • ')}</p>
        <div className="card-meta">
          <span>{formatMinutes(totalTime)}</span>
          <span>{recipe.mealType?.[0] ?? 'Popular'}</span>
          <span>{recipe.difficulty}</span>
        </div>
        <div className="card-actions">
          <button className="btn btn-outline-light ghost-button" onClick={() => onSelect(recipe)}>
            View details
          </button>
          <button className="btn primary-button" onClick={() => onAdd(recipe)}>
            Add to order
          </button>
        </div>
      </div>
    </article>
  );
}

function OrderPanel({ cart, onRemove }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = cart.length ? 3.49 * USD_TO_INR : 0;
  const total = subtotal + delivery;

  return (
    <aside id="order" className="order-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Your order</p>
        </div>
        <div className="cart-pill">{cart.reduce((sum, item) => sum + item.qty, 0)} items</div>
      </div>

   

      <div className="panel-section">
        <h4>Basket</h4>
        {cart.length ? (
          <ul className="basket-list">
            {cart.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>₹{item.price.toFixed(2)} each</span>
                </div>
                <div className="basket-actions">
                  <span>x{item.qty}</span>
                  <button className="btn btn-sm btn-outline-light" onClick={() => onRemove(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Your bag is empty. Add a few trending dishes to get rolling.</p>
        )}
      </div>

      <div className="panel-section totals">
        <div>
          <span>Subtotal</span>
          <strong>₹{subtotal.toFixed(2)}</strong>
        </div>
        <div>
          <span>Delivery</span>
          <strong>₹{delivery.toFixed(2)}</strong>
        </div>
        <div className="grand-total">
          <span>Total</span>
          <strong>₹{total.toFixed(2)}</strong>
        </div>
      </div>
    </aside>
  );
}

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecipes() {
      try {
        setLoading(true);
        setError('');
        const response = await fetch('https://dummyjson.com/recipes?limit=24', {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        const availableRecipes = (data.recipes ?? []).filter(
          (recipe) => !['italian', 'american'].includes(recipe.cuisine?.toLowerCase()),
        );
        setRecipes(availableRecipes);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('We could not load the live menu right now. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
    return () => controller.abort();
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesQuery = getRecipeMatchText(recipe).includes(query.trim().toLowerCase());
      const matchesTab =
        activeTab === 'All' ||
        recipe.mealType?.some((type) => type.toLowerCase() === activeTab.toLowerCase()) ||
        recipe.tags?.some((tag) => tag.toLowerCase().includes(activeTab.toLowerCase())) ||
        (activeTab === 'Vegetarian' &&
          recipe.tags?.some((tag) => tag.toLowerCase().includes('vegetarian')));

      return matchesQuery && matchesTab;
    });
  }, [recipes, query, activeTab]);

  function addToCart(recipe) {
    const price = getRecipePrice(recipe);
    setCart((current) => {
      const existing = current.find((item) => item.id === recipe.id);
      if (existing) {
        return current.map((item) =>
          item.id === recipe.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...current, { id: recipe.id, name: recipe.name, price, qty: 1 }];
    });
    setSelectedRecipe(recipe);
  }

  function removeFromCart(id) {
    setCart((current) => current.filter((item) => item.id !== id));
    if (selectedRecipe?.id === id) {
      setSelectedRecipe(null);
    }
  }

  const heroRecipe = selectedRecipe ?? recipes[0];

  return (
    <div className="app-shell container-fluid">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="hero">
        {heroRecipe && (
          <div className="hero-banner">
            <img src={heroRecipe.image} alt={heroRecipe.name} />
            <div className="hero-banner-copy">
              <p className="eyebrow">Featured today</p>
              <h2>{heroRecipe.name}</h2>
            </div>
          </div>
        )}

        <div className="brand-row">
          
          <div>
            <p className="eyebrow">CraveLoop</p>
            <h1>Trending food ordering, powered by live recipes.</h1>
          </div>
        </div>

        <p className="hero-copy">
          Explore a fresh menu, search by flavor, and build an order in a polished, app-like
          experience built with React.
        </p>

        <div className="search-bar">
          <input
            className="form-control"
            type="search"
            placeholder="Search dishes, cuisines, or tags..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="tab-row">
          {MENU_TABS.map((tab) => (
            <button
              key={tab}
              className={tab === activeTab ? 'btn tab active' : 'btn tab'}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main id="menu" className="content-grid">
        <section className="menu-column">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Live menu</p>
              <h2>Choose your next craving</h2>
            </div>
            <span>{filteredRecipes.length} dishes found</span>
          </div>

          {loading ? (
            <div className="status-card">Loading fresh dishes from the API...</div>
          ) : error ? (
            <div className="status-card error">{error}</div>
          ) : filteredRecipes.length ? (
            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id}>
                  <RecipeCard recipe={recipe} onSelect={setSelectedRecipe} onAdd={addToCart} />
                </div>
              ))}
            </div>
          ) : (
            <div className="status-card">No dishes match that filter. Try a different search.</div>
          )}
        </section>

        <OrderPanel cart={cart} onRemove={removeFromCart} />
      </main>

      <footer id="about" className="site-footer">
        <div className="footer-brand">
          <p className="eyebrow">CraveLoop</p>
          <h2>Good food, on repeat.</h2>
          <p className="muted">Fresh ideas for every craving, gathered in one delicious place.</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#menu">Explore menu</a>
          <a href="#order">Your order</a>
          <a href="#about">About CraveLoop</a>
        </nav>

        <p className="footer-copyright">(c) {new Date().getFullYear()} CraveLoop. Made for food lovers.</p>
      </footer>
    </div>
  );
}
