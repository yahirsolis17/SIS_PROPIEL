// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { getCurrentUser, verifyAuth } from "../services/authService";
import api from '../services/api';
import Navbar from '../components/Navbar';
import "./PaymentPage.css";

const PaymentPage = () => {
  const { citaId } = useParams();
  const user = getCurrentUser();
  const navigate = useNavigate();

  const [comprobante, setComprobante] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar autenticación con JWT, similar a otros componentes
  useEffect(() => {
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const valid = await verifyAuth();
        if (!valid) {
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
        }
      }
    };

    if (user) checkAuth();
    return () => controller.abort();
  }, [user, navigate]);

  if (!user) return <Navigate to="/login" replace />;

  // Función para manejar la selección del archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setComprobante(file);
    } else {
      alert("Solo se permiten imágenes (PNG, JPG o JPEG)");
    }
  };

  // Función para enviar el comprobante al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comprobante) {
      setError("Debe subir un comprobante");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("cita", citaId);
      formData.append("comprobante", comprobante);

      // Obtener el token JWT almacenado y agregarlo a la cabecera
      const token = localStorage.getItem("token");

      const response = await api.post("pagos/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      console.log("Pago creado:", response.data);
      if (response.status === 201) {
        // Redirigir al dashboard del paciente u otra página de confirmación
        navigate("/dashboard/paciente");
      }
    } catch (err) {
      console.error("Error al subir el comprobante:", err.response || err);
      setError(err.response?.data?.error || "Error al subir el comprobante.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="citas-container" style={{ paddingTop: "100px" }}>
        <div className="cita-form-card">
          <h2 className="citas-title">Subir Comprobante de Pago</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} className="cita-form">
            <div className="mb-3">
              <label className="form-label">Subir comprobante de pago (Imagen):</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="form-control"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn-payment-submit"
              disabled={loading || !comprobante}
            >
              {loading ? "Subiendo..." : "Subir Comprobante"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
