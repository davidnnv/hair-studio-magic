import { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../lib/app.jsx';
import { STUDIO } from '../lib/content.js';
import { EASE, Icon } from './bits.jsx';

// Every "call / book" button is a real tel: link, so phones open the dialer straight away.
// Computers often have no dialer, so there we also show the number with a copy button.
const Ctx = createContext(() => {});

export function CallProvider({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <Ctx.Provider value={() => setOpen(true)}>
      {children}
      <CallCard open={open} onClose={() => setOpen(false)} />
    </Ctx.Provider>
  );
}

export const useShowCall = () => useContext(Ctx);

const isPhone = () => window.matchMedia('(pointer: coarse)').matches;

export function CallLink({ className, children, ...rest }) {
  const show = useContext(Ctx);
  return (
    <a href={`tel:${STUDIO.tel}`} className={className} onClick={() => { if (!isPhone()) show(); }} {...rest}>
      {children}
    </a>
  );
}

function CallCard({ open, onClose }) {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!open) { setCopied(false); return; }
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(STUDIO.phone); setCopied(true); } catch {}
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="callcard-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="callcard-bg" onClick={onClose} />
          <motion.div className="callcard" role="dialog" aria-modal="true" aria-labelledby="cc-title"
            initial={{ y: 30, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            <button type="button" className="callcard-x" onClick={onClose} aria-label={t.close}><Icon name="close" size={18} /></button>
            <span className="callcard-icon"><Icon name="phone" size={26} /><span className="call-ping" aria-hidden="true" /></span>
            <p className="kicker"><span className="kicker-line" />{t.book}</p>
            <h2 id="cc-title" className="callcard-num">{STUDIO.phone}</h2>
            <p className="callcard-text">{t.callHint}</p>
            <div className="callcard-actions">
              <a className="btn btn-gold" href={`tel:${STUDIO.tel}`} autoFocus><Icon name="phone" size={18} /> {t.call}</a>
              <button type="button" className="btn btn-line" onClick={copy}><Icon name="copy" size={16} /> {copied ? t.copied : t.copy}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
