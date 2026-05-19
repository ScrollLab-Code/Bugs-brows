import { useEffect, useRef, useState } from "react";
import foto1 from "./assets/foto1.jpg";
import foto2 from "./assets/foto2.jpg";
import foto3 from "./assets/foto3.jpeg";
import foto4 from "./assets/foto4.jpeg";
import foto5 from "./assets/foto5.jpeg";
import foto6 from "./assets/foto6.jpeg";


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

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,500&display=swap');

*, *::before, *::after { box-sizing: border-box; }
:root {
  --bg: #fff7f8;
  --surface: #ffffff;
  --rose: #c4607a;
  --rose-dark: #8e334a;
  --petal: #fae0e7;
  --mauve: #6f3c4c;
  --ink: #28131b;
  --muted: #8f6975;
  --border: rgba(196, 96, 122, .17);
}

html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-width: 320px;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Outfit', system-ui, sans-serif;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  opacity: .42;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E");
}

@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes pulse { 0%, 100% { transform: scale(1); opacity: .55; } 50% { transform: scale(1.55); opacity: 1; } }

.bb-up { opacity: 0; animation: fadeUp .7s ease forwards; }
.bb-shell { position: relative; min-height: 100vh; overflow-x: hidden; background: linear-gradient(180deg, #fff7f8 0%, #fff 46%, #fff7f8 100%); }
.bb-shell::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(110deg, rgba(250, 224, 231, .72), transparent 34%),
    linear-gradient(250deg, rgba(196, 96, 122, .13), transparent 32%);
}
.bb-wrap { width: min(1060px, calc(100% - 40px)); margin: 0 auto; position: relative; z-index: 2; }

.bb-header { position: relative; z-index: 2; text-align: center; padding: 68px 20px 22px; }
.bb-mark {
  width: 96px;
  height: 96px;
  margin: 0 auto 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  border: 1px solid var(--border);
  box-shadow: 0 18px 52px rgba(196, 96, 122, .16);
}
.bb-mark span {
  width: 54px;
  height: 54px;
  display: block;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, rgba(255,255,255,.8) 0 10%, transparent 11%),
    linear-gradient(135deg, #ea4d6b, #a93450);
  box-shadow: inset 0 -10px 24px rgba(40, 19, 27, .18);
}
.bb-title {
  margin: 0;
  color: var(--ink);
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(62px, 13vw, 118px);
  font-weight: 400;
  line-height: .84;
}
.bb-title em { color: var(--rose); font-style: italic; }
.bb-kicker {
  margin: 22px 0 0;
  color: var(--muted);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: .26em;
  text-transform: uppercase;
}
.bb-ornament { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 28px auto 0; }
.bb-ornament::before, .bb-ornament::after { content: ""; width: 58px; height: 1px; background: linear-gradient(90deg, transparent, var(--rose)); }
.bb-ornament::after { background: linear-gradient(90deg, var(--rose), transparent); }
.bb-ornament span { width: 6px; height: 6px; border-radius: 50%; background: var(--rose); opacity: .7; }

.bb-gal { position: relative; z-index: 2; overflow: hidden; padding: 12px 0 2px; margin-bottom: 58px; }
.bb-gal::before, .bb-gal::after { content: ""; position: absolute; top: 0; bottom: 0; width: 110px; z-index: 2; pointer-events: none; }
.bb-gal::before { left: 0; background: linear-gradient(90deg, var(--bg), transparent); }
.bb-gal::after { right: 0; background: linear-gradient(270deg, var(--bg), transparent); }
.bb-track { display: flex; gap: 12px; width: max-content; animation: marquee 34s linear infinite; }
.bb-track:hover { animation-play-state: paused; }
.bb-gitem { width: 205px; height: 274px; flex: 0 0 auto; overflow: hidden; position: relative; border-radius: 8px; border: 1px solid var(--border); box-shadow: 0 16px 42px rgba(196, 96, 122, .12); background: #fff; }
.bb-gitem img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
.bb-gitem::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgba(40,19,27,.46), transparent 52%); }
.bb-gtag { position: absolute; z-index: 2; left: 14px; bottom: 14px; color: #fff; font-size: 10px; letter-spacing: .18em; text-transform: uppercase; }

.bb-note { max-width: 620px; margin: 0 auto 52px; padding: 0 20px; position: relative; z-index: 2; }
.bb-note p { margin: 0; padding: 17px 22px; border: 1px solid var(--border); border-radius: 8px; background: rgba(255,255,255,.72); color: var(--mauve); text-align: center; font-size: 13px; font-weight: 300; line-height: 1.7; box-shadow: 0 18px 45px rgba(196, 96, 122, .08); }
.bb-note strong { color: var(--rose-dark); font-weight: 600; }

.bb-filter { position: relative; z-index: 2; display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; padding: 0 20px 54px; }
.bb-btn { min-height: 38px; padding: 9px 20px; border: 1px solid var(--border); border-radius: 999px; background: rgba(255,255,255,.58); color: var(--muted); cursor: pointer; font: 500 11px/1 'Outfit', sans-serif; letter-spacing: .18em; text-transform: uppercase; transition: .22s ease; }
.bb-btn:hover, .bb-btn.active { border-color: var(--rose); background: var(--rose); color: #fff; }

.bb-section { margin-bottom: 74px; }
.bb-heading { display: flex; align-items: baseline; gap: 18px; margin-bottom: 28px; }
.bb-heading h2 { margin: 0; color: var(--ink); font-family: 'Playfair Display', Georgia, serif; font-size: clamp(30px, 4.5vw, 48px); font-style: italic; font-weight: 400; white-space: nowrap; }
.bb-heading span { height: 1px; flex: 1; background: var(--border); }
.bb-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(285px, 1fr)); gap: 14px; }
.bb-card { min-height: 216px; padding: 28px 26px; position: relative; display: flex; flex-direction: column; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); box-shadow: 0 16px 42px rgba(196, 96, 122, .08); opacity: 0; animation: fadeUp .62s ease forwards; transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
.bb-card:hover { transform: translateY(-5px); border-color: rgba(196, 96, 122, .38); box-shadow: 0 24px 54px rgba(196, 96, 122, .14); }
.bb-card.feat { background: linear-gradient(135deg, var(--petal), #fff); }
.bb-card.dark { background: linear-gradient(135deg, var(--rose-dark), var(--mauve)); color: #fff; border-color: transparent; }
.bb-card.wide { grid-column: span 2; }
.bb-card.dark .bb-desc { color: rgba(255,255,255,.72); }
.bb-card.dark .bb-foot { border-top-color: rgba(255,255,255,.2); }
.bb-card.dark .bb-price, .bb-card.dark .bb-cta { color: #fff; }
.bb-badge { position: absolute; top: 17px; right: 17px; padding: 5px 10px; border-radius: 999px; background: var(--rose); color: #fff; font-size: 9px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
.bb-badge.soft { background: #fff; color: var(--rose-dark); }
.bb-name { max-width: 82%; margin-bottom: 11px; font-family: 'Playfair Display', Georgia, serif; font-size: 21px; font-weight: 400; line-height: 1.22; }
.bb-desc { margin: 0 0 22px; color: var(--muted); font-size: 13px; font-weight: 300; line-height: 1.68; }
.bb-foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
.bb-price { color: var(--rose-dark); font-family: 'Playfair Display', Georgia, serif; font-size: 28px; }
.bb-cta { color: var(--rose); text-decoration: none; font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; white-space: nowrap; opacity: .72; }
.bb-cta:hover { opacity: 1; }

.bb-ba-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.bb-ba-card { aspect-ratio: 3 / 4; overflow: hidden; position: relative; border-radius: 8px; border: 1px solid var(--border); background: #fff; box-shadow: 0 16px 42px rgba(196, 96, 122, .1); }
.bb-slider { width: 100%; height: 100%; position: relative; cursor: ew-resize; user-select: none; touch-action: none; }
.bb-layer { position: absolute; inset: 0; }
.bb-layer img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; pointer-events: none; }
.bb-clip { clip-path: inset(0 50% 0 0); }
.bb-line { position: absolute; top: 0; bottom: 0; width: 2px; transform: translateX(-50%); background: rgba(255,255,255,.95); box-shadow: 0 0 10px rgba(40,19,27,.18); z-index: 3; }
.bb-knob { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; background: #fff; color: var(--rose-dark); font-size: 16px; box-shadow: 0 7px 20px rgba(40,19,27,.18); z-index: 4; pointer-events: none; }
.bb-lbl { position: absolute; bottom: 14px; z-index: 5; padding: 5px 10px; border-radius: 999px; font-size: 9px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
.lb { left: 12px; color: #fff; background: rgba(40,19,27,.56); }
.la { right: 12px; color: #fff; background: var(--rose); }

.bb-footer { position: relative; z-index: 2; text-align: center; padding: 46px 24px 94px; border-top: 1px solid var(--border); }
.bb-footer-logo { color: var(--rose); font-family: 'Playfair Display', Georgia, serif; font-size: 38px; font-style: italic; }
.bb-footer p { margin: 10px 0 0; color: var(--muted); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; }
.bb-fab-wrap { position: fixed; z-index: 100; bottom: 24px; left: 50%; transform: translateX(-50%); }
.bb-fab { min-height: 48px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 34px; border: 0; border-radius: 999px; background: var(--rose); color: #fff; text-decoration: none; box-shadow: 0 16px 42px rgba(196, 96, 122, .36); font-size: 11px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; white-space: nowrap; transition: .22s ease; cursor: pointer; font-family: 'Outfit', system-ui, sans-serif; }
.bb-fab:hover { transform: translateY(-2px); background: var(--rose-dark); }
.bb-pulse { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 50%; background: rgba(255,255,255,.75); animation: pulse 2s ease infinite; }
.bb-booking-backdrop { position: fixed; inset: 0; z-index: 500; display: grid; place-items: end center; padding: 22px; background: rgba(40, 19, 27, .38); backdrop-filter: blur(8px); }
.bb-booking { width: min(520px, 100%); padding: 24px; border-radius: 8px; background: #fff; box-shadow: 0 24px 70px rgba(40, 19, 27, .28); border: 1px solid var(--border); }
.bb-booking-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.bb-booking h2 { margin: 0 0 6px; font-family: 'Playfair Display', Georgia, serif; font-size: 30px; font-weight: 400; color: var(--ink); }
.bb-booking p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
.bb-hours { margin: 14px 0 0; padding: 10px 12px; border-radius: 8px; background: rgba(196, 96, 122, .08); color: var(--rose-dark); font-size: 13px; line-height: 1.45; }
.bb-close { width: 34px; height: 34px; flex: 0 0 auto; border: 1px solid var(--border); border-radius: 50%; background: #fff; color: var(--rose-dark); cursor: pointer; font-size: 22px; line-height: 1; }
.bb-form { display: grid; gap: 13px; }
.bb-field { display: grid; gap: 6px; color: var(--mauve); font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; }
.bb-field input, .bb-field select, .bb-field textarea { width: 100%; min-height: 44px; border: 1px solid var(--border); border-radius: 8px; background: #fffafa; color: var(--ink); padding: 11px 12px; font: 400 15px/1.35 'Outfit', system-ui, sans-serif; outline: none; }
.bb-field textarea { min-height: 82px; resize: vertical; }
.bb-field input:focus, .bb-field select:focus, .bb-field textarea:focus { border-color: var(--rose); box-shadow: 0 0 0 3px rgba(196, 96, 122, .12); }
.bb-error { margin: 0; padding: 10px 12px; border-radius: 8px; background: #fff1f3; color: var(--rose-dark); font-size: 13px; line-height: 1.45; }
.bb-submit { min-height: 48px; border: 0; border-radius: 999px; background: var(--rose); color: #fff; cursor: pointer; font: 600 11px/1 'Outfit', system-ui, sans-serif; letter-spacing: .18em; text-transform: uppercase; box-shadow: 0 14px 34px rgba(196, 96, 122, .25); }
.bb-submit:hover { background: var(--rose-dark); }

@media (max-width: 760px) {
  .bb-wrap { width: min(100% - 28px, 1060px); }
  .bb-header { padding-top: 44px; }
  .bb-kicker { letter-spacing: .18em; line-height: 1.8; }
  .bb-gitem { width: 178px; height: 240px; }
  .bb-gal::before, .bb-gal::after { width: 54px; }
  .bb-card.wide { grid-column: span 1; }
  .bb-ba-grid { grid-template-columns: 1fr; }
  .bb-heading { gap: 12px; }
  .bb-foot { align-items: flex-end; }
  .bb-fab { width: calc(100vw - 40px); max-width: 340px; }
  .bb-booking-backdrop { padding: 12px; }
  .bb-booking { padding: 20px; }
}
`;

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

  return (
    <div className="bb-ba-card">
      <div
        ref={ref}
        className="bb-slider"
        role="img"
        aria-label="Comparación antes y después"
        onMouseDown={(event) => {
          dragging.current = true;
          move(event.clientX);
        }}
        onTouchStart={(event) => {
          dragging.current = true;
          move(event.touches[0].clientX);
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
    servicio: servicioInicial || servicios[0],
    nombre: "",
    fecha: "",
    horario: "",
    nota: "",
  });
  const [error, setError] = useState("");

  const update = (event) => {
    setError("");
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = (event) => {
    event.preventDefault();

    if (!isValidBookingTime(form.fecha, form.horario)) {
      setError(`Los turnos disponibles son ${BOOKING_HOURS.toLowerCase()}`);
      return;
    }

    window.open(whatsappUrl(form), "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="bb-booking-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="bb-booking"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="bb-booking-head">
          <div>
            <h2 id="booking-title">Agendar turno</h2>
            <p>Completá tus datos y se enviarán por WhatsApp a la dueña para confirmar disponibilidad.</p>
            <div className="bb-hours">{BOOKING_HOURS}</div>
          </div>
          <button className="bb-close" type="button" aria-label="Cerrar" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="bb-form" onSubmit={submit}>
          <label className="bb-field">
            Servicio
            <select name="servicio" value={form.servicio} onChange={update} required>
              {servicios.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="bb-field">
            Nombre
            <input name="nombre" value={form.nombre} onChange={update} placeholder="Tu nombre" required />
          </label>

          <label className="bb-field">
            Fecha
            <input name="fecha" type="date" value={form.fecha} onChange={update} required />
          </label>

          <label className="bb-field">
            Horario
            <select name="horario" value={form.horario} onChange={update} required>
              <option value="">Elegí un horario</option>
              {TIME_OPTIONS.map((time) => (
                <option value={time} key={time}>
                  {time}
                </option>
              ))}
            </select>
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

          {error && <p className="bb-error">{error}</p>}

          <button className="bb-submit" type="submit">
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

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="bb-shell">
      <header className="bb-header">
        <div className="bb-mark bb-up" style={{ animationDelay: ".05s" }} aria-hidden="true">
          <span />
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
          Sin devolución si se cancela sin aviso previo. Consultá tu alias por mensaje.
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
