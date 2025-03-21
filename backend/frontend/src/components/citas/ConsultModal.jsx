// src/components/dashboards/ConsultModal.jsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../../services/api';

const ConsultModal = ({ show, onHide, cita, onActionSuccess }) => {
  const [accion, setAccion] = useState(''); // "confirmar" o "cancelar"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async () => {
    if (!accion) {
      setError('Seleccione una acción.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post(`/citas/${cita.id}/confirmar/`, { accion });
      onActionSuccess(cita.id);
      onHide();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al ejecutar la acción');
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha de pago si existe
  const formatoFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-ES');
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Cita</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Datos del Paciente</h5>
        <p>
          <strong>Nombre:</strong> {cita.paciente?.nombre} {cita.paciente?.apellidos}
        </p>
        <p>
          <strong>Edad:</strong> {cita.paciente?.edad}
        </p>
        <p>
          <strong>Sexo:</strong> {cita.paciente?.sexo}
        </p>
        <p>
          <strong>Peso:</strong> {cita.paciente?.peso}
        </p>
        <p>
          <strong>Teléfono:</strong> {cita.paciente?.telefono}
        </p>
        <hr />
        <h5>Comprobante de Pago</h5>
        {cita.pagos && cita.pagos.length > 0 ? (
          <>
            <img
            src={cita.pagos[0].comprobante}
            alt="Comprobante"
            style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
            />
            <p>
              <strong>Total:</strong> ${cita.pagos[0].total}
            </p>
            <p>
              <strong>Pagado:</strong> ${cita.pagos[0].pagado}
            </p>
            <p>
              <strong>Verificado:</strong> {cita.pagos[0].verificado ? 'Sí' : 'No'}
            </p>
            {cita.pagos[0].fecha && (
              <p>
                <strong>Fecha de pago:</strong> {formatoFecha(cita.pagos[0].fecha)}
              </p>
            )}
          </>
        ) : (
          <p>No se encontró comprobante.</p>
        )}
        <hr />
        <div className="mb-3">
          <label className="form-label">Acción:</label>
          <select
            className="form-select"
            value={accion}
            onChange={(e) => setAccion(e.target.value)}
          >
            <option value="">Seleccione una acción</option>
            <option value="confirmar">Confirmar Cita</option>
            <option value="cancelar">Cancelar Cita</option>
          </select>
        </div>
        {error && <div className="text-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleAction} disabled={loading || !accion}>
          {loading ? 'Ejecutando...' : 'Ejecutar Acción'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConsultModal;
