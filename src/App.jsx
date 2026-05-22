import { useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import logo from "./assets/logo.jpg";
import foto1 from "./assets/foto1.jpg";
import foto2 from "./assets/foto2.jpg";
import foto3 from "./assets/foto3.jpeg";
import foto4 from "./assets/foto4.jpeg";
import foto5 from "./assets/foto5.jpeg";
import foto6 from "./assets/foto6.jpeg";
import { supabase } from "./lib/supabase";



const WHATSAPP_TEXT =
  "Hola! Quiero reservar un turno en Bugs Brows.";
const WHATSAPP_NUMBER = "5492942344488";
const BOOKING_HOURS = "Lunes a sábados de 09:00 a 12:00 y de 21:00 a 23:00.";
const TIME_OPTIONS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "21:00", "21:30", "22:00", "22:30", "23:00"];

const isValidBookingTime = (fecha, horario) => {
  if (!fecha || !horario) return false;

  const date = new Date(`${fecha}T12:00:00`);
  const day = date.getDay();

  return day >= 1 && day <= 6 && TIME_OPTIONS.includes(horario);
};

const whatsappUrl = ({ servicio, nombre, fecha, horario, nota } = {}) => {
  const lines = servicio
    ? [
        "Hola! Quiero reservar un turno en Bugs Brows.",
        `Servicio: ${servicio}`,
        `Nombre: ${nombre}`,
        `Fecha: ${fecha}`,
        `Horario: ${horario}`,
        nota ? `Nota: ${nota}` : "",
      ].filter(Boolean)
    : [WHATSAPP_TEXT];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
};

const GALERIA = [
  { src: foto3, tag: "Diseño y perfilado + henna" },
  { src: foto2, tag: "Laminado de cejas" },
  { src: foto4, tag: "Lifting foxy" },
  { src: foto2, tag: "Laminado de cejas" },
  { src: foto3, tag: "Diseño y perfilado + henna" },
  { src: foto4, tag: "Lifting foxy" },
];

const ANTES_DESPUES = [
  { antes: foto1, despues: foto2 },
  { antes: foto6, despues: foto3 },
  { antes: foto5, despues: foto4 },
];

const SERVICIOS = {
  Cejas: [
    {
      nombre: "Laminado + perfilado + tinte y botox",
      desc: "Peina y fija las cejas para un efecto más voluminoso, acompañado de nutrición profunda, perfilado y color.",
      precio: "$30.000",
      variante: "dark",
      badge: "Completo",
      wide: true,
    },
    {
      nombre: "Laminado sin tinte",
      desc: "Ideal para ordenar y dar forma a las cejas manteniendo su color natural.",
      precio: "$28.000",
    },
    {
      nombre: "Con cera",
      desc: "Epilación rápida y efectiva para unas cejas limpias y definidas por más tiempo.",
      precio: "$21.000",
    },
    {
      nombre: "Perfilado con hilo",
      desc: "Técnica precisa y delicada que elimina el vello desde la raíz. Ideal para pieles sensibles.",
      precio: "$20.000",
    },
    {
      nombre: "Diseño y perfilado",
      desc: "Diseño personalizado según tu rostro para lograr cejas armónicas y prolijas.",
      precio: "$19.000",
      variante: "feat",
      badge: "Popular",
      badgeSoft: true,
    },
    {
      nombre: "Pigmentación con tinte / henna",
      desc: "Color y volumen visual para tus cejas. Henna de larga duración que tiñe incluso la piel.",
      precio: "$5.000",
    },
  ],
  Pestañas: [
    {
      nombre: 'Lifting "Foxy"',
      desc: "Efecto alargado hacia los extremos para una mirada más sensual y estilizada.",
      precio: "$33.000",
      variante: "dark",
      badge: "Tendencia",
    },
    {
      nombre: "Lifting + botox + keratina + color",
      desc: "Tratamiento intensivo técnica dúo. Fortalece, nutre y realza con curvatura más definida.",
      precio: "$32.000",
      variante: "feat",
    },
    {
      nombre: "Lifting + botox & color",
      desc: "Eleva y curva tus pestañas naturales aportando color, hidratación y mirada más abierta.",
      precio: "$30.000",
    },
    {
      nombre: "Reversión de lifting",
      desc: "Relaja un lifting muy curvado o desparejo. Las pestañas recuperan apariencia natural sin daño.",
      precio: "Consultar",
    },
  ],
  Otros: [
    {
      nombre: "Epilación en bozo",
      desc: "Eliminación del vello del labio superior de manera suave y prolija.",
      precio: "$8.000",
    },
    {
      nombre: "Epilación en rostro completo",
      desc: "Incluye bozo, mentón, patillas, frente, mejillas y entrecejo. Piel limpia y uniforme.",
      precio: "$25.000",
      variante: "feat",
      wide: true,
    },
  ],
};

