import { useState } from 'react';
import './App.css';
import storesData from './test/data/stores.json';
import productsData from './test/data/products.json';
import storeProductsData from './test/data/storeProducts.json';

function App() {
  const [selectedStore, setSelectedStore] = useState(1);
  const [sortBy, setSortBy] = useState('Name');

  const stores = storesData.stores;

  const getProductsForStore = () => {
    const storeProductIds = storeProductsData.shopProducts
      .filter((sp) => sp.shop === selectedStore)
      .map((sp) => sp.product);

    const storeProducts = productsData.products
      .filter((p) => storeProductIds.includes(p.id))
      .map((product) => ({
        id: `MT-${String(product.id).padStart(2, '0')}`,
        name: product.name,
        toppings: product.toppings,
        price: `$${product.price}`,
        isTrending: product.id === 1,
      }));

    return storeProducts;
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

        {/* Filter and Sort Controls */}
        <div className="controls-bar">
          <button className="filter-btn">Filter</button>
          <div className="sort-container">
            <label htmlFor="sort">Sort By</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option>Name</option>
              <option>Price</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
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
                {product.isTrending && (
                  <button className="trending-badge">Trending</button>
                )}
                <div className="product-price">{product.price}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
