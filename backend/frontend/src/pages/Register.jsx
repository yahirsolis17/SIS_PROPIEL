import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerPatient } from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Register.css";
import logo from "../assets/logo.png";
import { LoadingSpinner } from "../components/LoadingSpinner";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    edad: "",
    sexo: "",
    peso: "",
    telefono: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (formData.password !== formData.password2) {
      setErrors({ password2: "Las contraseñas no coinciden" });
      setLoading(false);
      return;
    }

    try {
      await registerPatient(formData);
      navigate("/login");
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <img src={logo} alt="Logo" className="register-logo" />
          <h2 className="register-title">Registrar Paciente</h2>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                placeholder="Nombre/s"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
            </div>

            <div className="form-group">
              <input
                type="text"
                className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
                placeholder="Apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
              {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="number"
                className={`form-control ${errors.edad ? "is-invalid" : ""}`}
                placeholder="Edad"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                min="18"
                max="120"
                required
              />
              {errors.edad && <div className="invalid-feedback">{errors.edad}</div>}
            </div>

            <div className="form-group">
              <select
                className={`form-control ${errors.sexo ? "is-invalid" : ""}`}
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                required
              >
                <option value="">Sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.sexo && <div className="invalid-feedback">{errors.sexo}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="number"
                className={`form-control ${errors.peso ? "is-invalid" : ""}`}
                placeholder="Peso (kg)"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                step="0.1"
                min="30"
                max="300"
              />
              {errors.peso && <div className="invalid-feedback">{errors.peso}</div>}
            </div>

            <div className="form-group">
              <input
                type="text"
                className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                placeholder="Número Telefónico"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                pattern="[0-9]{10}"
                required
              />
              {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="form-group">
              <input
                type="password"
                className={`form-control ${errors.password2 ? "is-invalid" : ""}`}
                placeholder="Confirmar Contraseña"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
              />
              {errors.password2 && <div className="invalid-feedback">{errors.password2}</div>}
            </div>
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              'Registrar'
            )}
          </button>
        </form>

        <div className="register-footer">
          <span>¿Ya tienes una cuenta? </span>
          <a href="/login" className="login-link">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
};

export default Register;