
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./AddProduct.css";

const API_URL = "http://localhost:5000";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);

    const [form, setForm] = useState({
        product_name: "",
        product_category: "Burger",
        product_price: "",
    });

    // Fetch products when the page loads
    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            setProducts(response.data.products || response.data);
        } catch {
            setMessage("Failed to load products.");
        }
    };

    useEffect(() => {
        let ignore = false;

        const loadProducts = async () => {
            try {
                const response = await api.get("/products");

                if (!ignore) {
                    setProducts(response.data.products || response.data);
                }
            } catch {
                if (!ignore) {
                    setMessage("Failed to load products.");
                }
            }
        };

        loadProducts();

        return () => {
            ignore = true;
        };
    }, []);

    // Generate image preview
    const preview = useMemo(() => {
        return image ? URL.createObjectURL(image) : "";
    }, [image]);

    // Clean up preview URL
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files?.[0];

        if (!selectedImage) return;

        if (selectedImage.size > 5 * 1024 * 1024) {
            setMessage("Image size must be less than 5 MB.");
            e.target.value = "";
            setImage(null);
            return;
        }

        setMessage("");
        setImage(selectedImage);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!image) {
            setMessage("Please select a product image.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const formData = new FormData();

            formData.append("product_name", form.product_name);
            formData.append("product_category", form.product_category);
            formData.append("product_price", form.product_price);
            formData.append("image", image);

            await api.post("/products", formData);

            setMessage("Product added successfully!");

            setForm({
                product_name: "",
                product_category: "Burger",
                product_price: "",
            });

            setImage(null);
            e.target.reset();

            await fetchProducts();
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Failed to add product."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="fd-admin-products">
            <div className="fd-admin-products-container">

                <header className="fd-admin-heading">
                    <h1>Product Management</h1>
                    <p>Add and manage the products available on FanDeal.</p>
                </header>

                {/* Add Product Form */}
                <section className="fd-admin-form-card">
                    <h2>Add New Product</h2>

                    <form
                        className="fd-admin-form"
                        onSubmit={handleAddProduct}
                    >
                        <div className="fd-admin-field">
                            <label htmlFor="product_name">
                                Product Name
                            </label>

                            <input
                                id="product_name"
                                name="product_name"
                                type="text"
                                placeholder="Enter product name"
                                value={form.product_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="fd-admin-field">
                            <label htmlFor="product_category">
                                Category
                            </label>

                            <select
                                id="product_category"
                                name="product_category"
                                value={form.product_category}
                                onChange={handleChange}
                                required
                            >
                                <option value="Burger">Burger</option>
                                <option value="Side">Side</option>
                                <option value="Drink">Drink</option>
                            </select>
                        </div>

                        <div className="fd-admin-field">
                            <label htmlFor="product_price">
                                Price (₹)
                            </label>

                            <input
                                id="product_price"
                                name="product_price"
                                type="number"
                                placeholder="Enter product price"
                                value={form.product_price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="fd-admin-field">
                            <label htmlFor="product_image">
                                Product Image
                            </label>

                            <input
                                id="product_image"
                                className="fd-admin-file-input"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                required
                            />

                            {preview && (
                                <img
                                    className="fd-admin-image-preview"
                                    src={preview}
                                    alt="Product preview"
                                />
                            )}
                        </div>

                        <button
                            className="fd-admin-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Adding Product..." : "Add Product"}
                        </button>
                    </form>

                    {message && (
                        <p className="fd-admin-message" role="status">
                            {message}
                        </p>
                    )}
                </section>

                {/* Product Listing */}
                <section className="fd-admin-product-section">
                    <h2>Product Listing ({products.length})</h2>

                    {products.length === 0 ? (
                        <div className="fd-admin-empty">
                            No products available yet. Add your first
                            product above.
                        </div>
                    ) : (
                        <div className="fd-admin-product-grid">
                            {products.map((product) => (
                                <article
                                    className="fd-admin-product-card"
                                    key={product._id}
                                >
                                    <div className="fd-admin-product-image">
                                        <img
                                            src={`${API_URL}${product.image_url}`}
                                            alt={product.product_name}
                                        />
                                    </div>

                                    <div className="fd-admin-product-details">
                                        <h3>{product.product_name}</h3>

                                        <span className="fd-admin-product-category">
                                            {product.product_category}
                                        </span>

                                        <p className="fd-admin-product-price">
                                            ₹{product.product_price}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}

export default AdminProducts;