const CSS = ``;

function Gallery() {
  const items = [...GALERIA, ...GALERIA];

  return (
    <div className="bb-gal bb-up" style={{ animationDelay: ".45s" }}>
      <div className="bb-track" aria-label="Galería de trabajos">
        {items.map(({ src, tag }, index) => (
          <figure className="bb-gitem" key={`${tag}-${index}`}>
            <img src={src} alt={`Trabajo de ${tag.toLowerCase()}`} loading="lazy" />
            <figcaption className="bb-gtag">{tag}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function Card({ item, index, onBook }) {
  const cls = ["bb-card", item.variante || "", item.wide ? "wide" : ""].filter(Boolean).join(" ");

  return (
    <article className={cls} style={{ animationDelay: `${0.05 + index * 0.06}s` }}>
      {item.badge && <span className={`bb-badge${item.badgeSoft ? " soft" : ""}`}>{item.badge}</span>}
      <h3 className="bb-name">{item.nombre}</h3>
      <p className="bb-desc">{item.desc}</p>
      <div className="bb-foot">
        <strong className="bb-price">{item.precio}</strong>
        <button className="bb-cta" type="button" onClick={() => onBook(item.nombre)}>
          Reservar
        </button>
      </div>
    </article>
  );
}

function BASlider({ antes, despues }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const [pos, setPos] = useState(50);
  const useBW = antes === despues;

  const move = (clientX) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(4, Math.min(96, next)));
  };

  useEffect(() => {
    const stop = () => {
      dragging.current = false;
    };
    const mouseMove = (event) => {
      if (dragging.current) move(event.clientX);
    };
    const touchMove = (event) => {
      if (dragging.current) move(event.touches[0].clientX);
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", touchMove, { passive: true });
    window.addEventListener("touchend", stop);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", stop);
    };
  }, []);

  const handleStart = (clientX) => {
    startX.current = clientX;
    dragging.current = true;
    move(clientX);
  };

  return (
    <div className="bb-ba-card">
      <div
        ref={ref}
        className="bb-slider"
        role="img"
        aria-label="Comparación antes y después"
        onMouseDown={(event) => {
          handleStart(event.clientX);
        }}
        onTouchStart={(event) => {
          handleStart(event.touches[0].clientX);
        }}
      >
        <div className="bb-layer">
          <img src={despues} alt="Resultado después del servicio" />
        </div>
        <div className="bb-layer bb-clip" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img
            src={antes}
            alt="Resultado antes del servicio"
            style={useBW ? { filter: "grayscale(100%) brightness(.78)" } : undefined}
          />
        </div>
        <div className="bb-line" style={{ left: `${pos}%` }} />
        <div className="bb-knob" style={{ left: `${pos}%` }}>
          ↔
        </div>
        <span className="bb-lbl lb">Antes</span>
        <span className="bb-lbl la">Después</span>
      </div>
    </div>
  );
}

function BookingModal({ servicioInicial, servicios, onClose }) {
  const [form, setForm] = useState({
    serviciosSeleccionados: servicioInicial
      ? [servicioInicial]
      : [],
    nombre: "",
    fecha: "",
    horario: "",
    nota: "",
  });

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState(TIME_OPTIONS);
  const [cargando, setCargando] = useState(false);

  const getHorariosDisponibles = async (fecha) => {
    if (!fecha) return TIME_OPTIONS;

    setCargando(true);
    try {
      const { data, error: err } = await supabase
        .from('reservas')
        .select('hora')
        .eq('fecha', fecha);

      if (err) throw err;

      const horariosReservados = new Set(data.map(r => r.hora));
      const disponibles = TIME_OPTIONS.filter(h => !horariosReservados.has(h));
      setHorariosDisponibles(disponibles);
    } catch (err) {
      console.error('Error cargando horarios:', err);
      setHorariosDisponibles(TIME_OPTIONS);
    } finally {
      setCargando(false);
    }
  };

  const update = (event) => {
    setError("");

    const { name, value } = event.target;

    if (name === 'fecha') {
      getHorariosDisponibles(value);
      setForm((current) => ({
        ...current,
        [name]: value,
        horario: "",
      }));
    } else {
      setForm((current) => ({
        ...current,
        [name]: value,
      }));
    }
  };

  const toggleServicio = (servicio) => {
    setForm((current) => {
      const exists =
        current.serviciosSeleccionados.includes(
          servicio
        );

      return {
        ...current,

        serviciosSeleccionados: exists
          ? current.serviciosSeleccionados.filter(
              (s) => s !== servicio
            )
          : [
              ...current.serviciosSeleccionados,
              servicio,
            ],
      };
    });
  };

  const submit = async (event) => {
    event.preventDefault();

    if (
      form.serviciosSeleccionados.length === 0
    ) {
      setError(
        "Seleccioná al menos un servicio."
      );
      return;
    }

    if (!form.nombre) {
      setError("Completá tu nombre.");
      return;
    }

    if (
      !isValidBookingTime(
        form.fecha,
        form.horario
      )
    ) {
      setError(
        `Los turnos disponibles son ${BOOKING_HOURS.toLowerCase()}`
      );
      return;
    }

    try {
      const lines = [
        "Hola! Quiero reservar un turno en Bugs Brows.",
        "",
        "Servicios:",
        ...form.serviciosSeleccionados.map(
          (s) => `• ${s}`
        ),
        "",
        `Nombre: ${form.nombre}`,
        `Fecha: ${form.fecha}`,
        `Horario: ${form.horario}`,
        form.nota
          ? `Nota: ${form.nota}`
          : "",
      ].filter(Boolean);

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        lines.join("\n")
      )}`;

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

      onClose();
    } catch (err) {
      setError("Error al abrir WhatsApp. Intenta de nuevo.");
      console.error(err);
    }
  };

  return (
    <div
      className="bb-booking-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="bb-booking"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="bb-booking-head">
          <div>
            <h2 id="booking-title">
              Agendar turno
            </h2>

            <p>
              Completá tus datos y se enviarán por
              WhatsApp a la dueña para confirmar
              disponibilidad.
            </p>

            <div className="bb-hours">
              {BOOKING_HOURS}
            </div>
          </div>

          <button
            className="bb-close"
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className="bb-form"
          onSubmit={submit}
        >
          <label className="bb-field">
            Servicios

            <div
              style={{
                position: "relative",
                marginTop: "6px",
              }}
            >
              <div
                onClick={() =>
                  setOpen((v) => !v)
                }
                style={{
                  width: "100%",
                  minHeight: "48px",
                  border:
                    "1px solid var(--border)",
                  borderRadius: "14px",
                  background: "#fffafa",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  cursor: "pointer",
                  fontFamily:
                    "Outfit, sans-serif",
                }}
              >
                <span>
                  {form
                    .serviciosSeleccionados
                    .length > 0
                    ? `${form.serviciosSeleccionados.length} servicio(s) seleccionado(s)`
                    : "Seleccionar servicios"}
                </span>

                <span>
                  {open ? "▲" : "▼"}
                </span>
              </div>

              {open && (
                <div
                  style={{
                    position: "absolute",
                    top:
                      "calc(100% + 8px)",
                    left: 0,
                    right: 0,
                    zIndex: 999,
                    background: "#fff",
                    border:
                      "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "10px",
                    boxShadow:
                      "0 20px 50px rgba(40,19,27,.12)",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Buscar servicio..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    autoFocus
                    style={{
                      width: "100%",
                      minHeight: "42px",
                      border:
                        "1px solid var(--border)",
                      borderRadius: "12px",
                      background:
                        "#fffafa",
                      padding:
                        "10px 12px",
                      marginBottom:
                        "10px",
                      outline: "none",
                      fontFamily:
                        "Outfit, sans-serif",
                    }}
                  />

                  <div
                    style={{
                      display: "grid",
                      gap: "8px",
                      maxHeight:
                        "220px",
                      overflowY:
                        "auto",
                    }}
                  >
                    {servicios
                      .filter((item) =>
                        item
                          .toLowerCase()
                          .includes(
                            search.toLowerCase()
                          )
                      )
                      .map((item) => {
                        const active =
                          form.serviciosSeleccionados.includes(
                            item
                          );

                        return (
                          <div
                            key={item}
                            onClick={() =>
                              toggleServicio(
                                item
                              )
                            }
                            style={{
                              border: active
                                ? "1px solid var(--rose)"
                                : "1px solid var(--border)",

                              background: active
                                ? "linear-gradient(135deg,var(--petal),#fff)"
                                : "#fff",

                              color:
                                "var(--ink)",

                              borderRadius:
                                "12px",

                              padding:
                                "13px",

                              cursor:
                                "pointer",

                              textAlign:
                                "left",

                              fontFamily:
                                "Outfit, sans-serif",
                            }}
                          >
                            {active
                              ? "✓ "
                              : ""}
                            {item}
                          </div>
                        );
                      })}
                  </div>

                  <div
                    onClick={() => {
                      setOpen(false);
                      setSearch("");
                    }}
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      minHeight: "42px",
                      borderRadius:
                        "12px",
                      background:
                        "var(--rose)",
                      color: "#fff",
                      cursor: "pointer",
                      fontFamily:
                        "Outfit, sans-serif",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    Listo
                  </div>
                </div>
              )}
            </div>
          </label>

          <label className="bb-field">
            Nombre

            <input
              name="nombre"
              value={form.nombre}
              onChange={update}
              placeholder="Tu nombre"
              required
            />
          </label>

          <label className="bb-field">
            Fecha

            <input
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={update}
              required
            />
          </label>

          <label className="bb-field">
            Horario

            <select
              name="horario"
              value={form.horario}
              onChange={update}
              required
              disabled={cargando || !form.fecha}
            >
              <option value="">
                {cargando ? "Cargando horarios..." : "Elegí un horario"}
              </option>

              {horariosDisponibles.map(
                (time) => (
                  <option
                    value={time}
                    key={time}
                  >
                    {time}
                  </option>
                )
              )}
            </select>
            {form.fecha && horariosDisponibles.length === 0 && (
              <p style={{ margin: "6px 0 0", color: "var(--rose-dark)", fontSize: "13px" }}>
                Sin horarios disponibles para esta fecha
              </p>
            )}
          </label>

          <label className="bb-field">
            Nota

            <textarea
              name="nota"
              value={form.nota}
              onChange={update}
              placeholder="Ej: puedo moverme de horario si hace falta"
            />
          </label>

          {error && (
            <p className="bb-error">
              {error}
            </p>
          )}

          <button
            className="bb-submit"
            type="submit"
          >
            Enviar por WhatsApp
          </button>
        </form>
      </section>
    </div>
  );
}
export default function App() {
  const [filtro, setFiltro] = useState("Todos");
  const [bookingService, setBookingService] = useState(null);
  const categorias = ["Todos", "Cejas", "Pestañas", "Otros"];
  const servicios = Object.values(SERVICIOS).flat().map((item) => item.nombre);

  return (
    <div className="bb-shell">
      <Analytics />
      <header className="bb-header">
       <div
  className="bb-mark bb-up"
  style={{ animationDelay: ".05s" }}
>
  <img
    src={logo}
    alt="Bugs Brows"
    style={{
      width: "78px",
      height: "78px",
      objectFit: "contain",
      filter:
        "drop-shadow(0 10px 25px rgba(196,96,122,.25))",
    }}
  />
</div>
        <h1 className="bb-title bb-up" style={{ animationDelay: ".16s" }}>
          Bugs
          <br />
          <em>Brows</em>
        </h1>
        <p className="bb-kicker bb-up" style={{ animationDelay: ".28s" }}>
          Cejas · Pestañas · Rostro · Neuquén
        </p>
        <div className="bb-ornament bb-up" style={{ animationDelay: ".38s" }} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </header>

      <Gallery />

      <section className="bb-note bb-up" style={{ animationDelay: ".52s" }}>
        <p>
          Para reservar tu turno es necesario señar <strong>la mitad del servicio</strong> a realizar.
          Sin devolución si se cancela sin aviso previo a 24hs. 
        </p>
      </section>

      <nav className="bb-filter bb-up" style={{ animationDelay: ".62s" }} aria-label="Filtrar servicios">
        {categorias.map((categoria) => (
          <button
            className={`bb-btn${filtro === categoria ? " active" : ""}`}
            key={categoria}
            type="button"
            onClick={() => setFiltro(categoria)}
          >
            {categoria}
          </button>
        ))}
      </nav>

      <main className="bb-wrap">
        {Object.entries(SERVICIOS).map(([categoria, lista]) => {
          if (filtro !== "Todos" && filtro !== categoria) return null;

          return (
            <section className="bb-section" key={categoria}>
              <div className="bb-heading">
                <h2>{categoria}</h2>
                <span />
              </div>
              <div className="bb-grid">
                {lista.map((item, index) => (
                  <Card item={item} index={index} key={item.nombre} onBook={setBookingService} />
                ))}
              </div>
            </section>
          );
        })}

        <section className="bb-section">
          <div className="bb-heading">
            <h2>Antes &amp; después</h2>
            <span />
          </div>
          <div className="bb-ba-grid">
            {ANTES_DESPUES.map((item, index) => (
              <BASlider {...item} key={index} />
            ))}
          </div>
        </section>
      </main>

      <footer className="bb-footer" id="contacto">
        <div className="bb-footer-logo">Bugs Brows</div>
        <p>@bugs.brows</p>
      </footer>

      <div className="bb-fab-wrap">
        <button className="bb-fab" type="button" onClick={() => setBookingService(servicios[0])}>
          <span className="bb-pulse" />
          Reservar turno
        </button>
      </div>
{bookingService && (
  <BookingModal
    servicioInicial={bookingService}
    servicios={servicios}
    onClose={() => setBookingService(null)}
  />
)}
     
    </div>
  );
}
