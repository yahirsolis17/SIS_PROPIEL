import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarPicker = ({ selectedDate, onDateChange, disabled }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Seleccione fecha:</label>
      <DatePicker
        selected={selectedDate}
        onChange={date => onDateChange(date)}
        minDate={new Date()}
        dateFormat="dd/MM/yyyy"
        className="form-control"
        disabled={disabled}
        filterDate={date => date.getDay() !== 0} // Domingos => no se pueden seleccionar
      />
    </div>
  );
};

export default CalendarPicker;