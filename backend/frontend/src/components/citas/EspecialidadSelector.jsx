import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';

const EspecialidadSelector = ({ especialidades, selectedEspecialidad, onChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Seleccione especialidad:</label>
      <select
        value={selectedEspecialidad}
        onChange={(e) => onChange(e.target.value)}
        className="form-select"
      >
        <option value="">Seleccione una especialidad</option>
        {especialidades.map(especialidad => (
          <option key={especialidad.id} value={especialidad.id}>
            {especialidad.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EspecialidadSelector;