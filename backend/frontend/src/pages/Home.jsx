import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import logo from "../assets/logo.png";
import dermatologia from "../assets/dermatologia.jpg";
import tamiz from "../assets/tamiz.jpg";
import podologia from "../assets/podologia.jpg";

const servicesData = [
  {
    id: 1,
    title: "Dermatología Clínica",
    shortDesc: "Diagnóstico y tratamiento de enfermedades cutáneas con abordaje multidisciplinario",
    longDesc:
      "Ofrecemos diagnóstico y tratamiento integral para una gran variedad de afecciones de la piel, incluyendo acné, psoriasis, dermatitis, entre otras. Nuestro equipo de especialistas utiliza tecnología de vanguardia para garantizar la atención que mereces.",
    image: dermatologia,
  },
  {
    id: 2,
    title: "Tamiz Neonatal",
    shortDesc: "Tecnología de punta para detección temprana de alteraciones metabólicas",
    longDesc:
      "Nuestro tamiz neonatal incluye un amplio espectro de pruebas para detectar a tiempo alteraciones congénitas y metabólicas. Esto permite iniciar tratamientos oportunos para asegurar un desarrollo saludable.",
    image: tamiz,
  },
  {
    id: 3,
    title: "Podología Avanzada",
    shortDesc: "Soluciones integrales para salud podológica y ortopedia especializada",
    longDesc:
      "Contamos con servicios especializados para el cuidado de tus pies, incluyendo la prevención y tratamiento de uñas encarnadas, juanetes y otras condiciones. Nuestro enfoque busca el bienestar integral y la corrección postural.",
    image: podologia,
  },
];

const Home = () => {
  const navigate = useNavigate();

  const [activeService, setActiveService] = useState(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.reveal');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight * 0.8) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const navbar = document.querySelector('.navbar-glass');
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openServiceModal = (service) => {
    setActiveService(service);
  };

  const closeServiceModal = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setActiveService(null);
    }, 400);
  };

  return (
    <div className="home-page">
      <nav className="navbar navbar-expand-lg fixed-top navbar-glass">
        <div className="container">
          <div
            className="navbar-brand hover-scale"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img src={logo} alt="Logo" className="logo-img" />
            <h4 className="clinic-name">Pro-Piel</h4>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item hover-underline">
                <a className="nav-link" href="#servicios">
                  Servicios
                </a>
              </li>
              <li className="nav-item hover-underline">
                <a className="nav-link" href="#nosotros">
                  Nosotros
                </a>
              </li>
              <li className="nav-item hover-underline">
                <a className="nav-link" href="#contacto">
                  Contacto
                </a>
              </li>
              <li className="nav-item">
                <button
                  className="btn-appointment ms-lg-4"
                  onClick={() => navigate("/login")}
                >
                  <span>Acceder al Sistema</span>
                  <div className="liquid"></div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content reveal">
          <h1 className="hero-title">Excelencia en Salud Dermatológica</h1>
          <p className="hero-subtitle">
            Cuidado especializado con tecnología de vanguardia
          </p>
          <button className="btn-cta pulse" onClick={() => navigate("/login")}>
            Agenda tu Consulta
          </button>
        </div>
        <div className="hero-overlay"></div>
      </section>

      <section id="servicios" className="services-section">
        <div className="container">
          <h2 className="section-title reveal">Nuestros Servicios</h2>
          <div className="services-grid">
            {servicesData.map((service) => (
              <div
                key={service.id}
                className="service-card reveal"
                onClick={() => openServiceModal(service)}
              >
                <div className="card-image">
                  <img src={service.image} alt={service.title} />
                  <div className="card-overlay"></div>
                </div>
                <div className="card-content">
                  <h3>{service.title}</h3>
                  <p>{service.shortDesc}</p>
                  <div className="card-cta">Saber más →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="about-section">
        <div className="container reveal">
          <h2 className="section-title">Acerca de Nosotros</h2>
          <p className="about-text">
            En <strong>Pro-Piel</strong>, nuestro compromiso es brindar atención
            médica especializada en el cuidado de la piel, con un enfoque
            integral que combina la experiencia clínica con la tecnología más
            avanzada. Con más de 10 años de trayectoria, nos apasiona velar por
            tu salud dermatológica y la de toda tu familia.
          </p>
        </div>
      </section>

      {/* Diferenciadores */}
      <section className="differentiators">
        <div className="container">
          <div className="differentiator-card reveal">
            <div className="icon-box">
              <i className="bi bi-shield-check"></i>
            </div>
            <h4>Certificaciones Internacionales</h4>
            <p>Estándares de calidad avalados por la ISD</p>
          </div>
          <div className="differentiator-card reveal">
            <div className="icon-box">
              <i className="bi bi-robot"></i>
            </div>
            <h4>Tecnología de Punta</h4>
            <p>Equipamiento dermatológico de última generación</p>
          </div>
          <div className="differentiator-card reveal">
            <div className="icon-box">
              <i className="bi bi-heart-pulse"></i>
            </div>
            <h4>Enfoque Preventivo</h4>
            <p>Programas personalizados de cuidado preventivo</p>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="contact-section">
        <div className="contact-form reveal">
          <h2 className="form-title">Programa tu Consulta</h2>
          <form>
            <div className="input-group">
              <input type="text" placeholder="Nombre completo" className="form-input" />
            </div>
            <div className="input-group">
              <input type="tel" placeholder="Teléfono" className="form-input" />
            </div>
            <button className="btn-submit" type="submit">
              Solicitar Llamada
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </button>
          </form>
        </div>
        <div className="map-container reveal">
          <iframe
            title="Ubicación"
            className="map-iframe"
            src="https://maps.google.com/maps?q=Cedro%20No.%200,%20Col.%20El%20Hujal,%20Zihuatanejo,%20Gro.&t=&z=15&ie=UTF8&iwloc=&output=embed"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="premium-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand reveal">
              <img src={logo} alt="Logo" className="footer-logo" />
              <p className="footer-text">Cuidando tu salud desde 2010</p>
              <div className="social-links">
                <a href="#">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
            <div className="footer-menu reveal">
              <h5>Servicios</h5>
              <ul>
                <li>Dermatología Clínica</li>
                <li>Cirugía Dermatológica</li>
                <li>Podología Especializada</li>
              </ul>
            </div>
            <div className="footer-contact reveal">
              <h5>Contacto</h5>
              <p>
                <i className="bi bi-geo-alt"></i> Cedro No. 0, Col. El Hujal
              </p>
              <p>
                <i className="bi bi-telephone"></i> +52 755 123 4567
              </p>
              <p>
                <i className="bi bi-envelope"></i> contacto@propiel.com
              </p>
            </div>
          </div>
          <div className="copyright">
            © 2024 Pro-Piel. Todos los derechos reservados
          </div>
        </div>
      </footer>

      {activeService && (
        <div
          className={`service-modal ${closing ? "closing" : ""}`}
          onClick={closeServiceModal}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeServiceModal}>
              &times;
            </button>
            <div className="modal-image">
              <img src={activeService.image} alt={activeService.title} />
            </div>
            <h2 className="modal-title">{activeService.title}</h2>
            <p className="modal-text">{activeService.longDesc}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;