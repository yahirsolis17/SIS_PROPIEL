// src/components/citas/CalendarPicker.jsx
import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import "./CalendarPicker.css";

registerLocale('es', es); // Registro del idioma español

const CalendarPicker = ({ selectedDate, onDateChange, disabled }) => {
  // Definimos una clase adicional si está deshabilitado, para replicar la lógica
  const inputClass = disabled
    ? "form-control datepicker-disabled"
    : "form-control";

  return (
    <div className="mb-3">
      <label className="form-label">Seleccione una fecha:</label>
      <DatePicker
        selected={selectedDate}
        onChange={date => onDateChange(date)}
        minDate={new Date()}
        dateFormat="dd/MM/yyyy"
        className={inputClass}      // Usamos la clase condicional
        disabled={disabled}
        filterDate={date => date.getDay() !== 0}
        locale="es"
        popperPlacement="bottom-start"
        portalId="root-portal"       // Renderiza el calendario fuera de su contenedor padre
      />
    </div>
  );
};

export default CalendarPicker;
