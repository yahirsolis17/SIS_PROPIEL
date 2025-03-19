// src/components/dashboards/PacienteDashboard.jsx
import React, { useState, useEffect } from 'react';
import { animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getCurrentUser } from '../../services/authService';

const PacienteDashboard = ({ cardAnimation }) => {
  const [citas, setCitas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [resCitas, resPagos] = await Promise.all([
          api.get(`/citas/?paciente=${user.id}`, { signal: controller.signal }),
          api.get(`/pagos/?paciente=${user.id}`, { signal: controller.signal })
        ]);
        setCitas(resCitas.data);
        setPagos(resPagos.data);
      } catch (err) {
        if (!controller.signal.aborted) {
          if (err.response?.status === 401) navigate('/login');
          setError('Error cargando datos');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchData();
    return () => controller.abort();
  }, [user, navigate]);

  const formatoFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    // Ejemplo de formateo en español (puedes ajustarlo a tu gusto)
    return fecha.toLocaleString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <animated.div style={cardAnimation} className="dashboard-card">
      {loading ? (
        <div className="loading-spinner">Cargando...</div>
      ) : error ? (
        <div className="error-message text-danger">{error}</div>
      ) : (
        <>
          <section className="mb-4">
            <h3 className="mb-3">Mis Próximas Citas</h3>
            {citas.length ? (
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Especialidad</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Doctor</th>
                      <th scope="col">Fecha y Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citas.map((cita) => (
                      <tr key={cita.id}>
                        <td>{cita.especialidad?.nombre || 'Sin especialidad'}</td>
                        <td>{cita.estado}</td>
                        <td>Dr. {cita.doctor?.nombre || 'N/A'}</td>
                        <td>{formatoFecha(cita.fecha_hora)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No tienes citas programadas.</p>
            )}
          </section>

          <section>
            <h3 className="mb-3">Estado de Pagos</h3>
            {pagos.length ? (
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Total</th>
                      <th scope="col">Pagado</th>
                      <th scope="col">Verificado</th>
                      <th scope="col">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map((pago) => (
                      <tr key={pago.id}>
                        <td>${pago.total}</td>
                        <td>${pago.pagado}</td>
                        <td>{pago.verificado ? 'Sí' : 'No'}</td>
                        <td>{new Date(pago.fecha).toLocaleDateString('es-MX')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No hay pagos registrados.</p>
            )}
          </section>
        </>
      )}
    </animated.div>
  );
};

export default PacienteDashboard;
