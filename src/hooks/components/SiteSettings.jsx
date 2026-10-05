import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import useSite, { resetSite, updateSite } from '../hooks/useSite';
import { fileToDataUrl } from '../utils/image';
import { safeUrl } from '../utils/social';

const SOCIAL = [
  ['instagram', 'Instagram', 'https://www.instagram.com/tu_tienda'],
  ['tiktok', 'TikTok', 'https://www.tiktok.com/@tu_tienda'],
  ['facebook', 'Facebook', 'https://www.facebook.com/tu_tienda'],
  ['telegram', 'Telegram', 'https://t.me/tu_tienda'],
];

const toLines = (s) =>
  s
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);

const toForm = (s) => ({
  name: s.name,
  tagline: s.tagline,
  banner: s.banner,
  intro: s.intro !== false,
  heroEyebrow: s.heroEyebrow,
  heroTitle1: s.heroTitle1,
  heroTitle2: s.heroTitle2,
  heroText: s.heroText,
  heroButton: s.heroButton,
  heroImage: s.heroImage || '',
  aboutTitle: s.aboutTitle,
  aboutText: s.aboutText,
  email: s.email,
  whatsapp: s.whatsapp,
  instagram: s.instagram,
  tiktok: s.tiktok,
  facebook: s.facebook,
  telegram: s.telegram,
  currency: s.currency,
  freeShippingFrom: String(s.freeShippingFrom),
  shippingStandard: String(s.shipping.standard),
  shippingExpress: String(s.shipping.express),
  returnDays: String(s.returnDays),
  paymentMethods: s.paymentMethods.join('\n'),
  categories: s.categories.join('\n'),
});

function Field({ id, label, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-neutral-600">{hint}</p>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <fieldset className="space-y-4 border border-white/10 p-5">
      <legend className="px-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">{title}</legend>
      {children}
    </fieldset>
  );
}

