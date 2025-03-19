import React from 'react';

const PaymentUpload = ({ onFileChange, disabled }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Validamos que el archivo sea de tipo imagen
    if (file && file.type.startsWith('image/')) {
      onFileChange(file);
    } else {
      alert("Solo se permiten imágenes (PNG, JPG o JPEG)");
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">Subir comprobante de pago (Imagen):</label>
      <input 
        type="file" 
        accept="image/*"  // Acepta todos los formatos de imagen
        onChange={handleFileChange}
        className="form-control"
        disabled={disabled}
      />
    </div>
  );
};

export default PaymentUpload;
