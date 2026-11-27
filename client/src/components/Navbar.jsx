
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Navbar.css";

function Navbar({ variant = "user" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = variant === "admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={`fd-navbar ${isAdmin ? "fd-navbar-admin" : ""}`}>
      <div className="fd-navbar-container">
        <Link to={isAdmin ? "/admin/products" : "/"} className="fd-logo">
          Fan<span>Deal</span>
          <small>.</small>
        </Link>

        <nav className="fd-nav-links">
          {isAdmin ? (
            <>
              <NavLink to="/admin/products">Products</NavLink>
              <NavLink to="/admin/posters">Poster Review</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/my-poster">My Poster</NavLink>
            </>
          )}
        </nav>

        <div className="fd-nav-actions">
          {!isAdmin && user && (
            <span className="fd-nav-username">
              Hi, {user.user_name || user.name}
            </span>
          )}

          {user && (
            <button className="fd-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
