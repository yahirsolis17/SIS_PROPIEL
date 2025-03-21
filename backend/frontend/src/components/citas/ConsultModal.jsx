// ConsultModal.jsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FiUser, FiDollarSign, FiAlertCircle, FiCamera, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';
import "./ConsultModal.css";

const ConsultModal = ({ show, onHide, cita, onActionSuccess }) => {
  const [accion, setAccion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async () => {
    if (!accion) {
      setError('Por favor selecciona una acción');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post(`/citas/${cita.id}/confirmar/`, { accion });
      onActionSuccess(cita.id);
      onHide();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la acción');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="consult-modal-dialog">
      <Modal.Header closeButton className="consult-modal-header">
        <Modal.Title>
          <div className="section-title-icon">
            <FiUser size={24} />
          </div>
          Detalles de la Cita Médica
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="consult-modal-body">
        <div className="consult-grid">
          {/* Sección Paciente */}
          <div className="consult-section">
            <h5 className="section-title">
              <div className="section-title-icon">
                <FiUser size={20} />
              </div>
              Información del Paciente
            </h5>
            
            <div className="patient-details-grid">
              <div className="detail-item">
                <span className="detail-label">
                  <FiChevronRight />
                  Nombre completo
                </span>
                <span className="detail-value">
                  {cita.paciente?.nombre || 'N/A'} {cita.paciente?.apellidos}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <FiChevronRight />
                  Edad
                </span>
                <span className="detail-value">
                  {cita.paciente?.edad || 'N/A'} años
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <FiChevronRight />
                  Sexo
                </span>
                <span className="detail-value">
                  {cita.paciente?.sexo || 'N/A'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <FiChevronRight />
                  Teléfono
                </span>
                <span className="detail-value">
                  {cita.paciente?.telefono || 'N/A'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <FiChevronRight />
                  Peso
                </span>
                <span className="detail-value">
                  {cita.paciente?.peso ? `${cita.paciente.peso} kg` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Sección Pago */}
          <div className="consult-section">
            <h5 className="section-title">
              <div className="section-title-icon">
                <FiDollarSign size={20} />
              </div>
              Detalles de Pago
            </h5>
            
            {cita.pagos?.length > 0 ? (
              <>
                <div className="comprobante-container">
                  <img
                    src={cita.pagos[0].comprobante}
                    alt="Comprobante de pago"
                    className="comprobante-img"
                  />
                </div>
                
                <div className="payment-details-grid">
                  <div className="payment-item">
                    <span className="payment-label">Total:</span>
                    <span className="payment-value">${cita.pagos[0].total}</span>
                  </div>
                  
                  <div className="payment-item">
                    <span className="payment-label">Pagado:</span>
                    <span className="payment-value">${cita.pagos[0].pagado}</span>
                  </div>
                  
                  <div className="payment-item">
                    <span className="payment-label">Estado:</span>
                    <span 
                      className="payment-value" 
                      style={{ color: cita.pagos[0].verificado ? '#28a745' : '#dc3545' }}
                    >
                      {cita.pagos[0].verificado ? 'Verificado' : 'Pendiente'}
                    </span>
                  </div>
                  
                  {cita.pagos[0].fecha && (
                    <div className="payment-item">
                      <span className="payment-label">Fecha pago:</span>
                      <span className="payment-value">{formatDate(cita.pagos[0].fecha)}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <FiCamera size={48} color="#ccc" />
                <p className="text-muted mt-2">No se encontró comprobante</p>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Acciones */}
        <div className="action-container">
          <div className="action-header">
            <div className="section-title-icon">
              <FiAlertCircle size={24} />
            </div>
            <h5 className="section-title">Acciones Disponibles</h5>
          </div>
          
          <select
            className="form-select action-select"
            value={accion}
            onChange={(e) => setAccion(e.target.value)}
            disabled={loading}
          >
            <option value="">Seleccionar acción...</option>
            <option value="confirmar">✅ Confirmar Cita</option>
            <option value="cancelar">❌ Cancelar Cita</option>
          </select>
          
          {error && (
            <div className="error-message mt-3">
              <FiAlertCircle /> {error}
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="consult-modal-footer">
        <Button
          variant="secondary"
          className="btn-modal"
          onClick={onHide}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button
          variant="primary"
          className="btn-modal"
          onClick={handleAction}
          disabled={loading || !accion}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Procesando...
            </>
          ) : (
            'Confirmar Acción'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConsultModal;