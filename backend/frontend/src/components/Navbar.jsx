import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import { FiLogOut } from "react-icons/fi";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
  };

  const renderNavLinks = () => {
    if (!user) return null;

    const commonStyles = "hover-underline mx-3 px-2 py-1";
    
    switch (user?.role?.toUpperCase()) { // Corregido acceso directo al role
      case "ADMIN":
        return (
          <>
            <Link className={commonStyles} to="/dashboard/admin">Dashboard</Link>
            <Link className={commonStyles} to="/admin/usuarios">Usuarios</Link>
            <Link className={commonStyles} to="/admin/reportes">Reportes</Link>
          </>
        );
      case "PACIENTE":
        return (
          <>
            <Link className={commonStyles} to="/dashboard/paciente">Mis Citas</Link>
            <Link className={commonStyles} to="/citas">Agendar Cita</Link> {/* Nuevo enlace */}
            <Link className={commonStyles} to="/paciente/pagos">Pagos</Link>
            <Link className={commonStyles} to="/paciente/historial">Historial</Link>
          </>
        );
      case "DERMATOLOGO":
        return (
          <>
            <Link className={commonStyles} to="/dashboard/dermatologo">Citas</Link>
            <Link className={commonStyles} to="/dermatologo/pacientes">Pacientes</Link>
          </>
        );
      case "PODOLOGO":
        return (
          <>
            <Link className={commonStyles} to="/dashboard/podologo">Consultas</Link>
            <Link className={commonStyles} to="/podologo/expedientes">Expedientes</Link>
          </>
        );
      case "TAMIZ":
        return (
          <>
            <Link className={commonStyles} to="/dashboard/tamiz">Resultados</Link>
            <Link className={commonStyles} to="/tamiz/seguimientos">Seguimientos</Link>
          </>
        );
      default:
        return <Link className={commonStyles} to="/dashboard">Inicio</Link>;
    }
  };

  return (
    <nav className="navbar-glass">
      <div className="nav-container">
        <Link to="/" className="brand-container">
          <img 
            src={logo} 
            alt="Logo" 
            className="logo-hover-effect"
          />
          <span className="clinic-name">Pro-Piel</span>
        </Link>

        <div className="nav-links-container">
          <div className="nav-links">{renderNavLinks()}</div>
          {user && (
            <button 
              className="logout-button" 
              onClick={handleLogout}
            >
              <FiLogOut className="logout-icon" />
              Cerrar Sesión
            </button>
          )}
        </div>

        <input type="checkbox" id="nav-toggle" className="nav-toggle" />
        <label htmlFor="nav-toggle" className="nav-toggle-label">
          <span className="hamburger"></span>
        </label>
        
        <div className="mobile-menu">
          <div className="mobile-links">{renderNavLinks()}</div>
          {user && (
            <button 
              className="logout-button mobile-logout" 
              onClick={handleLogout}
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