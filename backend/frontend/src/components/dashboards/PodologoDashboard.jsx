import React, { useState, useEffect } from 'react';
import { animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getCurrentUser } from '../../services/authService';

const PodologoDashboard = ({ cardAnimation }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchHistorial = async () => {
      try {
        const response = await api.get(`/citas/?doctor=${user.id}&estado=C`, {
          signal: controller.signal
        });
        setHistorial(response.data);
      } catch (err) {
        if (!controller.signal.aborted) {
          if (err.response?.status === 401) navigate('/login');
          setError('Error al cargar historial');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchHistorial();
    return () => controller.abort();
  }, [user, navigate]);

  return (
    <animated.div style={cardAnimation} className="dashboard-card">
      {loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="historial-container">
          <h3>Historial Clínico</h3>
          {historial.map(consulta => (
            <div key={consulta.id} className="consulta-card">
              <div className="consulta-header">
                <span>{new Date(consulta.fecha_hora).toLocaleDateString()}</span>
                <span>{consulta.paciente.nombre}</span>
              </div>
              <div className="consulta-body">
                <p>{consulta.diagnostico || 'Sin diagnóstico registrado'}</p>
                <button className="action-button">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </animated.div>
  );
};

export default PodologoDashboard;