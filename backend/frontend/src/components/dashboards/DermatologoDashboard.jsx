// src/components/dashboards/DermatologoDashboard.jsx
import React, { useState, useEffect } from 'react';
import { animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getCurrentUser } from '../../services/authService';
import ConsultModal from '../citas/ConsultModal';

const DermatologoDashboard = ({ cardAnimation }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCita, setSelectedCita] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchCitas = async () => {
      try {
        // Filtra las citas pendientes para el doctor (estado "P")
        const response = await api.get(`/citas/?doctor=${user.id}&estado=P`, {
          signal: controller.signal,
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

  const openConsultModal = (cita) => {
    setSelectedCita(cita);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCita(null);
    setShowModal(false);
  };

  const updateCitaInList = (citaId) => {
    setCitas((prev) => prev.filter((c) => c.id !== citaId));
  };

  // Función para formatear la fecha
  const formatoFechaHora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <>
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
                      <th scope="col">Pago</th>
                      <th scope="col">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citas.map((cita) => (
                      <tr key={cita.id}>
                        <td>{formatoFechaHora(cita.fecha_hora)}</td>
                        <td>
                          {cita.paciente?.nombre} {cita.paciente?.apellidos}
                        </td>
                        <td>
                          {cita.pagos && cita.pagos.length > 0 ? (
                            cita.pagos[0].verificado ? "Verificado" : "Pendiente"
                          ) : (
                            "Sin comprobante"
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => openConsultModal(cita)}
                            className="btn btn-secondary"
                          >
                            Consultar
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
      {selectedCita && (
        <ConsultModal
          show={showModal}
          onHide={closeModal}
          cita={selectedCita}
          onActionSuccess={updateCitaInList}
        />
      )}
    </>
  );
};

export default DermatologoDashboard;
