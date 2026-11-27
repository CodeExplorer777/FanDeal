
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyPoster } from "../../services/posterService";
import posterBackground from "../../assets/poster-background.jpg";
import "./MyPoster.css";

const API_URL = "http://localhost:5000";

function MyPoster() {
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const response = await getMyPoster();
        setPoster(response.poster);
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(
            err.response?.data?.message || "Unable to load your poster."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPoster();
  }, []);

  if (loading) {
    return (
      <div className="fd-my-poster-state">
        <h2>Loading your poster...</h2>
        <p>Please wait while we retrieve your submission.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fd-my-poster-state">
        <h2>Unable to load poster</h2>
        <p>{error}</p>
        <Link to="/" className="fd-my-poster-link">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!poster) {
    return (
      <div className="fd-my-poster-state">
        <h2>You haven't created a poster yet!</h2>
        <p>Select your favourite Burger, Side, and Drink to get started.</p>
        <Link to="/" className="fd-my-poster-link">
          Explore Products
        </Link>
      </div>
    );
  }

  const statusClass = poster.status.toLowerCase();

  return (
    <main className="fd-my-poster">
      <div className="fd-my-poster-container">
        <header className="fd-my-poster-header">
          <h1>My Poster</h1>
          <p>Track your submission and view your personalized food poster.</p>
        </header>

        <div className="fd-my-poster-layout">
          <section className="fd-my-poster-preview">
            <div
              className="fd-my-poster-canvas"
              style={{
                backgroundImage: `url(${posterBackground})`,
              }}
            >
              {poster.poster_items.map((item, index) => {
                const product = item.productId;

                if (!product) return null;

                return (
                  <img
                    key={product._id || index}
                    className="fd-my-poster-product"
                    src={`${API_URL}${product.image_url}`}
                    alt={product.product_name}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                );
              })}
            </div>
          </section>

          <aside className="fd-my-poster-sidebar">
            <div className="fd-my-poster-card">
              <h3>Submission Status</h3>

              <span className={`fd-my-poster-status ${statusClass}`}>
                {poster.status}
              </span>

              <p className="fd-my-poster-note" style={{ marginTop: "14px" }}>
                {poster.status === "Pending" &&
                  "Your poster has been submitted and is waiting for admin review."}

                {poster.status === "Approved" &&
                  "Congratulations! Your poster has been approved."}

                {poster.status === "Rejected" &&
                  "Your poster was rejected. Please contact the administrator for more information."}
              </p>
            </div>

            <div className="fd-my-poster-card">
              <h3>Selected Products</h3>

              {poster.poster_items.map((item, index) => {
                const product = item.productId;

                if (!product) return null;

                return (
                  <div
                    className="fd-my-poster-product-row"
                    key={product._id || index}
                  >
                    <img
                      src={`${API_URL}${product.image_url}`}
                      alt={product.product_name}
                    />

                    <div className="fd-my-poster-product-info">
                      <strong>{product.product_name}</strong>
                      <span>₹{product.product_price}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="fd-my-poster-card">
              <h3>Poster Submitted</h3>
              <p className="fd-my-poster-note">
                Your poster is saved and locked while it is under review.
                You can check its latest status here.
              </p>

              <Link to="/" className="fd-my-poster-link">
                Back to Products
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default MyPoster;
