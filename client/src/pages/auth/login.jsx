
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/useAuth";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const data = await loginUser(formData);

        login(data.token, data.user);

        navigate("/", { replace: true });
    } catch (err) {
        setError(
            err.response?.data?.message || "Login failed. Please try again."
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
                    <h1>Welcome Back!</h1>
                    <p>Login to continue creating your FanDeal poster.</p>
                </header>

                <form className="fd-auth-form" onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        className="fd-auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {error && (
                    <p className="fd-auth-message fd-auth-error" role="alert">
                        {error}
                    </p>
                )}

                <div className="fd-auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </section>
        </main>
    );
}

export default Login;
