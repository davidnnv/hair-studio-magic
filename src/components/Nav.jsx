import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useApp, scrollToId } from '../lib/app.jsx';
import { STUDIO } from '../lib/content.js';
import { CallLink } from './CallLink.jsx';
import { EASE, Icon } from './bits.jsx';

const LINKS = ['services', 'owner', 'work', 'contact'];

// Wordmark modelled on the studio's gold wall letters.
export function Wordmark({ small = false }) {
  return (
    <span className={`wordmark${small ? ' wordmark-sm' : ''}`}>
      <span className="wm-magic">MAGIC</span>
      <span className="wm-sub">HAIR STUDIO</span>
    </span>
  );
}

export default function Nav() {
  const { t, lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > 500 && y > prev && !open);
  });

  // Highlight the section in view.
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    LINKS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id) => (e) => { e.preventDefault(); setOpen(false); setTimeout(() => scrollToId(id), open ? 350 : 0); };

  return (
    <>
      <motion.header className={`nav${solid ? ' is-solid' : ''}`} animate={{ y: hidden ? '-110%' : 0 }} transition={{ duration: 0.4, ease: EASE }}>
        <div className="wrap nav-row">
          <a href="#top" className="nav-brand" onClick={go('top')} aria-label={STUDIO.name}><Wordmark small /></a>
          <nav className="nav-links" aria-label={t.menu}>
            {LINKS.map((id) => (
              <a key={id} href={`#${id}`} onClick={go(id)} className={active === id ? 'is-active' : ''}>
                {t.nav[id]}
                {active === id && <motion.span layoutId="nav-dot" className="nav-dot" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button type="button" className="lang-btn" onClick={() => setLang(lang === 'mk' ? 'en' : 'mk')} aria-label={t.langLabel}>{t.langSwitch}</button>
            <CallLink className="btn btn-gold btn-sm nav-book"><Icon name="phone" size={16} /> {t.book}</CallLink>
            <button type="button" className={`burger${open ? ' is-open' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t.close : t.menu}>
              <span /><span />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" className="mmenu" initial={{ clipPath: 'circle(0% at 100% 0%)' }} animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }} transition={{ duration: 0.6, ease: EASE }}>
            <nav className="mmenu-links">
              {LINKS.map((id, i) => (
                <motion.a key={id} href={`#${id}`} onClick={go(id)} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE }}>
                  <span className="mmenu-n">0{i + 1}</span>{t.nav[id]}
                </motion.a>
              ))}
            </nav>
            <motion.div className="mmenu-foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <CallLink className="btn btn-gold"><Icon name="phone" size={18} /> {STUDIO.phone}</CallLink>
              <div className="mmenu-social">
                <a href={STUDIO.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="insta" /></a>
                <a href={STUDIO.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon name="fb" /></a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
