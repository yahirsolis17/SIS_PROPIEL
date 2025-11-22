import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Estilos y assets
import "./Home.css";
import logo from "../assets/logo.png";
import dermatologia from "../assets/dermatologia.jpg";
import tamiz from "../assets/tamiz.jpg";
import podologia from "../assets/podologia.jpg";
import medicalVideo from "../assets/as.mp4";

// Videos para modales
import dermatologiaVideo from "../assets/dermatologia.mp4";
import tamizVideo from "../assets/tamiz.mp4";
import podologiaVideo from "../assets/podologia.mp4";

// Datos de servicios
const servicesData = [
  {
    id: 1,
    title: "Dermatología Clínica",
    shortDesc: "Diagnóstico y tratamiento especializado de enfermedades cutáneas",
    longDesc: "Ofrecemos diagnóstico y tratamiento integral para una gran variedad de afecciones de la piel con tecnología de última generación y enfoque multidisciplinario.",
    image: dermatologia,
    video: dermatologiaVideo,
    features: [
      "Diagnóstico con dermatoscopio digital",
      "Tratamiento de acné severo",
      "Detección temprana de cáncer de piel",
      "Terapias biológicas avanzadas",
      "Procedimientos mínimamente invasivos",
    ],
    duration: "Consultas de 30-45 min",
    specialists: "3 dermatólogos certificados",
    icon: "bandaid",
  },
  {
    id: 2,
    title: "Tamiz Neonatal",
    shortDesc: "Tecnología de punta para detección temprana de alteraciones metabólicas",
    longDesc: "Nuestro tamiz neonatal incluye un amplio espectro de pruebas para detectar a tiempo alteraciones congénitas que pueden afectar el desarrollo del bebé.",
    image: tamiz,
    video: tamizVideo,
    features: [
      "Tamiz ampliado de 67 enfermedades",
      "Resultados en 72 horas",
      "Toma de muestra indolora",
      "Asesoría genética especializada",
      "Seguimiento post-diagnóstico",
    ],
    duration: "Procedimiento de 15 min",
    specialists: "2 genetistas certificados",
    icon: "person-hearts",
  },
  {
    id: 3,
    title: "Podología Avanzada",
    shortDesc: "Soluciones integrales para salud podológica y ortopedia especializada",
    longDesc: "Contamos con servicios especializados para el cuidado integral de tus pies, desde tratamientos convencionales hasta cirugías reconstructivas.",
    image: podologia,
    video: podologiaVideo,
    features: [
      "Evaluación biomecánica computarizada",
      "Plantillas ortopédicas personalizadas",
      "Cirugía láser para hongos",
      "Tratamiento de pie diabético",
      "Rehabilitación podológica",
    ],
    duration: "Evaluación de 40 min",
    specialists: "4 podólogos especializados",
    icon: "person-walking",
  },
];

