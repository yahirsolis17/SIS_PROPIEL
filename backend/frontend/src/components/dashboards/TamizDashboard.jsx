import React, { useState, useEffect } from 'react';
import { animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TamizDashboard = ({ cardAnimation }) => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchResultados = async () => {
      try {
        const response = await api.get('/resultados/', {
          signal: controller.signal
        });
        setResultados(response.data);
      } catch (err) {
        if (!controller.signal.aborted) {
          if (err.response?.status === 401) navigate('/login');
          setError('Error al cargar resultados');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
    return () => controller.abort();
  }, [navigate]);

  return (
    <animated.div style={cardAnimation} className="dashboard-card">
      {loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="resultados-container">
          <h3>Resultados de Tamizaje</h3>
          <div className="resultados-grid">
            {resultados.map(resultado => (
              <div key={resultado.id} className="resultado-card">
                <div className="resultado-header">
                  <span>{resultado.paciente.nombre}</span>
                  <span className={`prioridad ${resultado.prioridad}`}>
                    {resultado.prioridad}
                  </span>
                </div>
                <div className="resultado-body">
                  <p>{resultado.observaciones}</p>
                  <button className="action-button">
                    Ver Reporte
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </animated.div>
  );
};

export default TamizDashboard;