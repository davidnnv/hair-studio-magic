import { createContext, useContext, useEffect, useState } from 'react';
import { T } from './content.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

function initialLang() {
  try { const s = localStorage.getItem('magic-lang'); if (s === 'mk' || s === 'en') return s; } catch {}
  return 'mk'; // the studio's audience is local; English is one tap away
}

export function AppProvider({ children }) {
  const [lang, setLang] = useState(initialLang);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('magic-lang', lang); } catch {}
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang, t: T[lang] }}>{children}</Ctx.Provider>;
}

export const fill = (s, vars) => Object.entries(vars).reduce((a, [k, v]) => a.replaceAll(`{${k}}`, v), s);

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top: y, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
