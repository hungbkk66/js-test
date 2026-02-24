import { useState } from 'react';
import './App.css';
import storesData from './test/data/stores.json';
import productsData from './test/data/products.json';
import storeProductsData from './test/data/storeProducts.json';

function App() {
  const [selectedStore, setSelectedStore] = useState(1);
  const [sortBy, setSortBy] = useState('Name (Asc)');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const stores = storesData.stores;

  // Get all toppings
  const getAllToppings = () => {
    const toppingSet = new Set();
    productsData.products.forEach((product) => {
      product.toppings.split(',').forEach((topping) => {
        toppingSet.add(topping.trim().toLowerCase());
      });
    });
    return Array.from(toppingSet).sort();
  };

  const allToppings = getAllToppings();

  // Get products and filter and sort
  const getProductsForStore = () => {
    const storeProductIds = storeProductsData.shopProducts
      .filter((sp) => sp.shop === selectedStore)
      .map((sp) => sp.product);

    let storeProducts = productsData.products
      .filter((p) => storeProductIds.includes(p.id))
      .map((product) => ({
        id: `MT-0${String(product.id)}`,
        name: product.name,
        toppings: product.toppings,
        price: product.price,
        priceDisplay: `$${product.price}`,
      }));

    // Topping filter
    if (selectedToppings.length > 0) {
      storeProducts = storeProducts.filter((product) => {
        const productToppings = product.toppings
          .split(',')
          .map((t) => t.trim().toLowerCase());
        return selectedToppings.some((topping) =>
          productToppings.includes(topping),
        );
      });
    }

    // Sort
    const sorted = [...storeProducts].sort((a, b) => {
      switch (sortBy) {
        case 'Name (Asc)':
          return a.name.localeCompare(b.name);
        case 'Name (Dsc)':
          return b.name.localeCompare(a.name);
        case 'Price (Asc)':
          return a.price - b.price;
        case 'Price (Dsc)':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return sorted;
  };

  const handleToppingChange = (topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping],
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">Milk Tea Store</div>
        <nav className="sidebar-nav">
          {stores.map((store) => (
            <button
              key={store.id}
              className={`nav-item ${selectedStore === store.id ? 'active' : ''}`}
              onClick={() => setSelectedStore(store.id)}
            >
              {store.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">
          {stores.find((s) => s.id === selectedStore)?.name} Menu
        </h1>

        {/* Filter and Sort buttons */}
        <div className="controls-bar">
          <button
            className="filter-btn"
            onClick={() => setShowFilter(!showFilter)}
          >
            Filter
          </button>
          <div className="sort-container">
            <label htmlFor="sort">Sort By</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option>Name (Asc)</option>
              <option>Name (Dsc)</option>
              <option>Price (Asc)</option>
              <option>Price (Dsc)</option>
            </select>
          </div>
        </div>

        {/* Filter toppings */}
        {showFilter && (
          <div className="filter-panel">
            <div className="filter-section">
              <h3 className="filter-title">Toppings:</h3>
              <div className="filter-checkboxes">
                {allToppings.map((topping) => (
                  <div key={topping} className="checkbox-group">
                    <input
                      type="checkbox"
                      id={`topping-${topping}`}
                      checked={selectedToppings.includes(topping)}
                      onChange={() => handleToppingChange(topping)}
                      className="checkbox-input"
                    />
                    <label htmlFor={`topping-${topping}`}>{topping}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products list */}
        <div className="products-grid">
          {getProductsForStore().map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <div className="product-id">{product.id}</div>
                <div className="product-name">{product.name}</div>
              </div>
              <div className="product-line"></div>
              <div className="product-toppings">
                <strong>Toppings:</strong> {product.toppings}
              </div>
              <div className="product-footer">
                <div className="product-price">{product.priceDisplay}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
