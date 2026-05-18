import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function NavBar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="topbar">
      <div className="brand">
        <Link to="/">LearnLog</Link>
      </div>
      <nav>
        {!loading && user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/journals">Journals</Link>
            <Link to="/profile">Profile</Link>
            <button type="button" className="link-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
