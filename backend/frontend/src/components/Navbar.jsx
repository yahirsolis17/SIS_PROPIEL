import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../services/authService";
import { FiLogOut } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  // Estado para mostrar/ocultar el menú en pantallas pequeñas
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (location.state?.fromLogin) {
      toast.success("¡Inicio de sesión exitoso!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Cerrar menú si el usuario hace clic en algún link o en el botón de logout
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    toast.info(
      <div
        style={{
          background: "white",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "300px",
          width: "100%",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#333",
            marginBottom: "12px",
          }}
        >
          ¿Seguro que deseas cerrar sesión?
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <button
            onClick={() => {
              logout();
              toast.dismiss();
              navigate("/");
            }}
            style={{
              padding: "8px 14px",
              background: "linear-gradient(to right, #0086C9, #007780)",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
              transition: "opacity 0.3s ease-in-out",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Confirmar
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              padding: "8px 14px",
              background: "#e0e0e0",
              color: "#333",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
              transition: "background 0.3s ease-in-out",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#d6d6d6")}
            onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const renderNavLinks = () => {
    if (!user) return null;
    const commonStyles = "hover-underline mx-3 px-2 py-1";
    switch (user?.role?.toUpperCase()) {
      case "ADMIN":
        return (
          <>
            <Link onClick={closeMenu} className={commonStyles} to="/dashboard/admin">
              Dashboard
            </Link>
            <Link onClick={closeMenu} className={commonStyles} to="/admin/usuarios">
              Usuarios
            </Link>
            <Link onClick={closeMenu} className={commonStyles} to="/admin/reportes">
              Reportes
            </Link>
          </>
        );
      case "PACIENTE":
        return (
          <>
            <Link onClick={closeMenu} className={commonStyles} to="/dashboard/paciente">
              Mis Citas
            </Link>
            <Link onClick={closeMenu} className={commonStyles} to="/citas">
              Agendar Cita
            </Link>
            <Link onClick={closeMenu} className={commonStyles} to="/paciente/pagos">
              Pagos
            </Link>
            <Link onClick={closeMenu} className={commonStyles} to="/paciente/historial">
              Historial
            </Link>
          </>
        );
      default:
        return (
          <Link onClick={closeMenu} className={commonStyles} to="/dashboard">
            Inicio
          </Link>
        );
    }
  };

  return (
    <nav className="navbar-glass">
      <ToastContainer limit={1} newestOnTop={false} closeButton={false} />
      <div className="nav-container">
        {/* El logo no redirige a ningún lado */}
        <div className="brand-container">
          <img src={logo} alt="Logo" className="logo-hover-effect" />
          <span className="clinic-name">Pro-Piel</span>
        </div>

        {/* Botón hamburguesa (visible en móvil) */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Menú de enlaces, se oculta/abre según `menuOpen` */}
        <div className={`nav-links-container ${menuOpen ? "open" : ""}`}>
          <div className="nav-links">{renderNavLinks()}</div>

          {user && (
            <button
              className="logout-button"
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
            >
              <FiLogOut className="logout-icon" />
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
