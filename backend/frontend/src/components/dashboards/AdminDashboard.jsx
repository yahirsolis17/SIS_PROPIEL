import React from 'react';
import { animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ cardAnimation }) => {
  const navigate = useNavigate();

  const handleAction = (path) => {
    navigate(path);
  };

  return (
    <animated.div style={cardAnimation} className="dashboard-card">
      <div className="admin-controls">
        <button onClick={() => handleAction('/admin/usuarios')} className="admin-button">
          <i className="bi bi-people-fill"></i>
          <span>Gestión de Usuarios</span>
        </button>
        <button onClick={() => handleAction('/admin/analiticas')} className="admin-button">
          <i className="bi bi-graph-up"></i>
          <span>Analíticas</span>
        </button>
      </div>
    </animated.div>
  );
};

export default AdminDashboard;