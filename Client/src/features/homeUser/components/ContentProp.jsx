import React, { useState, useEffect, useCallback } from "react";
import "../Styles/ContentProp.css";
import foto from "../../../assets/images/estudiantesConCertificado.jpg";
import { getOlimpiadas } from "../../../api/Administration.api";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { BiTrophy, BiCalendar, BiStar } from "react-icons/bi";

const ContentProp = () => {
  const [current, setCurrent] = useState(0);
  const [olympiads, setOlympiads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Datos de los pasos mejorados con iconos y descripciones más detalladas
  const registrationSteps = [
    {
      icon: "bi-trophy",
      title: "Selecciona una olimpiada",
      description:
        "Elige la olimpiada en la que deseas participar. Este paso es obligatorio para todos los tipos de inscripción y determina las fechas y modalidades disponibles.",
    },
    {
      icon: "bi-ui-checks-grid",
      title: "Elige el tipo de inscripción",
      description:
        "Puedes continuar con un registro manual, llenando los datos paso a paso, o subir una planilla Excel con los datos de múltiples participantes.",
    },
    {
      icon: "bi-person-badge",
      title: "Registra al responsable de inscripción",
      description:
        "Antes de continuar con el registro de participantes, se deben completar los datos del responsable que realiza la inscripción (profesor o coordinador).",
    },
    {
      icon: "bi-person-lines-fill",
      title: "Ingresa los datos del olimpista",
      description:
        "Registra los datos personales del estudiante que participará en la olimpiada, incluyendo información académica y de contacto.",
    },
    {
      icon: "bi-list-check",
      title: "Selecciona las áreas de competencia",
      description:
        "Indica en qué áreas específicas participará el olimpista. De forma opcional, puedes asignar a los tutores encargados de cada área de conocimiento.",
    },
    {
      icon: "bi-person-vcard",
      title: "Registra al tutor legal",
      description:
        "Completa los datos del padre, madre o tutor legal del estudiante participante. Esta información es requerida para menores de edad.",
    },
    {
      icon: "bi-check-circle",
      title: "Finaliza la inscripción",
      description:
        "Una vez registrados todos los datos necesarios, revisa la información y genera la boleta de pago para continuar con el proceso de inscripción.",
    },
    {
      icon: "bi-credit-card-2-front",
      title: "Realiza el pago",
      description:
        "Acude a las cajas de la universidad con la boleta de pago generada para completar el pago correspondiente según las tarifas establecidas.",
    },
    {
      icon: "bi-upload",
      title: "Sube el comprobante de pago",
      description:
        "Ingresa nuevamente a la plataforma y sube una foto clara y legible del comprobante o factura entregado en caja para validar tu pago.",
    },
    {
      icon: "bi-patch-check-fill",
      title: "Inscripción completada",
      description:
        "Una vez validado el pago por nuestro equipo, el estado de inscripción de tus olimpistas pasará de 'pendiente' a 'completada' y recibirás confirmación.",
    },
  ];

  // Fetch de olimpiadas con mejor manejo de errores
  useEffect(() => {
    const fetchOlimpiads = async () => {
      try {
        setIsLoading(true);
        const { data } = await getOlimpiadas();
        const activas = data.filter((o) => o.estadoOlimpiada === 1);
        setOlympiads(activas);
      } catch (error) {
        console.error("Error al obtener olimpiadas:", error);
        setOlympiads([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOlimpiads();
  }, []);

  // Carousel automático mejorado
  useEffect(() => {
    if (olympiads.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % olympiads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [olympiads, isPaused]);

  // Funciones de navegación del carousel
  const goToPrevious = useCallback(() => {
    setCurrent((prev) => (prev - 1 + olympiads.length) % olympiads.length);
  }, [olympiads.length]);

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % olympiads.length);
  }, [olympiads.length]);

  // Navegación a detalles de olimpiada
  const handleView = useCallback(
    (id) => {
      navigate(`/olimpiada/${id}`);
    },
    [navigate]
  );

  // Verificar si la olimpiada está pendiente
  const isPendent = useCallback((olympiad) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(olympiad.fechaInicioOlimpiada);
    const endDate = new Date(olympiad.fechaFinOlimpiada);

    return today < startDate || today > endDate;
  }, []);

  // Control de pausa del carousel
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (isLoading) {
    return (
      <div className="olympLoadingContainer">
        <div className="olympLoader"></div>
        <p>Cargando olimpiadas...</p>
      </div>
    );
  }

  return (
    <div className="olympMainContainer">
      {/* Hero Carousel */}
      <section className="olympHeroSection">
        <div
          className="olympCarouselContainer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {olympiads.length > 0 ? (
            <>
              {olympiads.map((olympiad, index) => (
                <div
                  className={`olympCarouselSlide ${
                    index === current ? "active" : ""
                  }`}
                  key={olympiad.idOlimpiada}
                >
                  <div className="olympSlideImageContainer">
                    <img
                      src={
                        olympiad.imagen ||
                        "https://www.lifeder.com/wp-content/uploads/2019/12/matematicas-concepto-lifeder-min-1024x682.jpg"
                      }
                      alt={olympiad.nombreOlimpiada}
                      loading="lazy"
                    />
                    <div className="olympImageOverlay"></div>
                  </div>

                  <div className="olympCaption">
                    <div className="olympCaptionContent">
                      <h1 className="olympTitle">{olympiad.nombreOlimpiada}</h1>

                      <div className="olympDateInfo">
                        <BiCalendar className="olympDateIcon" />
                        <div className="olympDates">
                          <span className="olympDateLabel">
                            Período de inscripción
                          </span>
                          <span className="olympDateRange">
                            {olympiad.fechaInicioOlimpiada
                              ? new Date(
                                  olympiad.fechaInicioOlimpiada
                                ).toLocaleDateString("es-ES", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "fecha no disponible"}{" "}
                            -{" "}
                            {olympiad.fechaFinOlimpiada
                              ? new Date(
                                  olympiad.fechaFinOlimpiada
                                ).toLocaleDateString("es-ES", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "fecha no disponible"}
                          </span>
                        </div>
                      </div>

                      <div className="olympActionButtons">
                        {isPendent(olympiad) ? (
                          <button
                            className="olympCaptionButton olympDisabled"
                            disabled
                          >
                            <BiStar className="olympButtonIcon" />
                            Próximamente
                          </button>
                        ) : (
                          <button
                            className="olympCaptionButton olympPrimary"
                            onClick={() => handleView(olympiad.idOlimpiada)}
                          >
                            <CiSearch className="olympButtonIcon" />
                            Más información
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Controls */}
              <div className="olympCarouselControls">
                <button
                  className="olympNavButton olympPrev"
                  onClick={goToPrevious}
                >
                  <span>‹</span>
                </button>
                <button className="olympNavButton olympNext" onClick={goToNext}>
                  <span>›</span>
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="olympDotsContainer">
                {olympiads.map((_, index) => (
                  <button
                    key={index}
                    className={`olympDot ${index === current ? "active" : ""}`}
                    onClick={() => setCurrent(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="olympNoOlympiads">
              <div className="olympNoContent">
                <h3>No hay olimpiadas disponibles</h3>
                <p>
                  Por el momento no hay olimpiadas activas. Mantente atento a
                  futuras convocatorias.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="olympInfoSection">
        <div className="olympContainer">
          <div className="olympWelcomeHeader">
            <BiTrophy className="olympWelcomeIcon" />
            <h2>Bienvenido a la Olimpiada Científica Nacional San Simón</h2>
            <p className="olympWelcomeSubtitle">
              Descubre tu potencial científico y participa en la competencia
              académica más prestigiosa del país
            </p>
          </div>

          <div className="olympInfoGrid">
            <div className="olympInfoCard olympPresentationCard">
              <div className="olympCardHeader">
                <h3>Presentación</h3>
                <div className="olympCardIcon">🎯</div>
              </div>
              <div className="olympCardContent">
                <p>
                  El Comité de la Olimpiadas Científica Nacional San Simón{" "}
                  <strong className="olympHighlight">O! SANSI</strong>, a través
                  de la Facultad de Ciencias y Tecnología de la Universidad
                  Mayor de San Simón, convoca a los estudiantes del Sistema de
                  Educación Regular a participar en las Olimpiadas O! SANSI.
                </p>
              </div>
            </div>

            <div className="olympInfoCard olympRequirementsCard">
              <div className="olympRequirementsContainer">
                <div className="olympRequirementsText">
                  <div className="olympCardHeader">
                    <h3>Requisitos</h3>
                    <div className="olympCardIcon">📋</div>
                  </div>
                  <div className="olympRequirementsList">
                    {[
                      "Ser estudiante de nivel primaria o secundaria en el sistema de Educación Regular del Estado Plurinacional de Bolivia.",
                      "Registrar un tutor o profesor.",
                      "Registrarse en el formulario de inscripción para el(las) área(s) que se postula.",
                      "Cumplir los requisitos específicos de la categoría de competencia en la que se inscribe.",
                      "Tener su documento de identificación personal vigente (cédula de identidad) en el desarrollo de la competencia.",
                      "Contar con correo electrónico personal o del tutor.",
                    ].map((req, index) => (
                      <div key={index} className="olympRequirementItem">
                        <div className="olympRequirementNumber">
                          {index + 1}
                        </div>
                        <p>{req}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="olympRequirementsImage">
                  <div className="olympImageFrame">
                    <img
                      src={foto}
                      alt="Estudiantes con certificado"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Steps */}
      <section className="olympRegisterSteps">
        <div className="olympContainer">
          <div className="olympStepsHeader">
            <h2>Pasos para inscribirte</h2>
            <p className="olympStepsSubtitle">
              Sigue estos sencillos pasos para completar tu inscripción
            </p>
          </div>

          <div className="olympStepsGrid">
            {registrationSteps.map((step, index) => (
              <div className="olympStepCard" key={index}>
                <div className="olympStepNumber">
                  <span>{index + 1}</span>
                </div>
                <div className="olympStepContent">
                  <div className="olympStepHeader">
                    <i className={`bi ${step.icon} olympStepIcon`}></i>
                    <h3>{step.title}</h3>
                  </div>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentProp;
