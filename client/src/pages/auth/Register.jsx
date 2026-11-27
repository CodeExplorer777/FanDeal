
import { useState } from "react";
import { Link,useNavigate  } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user_name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const data = await registerUser(formData);

            setMessage(data.message || "Registration successful!");

            setFormData({
                user_name: "",
                email: "",
                password: "",
            });
            navigate("/login", { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="fd-auth-page">
            <section className="fd-auth-card">
                <div className="fd-auth-logo">
                    Fan<span>Deal</span>
                </div>

                <header className="fd-auth-heading">
                    <h1>Create Your Account</h1>
                    <p>Join FanDeal and start creating your own posters.</p>
                </header>

                <form className="fd-auth-form" onSubmit={handleSubmit}>
                    <div className="fd-auth-field">
                        <label htmlFor="user_name">Full Name</label>
                        <input
                            id="user_name"
                            type="text"
                            name="user_name"
                            placeholder="Enter your full name"
                            value={formData.user_name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="fd-auth-field">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="fd-auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />
                    </div>

                    <button
                        className="fd-auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                {message && (
                    <p className="fd-auth-message fd-auth-success" role="status">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="fd-auth-message fd-auth-error" role="alert">
                        {error}
                    </p>
                )}

                <div className="fd-auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </section>
        </main>
    );
}

export default Register;
