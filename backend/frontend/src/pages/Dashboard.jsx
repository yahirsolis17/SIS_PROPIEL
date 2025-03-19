import { useEffect } from 'react';
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useSpring, animated } from '@react-spring/web';
import { getCurrentUser, verifyAuth } from "../services/authService";
import Navbar from "../components/Navbar";
import BlurText from "../components/dashboards/BlurText";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import PacienteDashboard from "../components/dashboards/PacienteDashboard";
import DermatologoDashboard from "../components/dashboards/DermatologoDashboard";
import PodologoDashboard from "../components/dashboards/PodologoDashboard";
import TamizDashboard from "../components/dashboards/TamizDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

const Dashboard = () => {
  const { role: urlRole } = useParams();
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const valid = await verifyAuth();
        if (!valid) {
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
        }
      }
    };

    if (user) checkAuth();
    return () => controller.abort();
  }, [user, navigate]);

  if (!user) return <Navigate to="/login" replace />;

  const role = user?.role || urlRole;

  const [headerAnimation, cardAnimation] = useSpring(() => ({
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 25 },
  }));

  const renderDashboard = () => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return <AdminDashboard cardAnimation={cardAnimation} />;
      case "PACIENTE":
        return <PacienteDashboard cardAnimation={cardAnimation} />;
      case "DERMATOLOGO":
        return <DermatologoDashboard cardAnimation={cardAnimation} />;
      case "PODOLOGO":
        return <PodologoDashboard cardAnimation={cardAnimation} />;
      case "TAMIZ":
        return <TamizDashboard cardAnimation={cardAnimation} />;
      default:
        return (
          <animated.div style={cardAnimation} className="dashboard-card">
            <h2 className="text-center text-muted">No tienes un dashboard asignado</h2>
          </animated.div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar user={user} />

      <animated.div
        style={{ ...headerAnimation, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        className="header-section my-4"
      >
        <BlurText
          text={`Bienvenido, ${user?.nombre || ''}`}
          delay={80}
          className="welcome-title"
        />
        {/* Aquí agregamos el rol del usuario debajo del nombre */}
        <animated.p
          style={{
            ...headerAnimation,
            fontSize: '1.2rem',
            color: '#fff',
            marginTop: '8px',
            backgroundColor: '#ffffff22',
            padding: '8px 20px',
            borderRadius: '30px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        >
          {user?.role === 'PACIENTE' && 'Paciente'}
          {user?.role === 'DERMATOLOGO' && 'Dermatólogo'}
          {user?.role === 'PODOLOGO' && 'Podólogo'}
          {user?.role === 'TAMIZ' && 'Tamiz'}
        </animated.p>
      </animated.div>

      <div className="container dashboard-content">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
