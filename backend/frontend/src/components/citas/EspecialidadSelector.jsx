// src/components/citas/EspecialidadSelector.jsx
import React from 'react';
import "./EspecialidadSelector.css";

const EspecialidadSelector = ({ especialidades, selectedEspecialidad, onChange }) => {
  return (
    <div className="especialidad-selector mb-3">
      <label className="form-label">Seleccione una especialidad:</label>
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
