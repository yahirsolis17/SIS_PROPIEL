import React, { useState, useEffect } from 'react';
import { animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getCurrentUser } from '../../services/authService';

const DermatologoDashboard = ({ cardAnimation }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchCitas = async () => {
      try {
        // Filtra las citas pendientes para el doctor con id = user.id
        const response = await api.get(`/citas/?doctor=${user.id}&estado=P`, {
          signal: controller.signal
        });
        setCitas(response.data);
      } catch (err) {
        if (!controller.signal.aborted) {
          if (err.response?.status === 401) navigate('/login');
          setError('Error al cargar citas: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchCitas();
    return () => controller.abort();
  }, [user, navigate]);

  const handleConsulta = async (citaId) => {
    try {
      // Llamada al endpoint para confirmar la cita
      await api.post(`/citas/${citaId}/confirmar/`);
      // Se quita la cita confirmada de la lista
      setCitas((prev) => prev.filter((c) => c.id !== citaId));
    } catch (err) {
      setError('Error al confirmar cita');
    }
  };

  // Función para formatear fecha y hora
  const formatoFechaHora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <animated.div style={cardAnimation} className="dashboard-card">
      {loading ? (
        <div className="loading-spinner">Cargando...</div>
      ) : error ? (
        <div className="error-message text-danger">{error}</div>
      ) : (
        <section className="citas-section">
          <h3 className="mb-3">Citas Pendientes ({citas.length})</h3>
          {citas.length ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead>
                  <tr>
                    <th scope="col">Fecha y Hora</th>
                    <th scope="col">Paciente</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map((cita) => (
                    <tr key={cita.id}>
                      <td>{formatoFechaHora(cita.fecha_hora)}</td>
                      <td>{cita.paciente?.nombre} {cita.paciente?.apellidos}</td>
                      <td>
                        <button
                          onClick={() => handleConsulta(cita.id)}
                          className="btn btn-primary"
                        >
                          Iniciar Consulta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay citas pendientes.</p>
          )}
        </section>
      )}
    </animated.div>
  );
};

export default DermatologoDashboard;
