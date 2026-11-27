/* eslint-disable react-hooks/refs */
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Draggable from "react-draggable";

import posterBackground from "../../assets/poster-background.jpg";
import { createPoster } from "../../services/posterService";
import "./PosterBuilder.css";

function DraggableProduct({ category, product, position, onDrag }) {
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      position={position}
      onDrag={(event, data) => onDrag(category, data)}
    >
      <div ref={nodeRef} className="fd-draggable-product">
        <img
          src={`http://localhost:5000${product.image_url}`}
          alt={product.product_name}
          draggable="false"
        />
      </div>
    </Draggable>
  );
}

function PosterBuilder() {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const selectedProducts = location.state?.selectedProducts;
  const categories = ["Burger", "Side", "Drink"];

  const [positions, setPositions] = useState({
    Burger: { x: 7, y: 10 },
    Side: { x: 37, y: 42 },
    Drink: { x: 67, y: 13 },
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getCanvasSize = () => {
    const canvas = canvasRef.current;
    const size = canvas?.clientWidth || 600;

    return { width: size, height: size };
  };

  const getPixelPosition = (position) => {
    const { width, height } = getCanvasSize();

    return {
      x: (position.x / 100) * width,
      y: (position.y / 100) * height,
    };
  };

  const handleDrag = (category, data) => {
    const { width, height } = getCanvasSize();

    setPositions((previous) => ({
      ...previous,
      [category]: {
        x: Math.max(0, Math.min(100, (data.x / width) * 100)),
        y: Math.max(0, Math.min(100, (data.y / height) * 100)),
      },
    }));
  };

  const handleSubmitPoster = async () => {
    if (submitting || submitted) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const items = categories.map((category) => ({
        category,
        productId: selectedProducts[category]._id,
        x: Number(positions[category].x.toFixed(2)),
        y: Number(positions[category].y.toFixed(2)),
      }));

      const response = await createPoster({ items });

      setSuccess(response.message || "Poster submitted successfully!");
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit poster."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedProducts) {
    return (
      <main className="fd-builder-page">
        <div className="fd-builder-empty">
          <h2>No products selected</h2>
          <p>Please select one product from each category first.</p>
          <button
            className="fd-primary-btn"
            onClick={() => navigate("/")}
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  const allProductsSelected = categories.every(
    (category) => selectedProducts[category]
  );

  if (!allProductsSelected) {
    return (
      <main className="fd-builder-page">
        <div className="fd-builder-empty">
          <h2>Incomplete product selection</h2>
          <p>Please select a Burger, Side and Drink.</p>
          <button
            className="fd-primary-btn"
            onClick={() => navigate("/")}
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="fd-builder-page">
      <section className="fd-builder-heading">
        <span className="fd-section-eyebrow">MAKE IT YOURS</span>
        <h1>Design Your Poster</h1>
        <p>
          Drag and arrange your favourite products to create your
          own food poster.
        </p>
      </section>

      <section className="fd-builder-workspace">
        <div className="fd-builder-instructions">
          <div>
            <span className="fd-instruction-icon">✥</span>
            <div>
              <strong>Arrange your products</strong>
              <p>Click and drag each product to move it around.</p>
            </div>
          </div>
          <span className="fd-product-total">3 Products</span>
        </div>

        <div className="fd-poster-frame">
          <div
            ref={canvasRef}
            className="fd-poster-canvas"
            style={{ backgroundImage: `url(${posterBackground})` }}
          >
            {categories.map((category) => (
              <DraggableProduct
                key={category}
                category={category}
                product={selectedProducts[category]}
                position={getPixelPosition(positions[category])}
                onDrag={handleDrag}
              />
            ))}
          </div>
        </div>

        <div className="fd-builder-legend">
          {categories.map((category) => (
            <div key={category} className="fd-legend-item">
              <span className="fd-legend-dot" />
              <span>{category}</span>
              <strong>{selectedProducts[category].product_name}</strong>
            </div>
          ))}
        </div>

        <div className="fd-builder-submit">
          {error && <p className="fd-builder-error">{error}</p>}
          {success && <p className="fd-builder-success">{success}</p>}

          {submitted ? (
            <button
              className="fd-primary-btn fd-submit-button"
              onClick={() => navigate("/my-poster")}
            >
              View My Poster →
            </button>
          ) : (
            <button
              className="fd-primary-btn fd-submit-button"
              onClick={handleSubmitPoster}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit My Poster →"}
            </button>
          )}

          <p>
            {submitted
              ? "Your poster has been submitted for review."
              : "Once submitted, your poster will be locked for review."}
          </p>
        </div>
      </section>
    </main>
  );
}

export default PosterBuilder;
