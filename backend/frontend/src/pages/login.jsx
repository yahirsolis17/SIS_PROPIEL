// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import logo from "../assets/logo.png";
import { LoadingSpinner } from "../components/LoadingSpinner";

const Login = () => {
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
      const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        particle.style.setProperty('--particle-size', `${Math.random() * 3 + 2}px`);
  
        const randomXStart = Math.random() * 100 + 'vw';
        const randomYStart = Math.random() * 100 + 'vh';
        const randomXMid = Math.random() * 100 + 'vw';
        const randomYMid = Math.random() * 100 + 'vh';
        const randomXEnd = Math.random() * 100 + 'vw';
        const randomYEnd = Math.random() * 100 + 'vh';
  
        particle.style.setProperty('--random-x-start', randomXStart);
        particle.style.setProperty('--random-y-start', randomYStart);
        particle.style.setProperty('--random-x-mid', randomXMid);
        particle.style.setProperty('--random-y-mid', randomYMid);
        particle.style.setProperty('--random-x-end', randomXEnd);
        particle.style.setProperty('--random-y-end', randomYEnd);
  
        document.querySelector('.register-container').appendChild(particle);
  
        particle.addEventListener('animationend', () => {
          particle.remove();
        });
      };
  
      const particleInterval = setInterval(createParticle, 400);
      return () => clearInterval(particleInterval);
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Llamada al servicio de login (ya retorna { user, access, refresh })
      const data = await login(telefono, password);
      // data => { user, access, refresh }

      // Guardar tokens y user en localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // Redirección según rol
      const rolePath = data.user.role?.toLowerCase() || 'paciente';
      navigate(`/dashboard/${rolePath}`);

    } catch (err) {
      // err contiene { telefono, password, nonField }
      setErrors({
        telefono: err.telefono || err.nonField || "Credenciales inválidas",
        password: err.password || ""
      });
      console.error("Error en login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2 className="login-title">Iniciar Sesión</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Número de teléfono</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{10}"
              className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
              value={telefono}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setTelefono(onlyDigits);
              }}
              required
              placeholder="10 dígitos sin espacios"
            />
            {errors.telefono && (
              <div className="invalid-feedback">{errors.telefono}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="5"
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="login-button btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" variant="light" />
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="login-footer mt-3">
          <span className="text-muted">¿Primera vez aquí? </span>
          <button
            onClick={() => navigate("/register")}
            className="btn btn-link p-0"
          >
            Crea una cuentaa
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