function Home() {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState(null);
  const [closing, setClosing] = useState(false);
  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);

  // Animación de reveal en scroll
  useEffect(() => {
    const handleScrollReveal = () => {
      const elements = document.querySelectorAll(".reveal");
      const windowHeight = window.innerHeight;

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < windowHeight * 0.8) {
          element.classList.add("active");
        }
      });
    };

    handleScrollReveal();
    window.addEventListener("scroll", handleScrollReveal);
    return () => window.removeEventListener("scroll", handleScrollReveal);
  }, []);

  // Navbar: efecto de scroll
  useEffect(() => {
    const navbar = document.querySelector(".navbar-glass");
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sistema de partículas MEJORADO
  useEffect(() => {
    const cleanups = [];

    const createParticle = (container) => {
      if (!container || !document.body.contains(container)) return;

      const particle = document.createElement("div");
      particle.className = "particle-dot";

      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      const rect = container.getBoundingClientRect();
      const startX = Math.random() * rect.width;
      const startY = Math.random() * rect.height;

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100 + 50;
      
      const endX = startX + Math.cos(angle) * distance;
      const endY = startY + Math.sin(angle) * distance;

      const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 80;
      const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 80;

      particle.style.setProperty("--x-start", `${startX}px`);
      particle.style.setProperty("--y-start", `${startY}px`);
      particle.style.setProperty("--x-mid", `${midX}px`);
      particle.style.setProperty("--y-mid", `${midY}px`);
      particle.style.setProperty("--x-end", `${endX}px`);
      particle.style.setProperty("--y-end", `${endY}px`);

      const duration = Math.random() * 3 + 2;
      particle.style.setProperty("--particle-duration", `${duration}s`);

      const opacity = Math.random() * 0.6 + 0.3;
      particle.style.opacity = opacity;

      container.appendChild(particle);

      particle.addEventListener("animationend", () => {
        if (particle.parentNode) {
          particle.remove();
        }
      });
    };

    // Partículas en el hero
    const heroContainer = document.querySelector(".hero-particles");
    if (heroContainer) {
      for (let i = 0; i < 15; i++) {
        setTimeout(() => createParticle(heroContainer), Math.random() * 2000);
      }
      
      const startHeroParticles = () => {
        createParticle(heroContainer);
        const nextTime = Math.random() * 900 + 300;
        setTimeout(startHeroParticles, nextTime);
      };
      
      const heroTimeout = setTimeout(startHeroParticles, 500);
      cleanups.push(() => clearTimeout(heroTimeout));
    }

    // Partículas en el footer
    const footerContainer = document.querySelector(".footer-particles");
    if (footerContainer) {
      for (let i = 0; i < 12; i++) {
        setTimeout(() => createParticle(footerContainer), Math.random() * 2500);
      }
      
      const startFooterParticles = () => {
        createParticle(footerContainer);
        const nextTime = Math.random() * 1200 + 400;
        setTimeout(startFooterParticles, nextTime);
      };
      
      const footerTimeout = setTimeout(startFooterParticles, 800);
      cleanups.push(() => clearTimeout(footerTimeout));
    }

    // Partículas en cards (solo en hover)
    const cards = document.querySelectorAll(".service-card");
    cards.forEach((card) => {
      const cardParticlesContainer = card.querySelector(".card-particles");
      if (!cardParticlesContainer) return;

      let cardParticleTimeouts = [];

      const handleMouseEnter = () => {
        for (let i = 0; i < 8; i++) {
          const timeout = setTimeout(
            () => createParticle(cardParticlesContainer),
            Math.random() * 400
          );
          cardParticleTimeouts.push(timeout);
        }

        const createParticleWhileHover = () => {
          if (cardParticlesContainer.parentElement.matches(':hover')) {
            createParticle(cardParticlesContainer);
            const nextTime = Math.random() * 500 + 150;
            const timeout = setTimeout(createParticleWhileHover, nextTime);
            cardParticleTimeouts.push(timeout);
          }
        };

        const timeout = setTimeout(createParticleWhileHover, 200);
        cardParticleTimeouts.push(timeout);
      };

      const handleMouseLeave = () => {
        cardParticleTimeouts.forEach(timeout => clearTimeout(timeout));
        cardParticleTimeouts = [];
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);

      cleanups.push(() => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
        cardParticleTimeouts.forEach(timeout => clearTimeout(timeout));
      });
    });

    return () => {
      cleanups.forEach((fn) => fn && fn());
    };
  }, []);

  // Abrir modal
  const openServiceModal = (service) => {
    setClosing(false);
    setActiveService(service);
  };

  // Cerrar modal
  const closeServiceModal = () => {
    setClosing(true);

    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.currentTime = 0;
    }

    setTimeout(() => {
      setClosing(false);
      setActiveService(null);
    }, 300);
  };

  // Video del modal: reproducción fluida sin recargas agresivas ni pantallas negras
  useEffect(() => {
    const videoEl = modalVideoRef.current;
    if (!activeService || !videoEl) return;

    // Configuración estable
    videoEl.muted = true;
    videoEl.loop = true;
    videoEl.playsInline = true;
    videoEl.preload = "auto";
    videoEl.currentTime = 0;

    const playVideo = () => {
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          // Si el navegador bloquea autoplay, no rompemos nada visual
        });
      }
    };

    let handleCanPlay;

    if (videoEl.readyState >= 2) {
      // Ya hay datos suficientes: reproducimos de inmediato
      playVideo();
    } else {
      // Esperamos a que esté listo y entonces reproducimos
      handleCanPlay = () => {
        playVideo();
      };
      videoEl.addEventListener("canplay", handleCanPlay, { once: true });
    }

    // Limpieza al cerrar modal o cambiar de servicio
    return () => {
      if (handleCanPlay) {
        videoEl.removeEventListener("canplay", handleCanPlay);
      }
      videoEl.pause();
      videoEl.currentTime = 0;
    };
  }, [activeService]);

  // Optimizar video de fondo del hero
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      
      const handleCanPlay = () => {
        video.play().catch(e => {
          console.log("Hero video play error:", e);
          video.muted = true;
          video.play();
        });
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.load();

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  // Desactivar scroll cuando el modal está abierto
  useEffect(() => {
    if (activeService) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeService]);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && activeService) {
        closeServiceModal();
      }
    };

    if (activeService) {
      document.addEventListener("keydown", handleEscKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [activeService]);

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top navbar-light navbar-glass">
        <div className="container">
          <div
            className="navbar-brand hover-scale"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img src={logo} alt="Logo" className="logo-img" />
            <h4 className="clinic-name">Pro-Piel</h4>
          </div>
          <button
            className="navbar-toggler glass-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item hover-underline">
                <a className="nav-link" href="#servicios">Servicios</a>
              </li>
              <li className="nav-item hover-underline">
                <a className="nav-link" href="#nosotros">Nosotros</a>
              </li>
              <li className="nav-item hover-underline">
                <a className="nav-link" href="#ubicacion">Ubicación</a>
              </li>
              <li className="nav-item">
                <button className="btn-appointment glass-button ms-lg-4" onClick={() => navigate("/login")}>
                  <span>Acceder al Sistema</span>
                  <div className="liquid"></div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="video-background">
          <video ref={videoRef} className="background-video" autoPlay muted loop playsInline preload="auto">
            <source src={medicalVideo} type="video/mp4" />
          </video>
          <div className="video-overlay"></div>
        </div>

        <div className="particle-layer hero-particles"></div>

        <div className="hero-content">
          <div className="hero-text-container">
            <h1 className="hero-title">Excelencia en Salud Dermatológica</h1>
            <p className="hero-subtitle">
              Cuidado especializado con <span className="highlight">tecnología de vanguardia</span>
            </p>
            <button className="btn-cta glass-button pulse" onClick={() => navigate("/login")}>
              <span className="btn-text">Agenda tu Consulta</span>
              <div className="btn-glow"></div>
            </button>
          </div>

          <div className="floating-elements">
            <div className="floating-element element-1"></div>
            <div className="floating-element element-2"></div>
            <div className="floating-element element-3"></div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="services-section">
        <div className="container">
          <h2 className="section-title reveal">Nuestros Servicios Especializados</h2>
          <p className="section-subtitle reveal">
            Descubre nuestra gama completa de tratamientos dermatológicos con los más altos estándares de calidad
          </p>

          <div className="services-grid">
            {servicesData.map((service, index) => (
              <div key={service.id} className={`service-card reveal delay-${index}`} onClick={() => openServiceModal(service)}>
                <div className="card-inner">
                  <div className="particle-layer card-particles"></div>
                  <div className="card-image">
                    <img src={service.image} alt={service.title} />
                    <div className="card-overlay">
                      <div className="service-icon">
                        <i className={`bi bi-${service.icon}`}></i>
                      </div>
                    </div>
                  </div>
                  <div className="card-info">
                    <div className="service-badge">Especialidad</div>
                    <h3>{service.title}</h3>
                    <p>{service.shortDesc}</p>
                    <div className="card-cta">
                      <span>Conocer detalles</span>
                      <i className="bi bi-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text reveal">
              <h2 className="section-title about-title">Comprometidos con tu Salud Dermatológica</h2>
              <p className="about-description">
                En <strong className="brand-highlight">Pro-Piel</strong>, nos dedicamos a proporcionar atención médica especializada de la más alta calidad. Nuestro equipo de profesionales altamente capacitados combina experiencia con tecnología de punta para garantizar diagnósticos precisos y tratamientos efectivos.
              </p>

              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Años de Experiencia</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">5,000+</div>
                  <div className="stat-label">Pacientes Atendidos</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">12</div>
                  <div className="stat-label">Especialistas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Satisfacción</div>
                </div>
              </div>
            </div>

            <div className="about-visual reveal">
              <div className="visual-element glass-card">
                <div className="pulse-dot"></div>
                <div className="concentric-circles">
                  <div className="circle circle-1"></div>
                  <div className="circle circle-2"></div>
                  <div className="circle circle-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciadores */}
      <section className="differentiators">
        <div className="container">
          <div className="differentiators-grid">
            <div className="differentiator-card reveal">
              <div className="icon-box glass-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <h4>Certificaciones Internacionales</h4>
              <p>Estándares de calidad avalados por las principales organizaciones dermatológicas mundiales</p>
            </div>
            <div className="differentiator-card reveal">
              <div className="icon-box glass-icon">
                <i className="bi bi-robot"></i>
              </div>
              <h4>Tecnología de Punta</h4>
              <p>Equipamiento dermatológico de última generación para diagnósticos precisos</p>
            </div>
            <div className="differentiator-card reveal">
              <div className="icon-box glass-icon">
                <i className="bi bi-heart-pulse"></i>
              </div>
              <h4>Enfoque Preventivo</h4>
              <p>Programas personalizados de cuidado preventivo y seguimiento continuo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section id="ubicacion" className="contact-section">
        <div className="container">
          <h2 className="section-title reveal">Nuestra Ubicación</h2>
          <p className="section-subtitle reveal">Visítanos en nuestro moderno centro dermatológico</p>

          <div className="map-container reveal">
            <iframe
              title="Ubicación"
              className="map-iframe"
              src="https://maps.google.com/maps?q=Cedro%20No.%200,%20Col.%20El%20Hujal,%20Zihuatanejo,%20Gro.&t=&z=15&ie=UTF8&iwloc=&output=embed"
            />
            <div className="map-overlay glass-card">
              <h5>Horarios de Atención</h5>
              <p>Lunes a Viernes: 8:00 AM - 8:00 PM</p>
              <p>Sábados: 9:00 AM - 2:00 PM</p>
              <button className="btn-directions glass-button">
                <i className="bi bi-geo-alt"></i>
                Cómo llegar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="premium-footer">
        <div className="particle-layer footer-particles"></div>

        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand reveal">
              <img src={logo} alt="Logo" className="footer-logo silhouette" />
              <p className="footer-text">
                Cuidando tu salud dermatológica con excelencia y calidez humana desde 2010
              </p>
              <div className="social-links">
                <a href="#" className="social-link glass-button">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="social-link glass-button">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="social-link glass-button">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" className="social-link glass-button">
                  <i className="bi bi-whatsapp"></i>
                </a>
              </div>
            </div>

            <div className="footer-menu reveal">
              <h5>Servicios</h5>
              <ul>
                <li><a href="#servicios">Dermatología Clínica</a></li>
                <li><a href="#servicios">Cirugía Dermatológica</a></li>
                <li><a href="#servicios">Podología Especializada</a></li>
                <li><a href="#servicios">Tamiz Neonatal</a></li>
                <li><a href="#servicios">Dermatología Estética</a></li>
              </ul>
            </div>

            <div className="footer-contact reveal">
              <h5>Contacto</h5>
              <div className="contact-info">
                <p>
                  <i className="bi bi-geo-alt"></i>
                  <span>Cedro No. 0, Col. El Hujal<br />Zihuatanejo, Gro.</span>
                </p>
                <p>
                  <i className="bi bi-telephone"></i>
                  <span>+52 755 123 4567</span>
                </p>
                <p>
                  <i className="bi bi-envelope"></i>
                  <span>contacto@propiel.com</span>
                </p>
                <p>
                  <i className="bi bi-clock"></i>
                  <span>Lun-Vie: 8:00-20:00<br />Sáb: 9:00-14:00</span>
                </p>
              </div>
            </div>
          </div>

          <div className="copyright">
            <p>© 2024 Pro-Piel. Todos los derechos reservados</p>
            <div className="footer-links">
              <a href="#">Política de Privacidad</a>
              <a href="#">Términos de Servicio</a>
              <a href="#">Aviso Legal</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal - VIDEO OPTIMIZADO MEJORADO */}
      {activeService && (
        <div className={`service-modal ${closing ? "closing" : ""}`} onClick={closeServiceModal}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close glass-button" onClick={closeServiceModal}>
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="modal-video-wrapper">
              <video
                ref={modalVideoRef}
                key={`modal-video-${activeService.id}`}
                className="modal-video"
                muted
                loop
                playsInline
                preload="auto"
                autoPlay
                data-loaded="false"
                onCanPlay={(e) => {
                  e.target.setAttribute("data-loaded", "true");
                }}
              >
                <source src={activeService.video} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
              <div className="modal-video-gradient"></div>
            </div>

            <div className="modal-body">
              <h2 className="modal-title">{activeService.title}</h2>
              <div className="modal-meta">
                <span className="meta-item">
                  <i className="bi bi-clock"></i>
                  {activeService.duration}
                </span>
                <span className="meta-item">
                  <i className="bi bi-people"></i>
                  {activeService.specialists}
                </span>
              </div>

              <p className="modal-text">{activeService.longDesc}</p>

              <div className="modal-features">
                <h4>Servicios Incluidos:</h4>
                <div className="features-grid">
                  {activeService.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <i className="bi bi-check-circle"></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-primary glass-button" onClick={() => navigate("/login")}>
                  <i className="bi bi-calendar-check"></i>
                  Agendar Cita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
