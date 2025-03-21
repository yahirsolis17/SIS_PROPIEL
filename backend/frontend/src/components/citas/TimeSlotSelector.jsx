// src/components/citas/TimeSlotSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import "./TimeSlotSelector.css";

const TimeSlotSelector = ({ horarios, selectedTime, onTimeChange, disabled }) => {
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef(null);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (hora) => {
    onTimeChange(hora);
    setShowOptions(false);
  };

  return (
    <div className="time-slot-selector" ref={containerRef}>
      <div className="slot-row">
        <label className="slot-label">Seleccione horario:</label>
        
        {/* Contenedor relativo que mantiene el input y el dropdown alineados */}
        <div className="slot-wrapper">
          <div 
            className={`slot-input ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && setShowOptions(!showOptions)}
          >
            {selectedTime || "Seleccione un horario"}
          </div>

          {showOptions && (
            <div className="options-dropdown">
              {horarios.map((hora) => (
                <div 
                  key={hora} 
                  className="option-item" 
                  onClick={() => handleSelect(hora)}
                >
                  {hora}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
