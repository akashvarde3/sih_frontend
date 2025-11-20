import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, setLocale, language, t } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(v => !v);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  const languageToggle = () => setLocale(language === "en" ? "hi" : "en");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand" to="/">{t("heroTitle")}</Link>
        <button className="navbar-toggler" onClick={toggleMenu} type="button" aria-label="Toggle menu">
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/" onClick={closeMenu}>{t("home")}</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/contact" onClick={closeMenu}>{t("contact")}</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/login" onClick={closeMenu}>{t("login")}</Link></li>
              </>
            ) : (
              <>
                {user.role === "admin" ? (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/admin-dashboard" onClick={closeMenu}>{t("adminDashboard")}</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/contact" onClick={closeMenu}>{t("contact")}</Link></li>
                  </>
                ) : (
                  <>
                    {user.role === "teacher" && <li className="nav-item"><Link className="nav-link" to="/teacher-dashboard" onClick={closeMenu}>{t("teacherDashboard")}</Link></li>}
                    {user.role === "student" && <li className="nav-item"><Link className="nav-link" to="/student-dashboard" onClick={closeMenu}>{t("studentDashboard")}</Link></li>}
                    <li className="nav-item"><Link className="nav-link" to="/plot-registration" onClick={closeMenu}>{t("plotRegistration")}</Link></li>
                  </>
                )}
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={handleLogout}>{t("logout")}</button>
                </li>
              </>
            )}
            <li className="nav-item ms-2">
              <button className="btn btn-sm btn-light" onClick={languageToggle} aria-label="Toggle language">
                {language === "en" ? "हिन्दी" : "English"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;