import { useId } from 'react';

// Ilustración genérica de prenda que sirve como imagen de ejemplo.
// No usa logotipos ni fotos de marcas. Cuando un producto tiene fotos propias, se usan esas.
export const artTypeFor = (p) =>
  p.art ||
  {
    Playeras: 'tee',
    Camisas: 'shirt',
    Polos: 'polo',
    Hoodies: 'hoodie',
    Sudaderas: 'sweat',
    Pantalones: 'pants',
    Chamarras: 'jacket',
    Accesorios: 'cap',
  }[p.category] ||
  'tee';

const TEE = 'M60 30 L82 22 Q100 38 118 22 L140 30 L178 64 L156 90 L140 78 L140 192 L60 192 L60 78 L44 90 L22 64 Z';

const PATHS = {
  tee: TEE,
  polo: TEE,
  shirt: 'M58 30 L84 22 L100 40 L116 22 L142 30 L184 124 L162 132 L142 86 L142 198 L58 198 L58 86 L38 132 L16 124 Z',
  hoodie: 'M64 36 Q72 16 100 14 Q128 16 136 36 L182 74 L172 152 L150 148 L146 104 L146 196 L54 196 L54 104 L50 148 L28 152 L18 74 Z',
  sweat: 'M64 28 L86 22 Q100 36 114 22 L136 28 L184 122 L162 130 L142 86 L142 192 L58 192 L58 86 L38 130 L16 122 Z',
  pants: 'M62 16 L138 16 L144 46 L134 206 L106 206 L100 72 L94 206 L66 206 L56 46 Z',
  jacket: 'M60 30 L84 20 L100 30 L116 20 L140 30 L186 78 L178 170 L154 166 L150 102 L150 192 L50 192 L50 102 L46 166 L22 170 L14 78 Z',
  cap: 'M32 132 Q32 62 100 58 Q168 62 168 132 Z',
  belt: 'M14 98 L186 98 L186 122 L14 122 Z',
};

export default function GarmentArt({ type = 'tee', color = '#1c1c1c', variant = 0, className = '', label }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const line = 'rgba(0,0,0,0.3)';
  const gold = 'rgba(184,151,90,0.75)';
  const d = PATHS[type] || PATHS.tee;
  const details = variant !== 1; // la vista "espalda" no muestra detalles frontales

  const detail = {
    tee: <path d="M82 22 Q100 40 118 22" fill="none" stroke={line} strokeWidth="2" />,
    shirt: (
      <>
        <path d="M84 22 L100 44 L88 54 L70 34 Z" fill="rgba(255,255,255,0.1)" stroke={line} />
        <path d="M116 22 L100 44 L112 54 L130 34 Z" fill="rgba(255,255,255,0.1)" stroke={line} />
        <path d="M100 44 L100 198" stroke={line} />
        {[72, 102, 132, 162].map((y) => (
          <circle key={y} cx="100" cy={y} r="2.2" fill={line} />
        ))}
      </>
    ),
    polo: (
      <>
        <path d="M82 22 L100 46 L118 22" fill="rgba(255,255,255,0.1)" stroke={line} strokeWidth="1.5" />
        <path d="M100 46 L100 94" stroke={line} />
        <circle cx="100" cy="62" r="2.2" fill={line} />
        <circle cx="100" cy="78" r="2.2" fill={line} />
      </>
    ),
    hoodie: (
      <>
        <path d="M74 32 Q100 10 126 32 Q116 56 100 58 Q84 56 74 32 Z" fill="rgba(0,0,0,0.35)" stroke={line} />
        <path d="M92 58 L90 96 M108 58 L110 96" stroke={gold} strokeWidth="1.5" />
        <path d="M70 142 L130 142 L138 178 L62 178 Z" fill="none" stroke={line} />
      </>
    ),
    sweat: (
      <>
        <path d="M84 22 Q100 46 116 22" fill="none" stroke={line} strokeWidth="2.5" />
        <path d="M58 182 L142 182" stroke={line} strokeWidth="2" />
        <path d="M38 130 L16 122 M162 130 L184 122" stroke={line} strokeWidth="3" />
      </>
    ),
    pants: (
      <>
        <path d="M58 34 L142 34" stroke={gold} strokeWidth="2" />
        <path d="M100 34 L100 72" stroke={line} />
        <path d="M64 42 Q74 70 90 64 M136 42 Q126 70 110 64" fill="none" stroke={line} />
      </>
    ),
    jacket: (
      <>
        <path d="M84 20 L100 46 L116 20" fill="rgba(255,255,255,0.08)" stroke={line} strokeWidth="1.5" />
        <path d="M100 46 L100 192" stroke={gold} strokeWidth="1.8" />
        <path d="M64 140 L84 140 M116 140 L136 140" stroke={line} strokeWidth="2" />
      </>
    ),
    cap: (
      <>
        <path d="M32 132 Q100 118 192 144 Q100 166 32 132 Z" fill={color} stroke="rgba(255,255,255,0.16)" />
        <path d="M32 132 Q100 118 192 144 Q100 166 32 132 Z" fill={`url(#sh${uid})`} />
        <circle cx="100" cy="60" r="4" fill={line} />
      </>
    ),
    belt: (
      <>
        <rect x="84" y="90" width="32" height="40" rx="3" fill="none" stroke={gold} strokeWidth="3" />
        <rect x="96" y="104" width="8" height="12" rx="1" fill={gold} />
      </>
    ),
  }[type];

  const viewBox = variant === 2 ? '40 30 120 150' : '0 0 200 250';
  const transform =
    variant === 1 ? 'translate(200 14) scale(-1 1)' : variant === 3 ? 'translate(0 14) rotate(-7 100 110)' : 'translate(0 14)';

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`bg${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1d1d" />
          <stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id={`sh${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="0.6" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill={`url(#bg${uid})`} />
      <ellipse cx="100" cy="232" rx="64" ry="6" fill="#000000" opacity="0.5" />
      <g transform={transform}>
        <path d={d} fill={color} stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" strokeLinejoin="round" />
        <path d={d} fill={`url(#sh${uid})`} />
        {details && detail}
      </g>
    </svg>
  );
}