// Edita los textos, enlaces, envío y demás ajustes de la tienda. Los cambios se ven al guardar.
export default function SiteSettings() {
  const site = useSite();
  const [f, setF] = useState(() => toForm(site));
  const [msg, setMsg] = useState({ kind: '', text: '' });

  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const fail = (text) => setMsg({ kind: 'error', text });

  const pickHero = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const url = await fileToDataUrl(file, 1000);
      setF((v) => ({ ...v, heroImage: url }));
    } catch {
      fail('No se pudo leer la imagen. Prueba con un JPG o PNG.');
    }
  };

  const save = (e) => {
    e.preventDefault();
    if (!f.name.trim()) return fail('Escribe el nombre de la tienda.');
    for (const [key, label] of SOCIAL) {
      if (f[key].trim() && !safeUrl(f[key])) return fail(`El enlace de ${label} no es válido. Pega la dirección completa, por ejemplo ${SOCIAL.find((s) => s[0] === key)[2]}.`);
    }
    const nums = {
      freeShippingFrom: Number(f.freeShippingFrom),
      standard: Number(f.shippingStandard),
      express: Number(f.shippingExpress),
      returnDays: Number(f.returnDays),
    };
    if (Object.values(nums).some((n) => !Number.isFinite(n) || n < 0)) return fail('Revisa los números de envío y devoluciones: deben ser 0 o más.');
    const categories = toLines(f.categories);
    if (categories.length === 0) return fail('Agrega al menos una categoría.');

    const saved = updateSite({
      name: f.name.trim(),
      tagline: f.tagline.trim(),
      banner: f.banner.trim(),
      intro: f.intro,
      heroEyebrow: f.heroEyebrow.trim(),
      heroTitle1: f.heroTitle1.trim(),
      heroTitle2: f.heroTitle2.trim(),
      heroText: f.heroText.trim(),
      heroButton: f.heroButton.trim() || 'Ver colección',
      heroImage: f.heroImage || null,
      aboutTitle: f.aboutTitle.trim(),
      aboutText: f.aboutText.trim(),
      email: f.email.trim(),
      whatsapp: f.whatsapp.replace(/\D/g, ''),
      instagram: safeUrl(f.instagram),
      tiktok: safeUrl(f.tiktok),
      facebook: safeUrl(f.facebook),
      telegram: safeUrl(f.telegram),
      currency: f.currency,
      freeShippingFrom: nums.freeShippingFrom,
      shipping: { standard: nums.standard, express: nums.express },
      returnDays: nums.returnDays,
      paymentMethods: toLines(f.paymentMethods),
      categories,
    });
    setMsg(
      saved
        ? { kind: 'ok', text: 'Cambios guardados. Ya se ven en la tienda.' }
        : { kind: 'error', text: 'Se aplicaron, pero el navegador no pudo guardarlos para la próxima vez (¿la foto es muy pesada?).' }
    );
  };

  const restore = () => {
    if (!window.confirm('Esto vuelve a los textos, enlaces y ajustes originales de la tienda. ¿Continuar?')) return;
    setF(toForm(resetSite()));
    setMsg({ kind: 'ok', text: 'Se restauraron los ajustes originales.' });
  };

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <Section title="Identidad">
        <Field id="st-name" label="Nombre de la tienda">
          <input id="st-name" className="input" value={f.name} onChange={set('name')} />
        </Field>
        <Field id="st-tagline" label="Frase corta" hint="Aparece en la pestaña del navegador y en la animación de entrada.">
          <input id="st-tagline" className="input" value={f.tagline} onChange={set('tagline')} />
        </Field>
        <Field id="st-banner" label="Barra de aviso superior" hint="Déjala vacía para ocultar la barra.">
          <input id="st-banner" className="input" value={f.banner} onChange={set('banner')} />
        </Field>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-300">
          <input type="checkbox" checked={f.intro} onChange={set('intro')} className="h-4 w-4 accent-[#b8975a]" />
          Mostrar la animación de entrada al abrir la página
        </label>
      </Section>

      <Section title="Portada (inicio)">
        <Field id="st-eyebrow" label="Texto pequeño sobre el titular">
          <input id="st-eyebrow" className="input" value={f.heroEyebrow} onChange={set('heroEyebrow')} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="st-t1" label="Titular, línea 1">
            <input id="st-t1" className="input" value={f.heroTitle1} onChange={set('heroTitle1')} />
          </Field>
          <Field id="st-t2" label="Titular, línea 2">
            <input id="st-t2" className="input" value={f.heroTitle2} onChange={set('heroTitle2')} />
          </Field>
        </div>
        <Field id="st-htext" label="Texto debajo del titular">
          <input id="st-htext" className="input" value={f.heroText} onChange={set('heroText')} />
        </Field>
        <Field id="st-hbtn" label="Texto del botón">
          <input id="st-hbtn" className="input" value={f.heroButton} onChange={set('heroButton')} />
        </Field>
        <div>
          <p className="label">Foto principal</p>
          <div className="flex items-center gap-4">
            <div className="grid h-28 w-[5.5rem] shrink-0 place-items-center overflow-hidden bg-ink-800 text-[10px] text-neutral-600">
              {f.heroImage ? <img src={f.heroImage} alt="Vista previa de la foto principal" className="h-full w-full object-cover" /> : 'Sin foto'}
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="btn cursor-pointer !px-4 !py-2.5 focus-within:outline focus-within:outline-2 focus-within:outline-gold">
                <ImagePlus size={15} />
                Subir foto
                <input type="file" accept="image/*" className="sr-only" onChange={pickHero} />
              </label>
              {f.heroImage && (
                <button type="button" className="btn !px-4 !py-2.5" onClick={() => setF((v) => ({ ...v, heroImage: '' }))}>
                  <X size={15} />
                  Quitar
                </button>
              )}
            </div>
          </div>
          <p className="mt-1.5 text-xs text-neutral-600">Mejor vertical (4:5). Sin foto se muestra una ilustración de ejemplo.</p>
        </div>
      </Section>

      <Section title="Sobre nosotros">
        <Field id="st-atitle" label="Título">
          <input id="st-atitle" className="input" value={f.aboutTitle} onChange={set('aboutTitle')} />
        </Field>
        <Field id="st-atext" label="Texto" hint="Se muestra en el inicio y en la página Nosotros.">
          <textarea id="st-atext" rows={4} className="input" value={f.aboutText} onChange={set('aboutText')} />
        </Field>
      </Section>

      <Section title="Contacto y redes">
        <Field id="st-email" label="Correo">
          <input id="st-email" type="email" className="input" value={f.email} onChange={set('email')} />
        </Field>
        <Field id="st-wa" label="WhatsApp" hint="Solo el número con lada, por ejemplo 5216641234567. Déjalo vacío para ocultarlo.">
          <input id="st-wa" inputMode="numeric" className="input" value={f.whatsapp} onChange={set('whatsapp')} />
        </Field>
        {SOCIAL.map(([key, label, ph]) => (
          <Field key={key} id={`st-${key}`} label={label} hint={key === 'instagram' ? 'Pega el enlace completo. Si lo dejas vacío, esa red no se muestra.' : undefined}>
            <input id={`st-${key}`} className="input" placeholder={ph} value={f[key]} onChange={set(key)} />
          </Field>
        ))}
      </Section>

      <Section title="Envíos y devoluciones">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="st-cur" label="Moneda">
            <select id="st-cur" className="input bg-ink-900" value={f.currency} onChange={set('currency')}>
              <option value="MXN">Peso mexicano (MXN)</option>
              <option value="USD">Dólar (USD)</option>
            </select>
          </Field>
          <Field id="st-ret" label="Días para cambios">
            <input id="st-ret" type="number" min="0" className="input" value={f.returnDays} onChange={set('returnDays')} />
          </Field>
          <Field id="st-ship1" label="Envío estándar">
            <input id="st-ship1" type="number" min="0" className="input" value={f.shippingStandard} onChange={set('shippingStandard')} />
          </Field>
          <Field id="st-ship2" label="Envío express">
            <input id="st-ship2" type="number" min="0" className="input" value={f.shippingExpress} onChange={set('shippingExpress')} />
          </Field>
        </div>
        <Field id="st-free" label="Envío estándar gratis desde" hint="Subtotal del carrito. Pon 0 para que siempre sea gratis.">
          <input id="st-free" type="number" min="0" className="input" value={f.freeShippingFrom} onChange={set('freeShippingFrom')} />
        </Field>
      </Section>

      <Section title="Pagos y categorías">
        <Field id="st-pay" label="Métodos de pago" hint="Uno por línea.">
          <textarea id="st-pay" rows={3} className="input" value={f.paymentMethods} onChange={set('paymentMethods')} />
        </Field>
        <Field id="st-cats" label="Categorías de la tienda" hint="Una por línea. Si quitas una categoría que ya tiene productos, esos productos siguen en la tienda pero ya no se filtran por ella.">
          <textarea id="st-cats" rows={6} className="input" value={f.categories} onChange={set('categories')} />
        </Field>
      </Section>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-3 border-t border-white/10 bg-ink-950/95 py-4 backdrop-blur">
        <button type="submit" className="btn-solid">
          Guardar cambios
        </button>
        <button type="button" className="btn" onClick={restore}>
          Restaurar originales
        </button>
        {msg.text && (
          <p role="status" className={`text-sm ${msg.kind === 'error' ? 'text-red-300' : 'text-gold-soft'}`}>
            {msg.text}
          </p>
        )}
      </div>
    </form>
  );
}
