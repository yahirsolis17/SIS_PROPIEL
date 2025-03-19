// TimeSlotSelector.jsx
import React from 'react';

const TimeSlotSelector = ({ horarios, selectedTime, onTimeChange, disabled }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Seleccione horario:</label>
      <select
        value={selectedTime}
        onChange={(e) => onTimeChange(e.target.value)}
        className="form-select"
        disabled={disabled}
      >
        <option value="">Seleccione un horario</option>
        {horarios.map(horaStr => (
          <option key={horaStr} value={horaStr}>
            {horaStr}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSlotSelector;
