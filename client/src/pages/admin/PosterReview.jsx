
import { useEffect, useState } from "react";
import api from "../../services/api";
import posterBackground from "../../assets/poster-background.jpg";
import "./PosterReview.css";

const API_URL = "http://localhost:5000";

function PosterReview() {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        let ignore = false;

        const loadPosters = async () => {
            try {
                const response = await api.get("/posters/admin/all");

                if (!ignore) {
                    setPosters(response.data.posters || []);
                    setError("");
                }
            } catch (err) {
                console.error("Fetch posters error:", err);

                if (!ignore) {
                    setError("Failed to load submitted posters.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadPosters();

        return () => {
            ignore = true;
        };
    }, []);

    const fetchPosters = async () => {
        try {
            const response = await api.get("/posters/admin/all");
            setPosters(response.data.posters || []);
            setError("");
        } catch {
            setError("Failed to refresh submitted posters.");
        }
    };

    const handleStatusUpdate = async (posterId, status) => {
        try {
            setUpdatingId(posterId);
            setError("");

            await api.patch(`/posters/admin/${posterId}/status`, {
                status,
            });

            await fetchPosters();
        } catch (err) {
            setError(
                err.response?.data?.message || "Status update failed."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const pendingCount = posters.filter(
        (poster) => poster.status === "Pending"
    ).length;

    const approvedCount = posters.filter(
        (poster) => poster.status === "Approved"
    ).length;

    const rejectedCount = posters.filter(
        (poster) => poster.status === "Rejected"
    ).length;

    if (loading) {
        return (
            <main className="fd-poster-review">
                <div className="fd-poster-review-container">
                    <div className="fd-review-state">
                        Loading submitted posters...
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="fd-poster-review">
            <div className="fd-poster-review-container">

                <header className="fd-review-header">
                    <h1>Poster Review</h1>
                    <p>
                        Review customer posters and manage their approval status.
                    </p>
                </header>

                {/* Summary */}
                <section className="fd-review-summary">
                    <div className="fd-review-summary-card">
                        <span>Total Submissions</span>
                        <strong>{posters.length}</strong>
                    </div>

                    <div className="fd-review-summary-card">
                        <span>Pending</span>
                        <strong>{pendingCount}</strong>
                    </div>

                    <div className="fd-review-summary-card">
                        <span>Approved</span>
                        <strong>{approvedCount}</strong>
                    </div>

                    <div className="fd-review-summary-card">
                        <span>Rejected</span>
                        <strong>{rejectedCount}</strong>
                    </div>
                </section>

                {error && (
                    <div className="fd-review-state fd-review-error">
                        {error}
                    </div>
                )}

                {/* Poster submissions */}
                {posters.length === 0 ? (
                    <div className="fd-review-state">
                        No posters submitted yet.
                    </div>
                ) : (
                    <section className="fd-review-grid">
                        {posters.map((poster) => (
                            <article
                                className="fd-review-card"
                                key={poster._id}
                            >
                                {/* User details */}
                                <div className="fd-review-user">
                                    <div>
                                        <h3>
                                            {poster.user_id?.user_name || "Unknown User"}
                                        </h3>

                                        <p>
                                            {poster.user_id?.email || "Email unavailable"}
                                        </p>
                                    </div>

                                    <span
                                        className={`fd-review-status ${
                                            poster.status?.toLowerCase() || "pending"
                                        }`}
                                    >
                                        {poster.status || "Pending"}
                                    </span>
                                </div>

                                {/* Poster preview */}
                                <div
                                    className="fd-review-poster"
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
                                                src={`${API_URL}${product.image_url}`}
                                                alt={product.product_name}
                                                style={{
                                                    left: `${item.x}%`,
                                                    top: `${item.y}%`,
                                                }}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Selected products */}
                                <div className="fd-review-products">
                                    <h4>Selected Products</h4>

                                    {poster.poster_items.map((item, index) => {
                                        const product = item.productId;

                                        return (
                                            <div
                                                className="fd-review-product-row"
                                                key={product?._id || index}
                                            >
                                                {product?.image_url && (
                                                    <img
                                                        src={`${API_URL}${product.image_url}`}
                                                        alt={product.product_name}
                                                    />
                                                )}

                                                <div>
                                                    <strong>
                                                        {product?.product_name || "Product unavailable"}
                                                    </strong>

                                                    <span>
                                                        {product?.product_category || "Unknown category"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Actions */}
                                <div className="fd-review-actions">
                                    <button
                                        className="fd-review-approve"
                                        disabled={
                                            updatingId === poster._id ||
                                            poster.status === "Approved"
                                        }
                                        onClick={() =>
                                            handleStatusUpdate(
                                                poster._id,
                                                "Approved"
                                            )
                                        }
                                    >
                                        {updatingId === poster._id
                                            ? "Updating..."
                                            : "Approve Poster"}
                                    </button>

                                    <button
                                        className="fd-review-reject"
                                        disabled={
                                            updatingId === poster._id ||
                                            poster.status === "Rejected"
                                        }
                                        onClick={() =>
                                            handleStatusUpdate(
                                                poster._id,
                                                "Rejected"
                                            )
                                        }
                                    >
                                        {updatingId === poster._id
                                            ? "Updating..."
                                            : "Reject Poster"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}

export default PosterReview;
