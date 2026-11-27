
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedProducts, setSelectedProducts] = useState({
    Burger: null,
    Side: null,
    Drink: null,
  });

  const navigate = useNavigate();
  const categories = ["All", "Burger", "Side", "Drink"];
  const selectionCategories = ["Burger", "Side", "Drink"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products || data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [product.product_category]: product,
    }));
  };

  const allProductsSelected = selectionCategories.every(
    (category) => selectedProducts[category] !== null
  );

  const visibleProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) => product.product_category === activeCategory
        );

  const selectedCount = selectionCategories.filter(
    (category) => selectedProducts[category] !== null
  ).length;

  return (
    <main className="fd-home">
      <section className="fd-hero">
        <div className="fd-hero-content">
          <span className="fd-hero-tag">YOUR FOOD. YOUR CREATION.</span>
          <h1>Build Your Perfect <span>Food Poster.</span></h1>
          <p>
            Pick your favourite burger, side and drink.
            Create a poster that's uniquely yours!
          </p>
          <button
            className="fd-primary-btn"
            onClick={() =>
              document.getElementById("fd-products")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Explore Products
          </button>
        </div>

        <div className="fd-hero-image">
          <img src="/hero.png" alt="FanDeal delicious food" />
        </div>
      </section>

      <section className="fd-selection-summary">
        <div>
          <h3>Your Poster Selection</h3>
          <p>Choose one item from each category</p>
        </div>

        <div className="fd-selection-progress">
          <strong>{selectedCount}/3</strong>
          <span>Selected</span>
        </div>

        <div className="fd-selection-items">
          {selectionCategories.map((category) => (
            <div className="fd-selection-item" key={category}>
              <span className={selectedProducts[category] ? "complete" : ""}>
                {selectedProducts[category] ? "✓" : "○"}
              </span>
              <div>
                <small>{category}</small>
                <strong>
                  {selectedProducts[category]?.product_name || "Not selected"}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="fd-products-section" id="fd-products">
        <div className="fd-products-heading">
          <div>
            <span className="fd-section-eyebrow">FRESH & DELICIOUS</span>
            <h2>Explore Our Menu</h2>
            <p>Choose your favourites to build your poster.</p>
          </div>
          <span className="fd-product-count">
            {visibleProducts.length} Products
          </span>
        </div>

        <div className="fd-category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category === "All" ? "All Products" : category}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="fd-message">Loading delicious products...</p>
        ) : error ? (
          <p className="fd-message fd-error">{error}</p>
        ) : visibleProducts.length === 0 ? (
          <p className="fd-message">No products available in this category.</p>
        ) : (
          <div className="fd-product-grid">
            {visibleProducts.map((product) => {
              const isSelected =
                selectedProducts[product.product_category]?._id ===
                product._id;

              return (
                <article
                  className={`fd-product-card ${isSelected ? "selected" : ""}`}
                  key={product._id}
                >
                  <div className="fd-product-image">
                    <img
                      src={`http://localhost:5000${product.image_url}`}
                      alt={product.product_name}
                    />
                    <span className="fd-product-category">
                      {product.product_category}
                    </span>
                    {isSelected && (
                      <span className="fd-selected-tag">✓ Selected</span>
                    )}
                  </div>

                  <div className="fd-product-details">
                    <h3>{product.product_name}</h3>

                    <div className="fd-product-bottom">
                      <strong>₹{product.product_price}</strong>
                      <button
                        className={
                          isSelected
                            ? "fd-selected-button"
                            : "fd-select-button"
                        }
                        onClick={() => handleSelectProduct(product)}
                      >
                        {isSelected ? "Selected ✓" : "Select +"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="fd-create-section">
        <div>
          <h3>Ready to create your poster?</h3>
          <p>
            {allProductsSelected
              ? "Your three products are ready!"
              : `Select ${3 - selectedCount} more ${
                  3 - selectedCount === 1 ? "product" : "products"
                } to continue.`}
          </p>
        </div>

        <button
          className="fd-primary-btn fd-create-button"
          disabled={!allProductsSelected}
          onClick={() =>
            navigate("/poster-builder", {
              state: { selectedProducts },
            })
          }
        >
          Create My Poster →
        </button>
      </section>
    </main>
  );
}

export default ProductList;
