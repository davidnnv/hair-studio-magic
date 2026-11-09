import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp, fill } from '../lib/app.jsx';
import { IMG, STUDIO } from '../lib/content.js';
import { EASE, Icon, Reveal, RiseText } from '../components/bits.jsx';
import { Wordmark } from '../components/Nav.jsx';

export function Rating() {
  const { t } = useApp();
  const pct = (STUDIO.rating / 5) * 100;
  return (
    <section className="rating" aria-labelledby="rating-h" style={{ '--bg': `url(${IMG.sign.src})` }}>
      <div className="wrap rating-inner">
        <Reveal><p className="kicker kicker-dark"><span className="kicker-line" />Google</p></Reveal>
        <RiseText lines={[t.ratingTitle]} className="sec-title" as="h2" />
        <Reveal delay={0.15} className="rating-row">
          <span className="rating-num">{String(STUDIO.rating).replace('.', ',')}</span>
          <span className="stars" role="img" aria-label={`${STUDIO.rating} / 5`}>
            <span className="stars-base">★★★★★</span>
            <motion.span className="stars-fill" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.3, ease: EASE }}>★★★★★</motion.span>
          </span>
        </Reveal>
        <Reveal delay={0.25}><p className="rating-text">{fill(t.ratingText, { r: String(STUDIO.rating).replace('.', ','), n: STUDIO.reviews })}</p></Reveal>
        <Reveal delay={0.35}><a className="btn btn-dark" href={STUDIO.google} target="_blank" rel="noopener noreferrer">{t.readReviews} <Icon name="arrow" size={18} /></a></Reveal>
      </div>
    </section>
  );
}

export default function Contact() {
  const { t, lang } = useApp();
  const [copied, setCopied] = useState(false);
  const q = encodeURIComponent(STUDIO.mapQuery);
  const copy = async () => { try { await navigator.clipboard.writeText(STUDIO.address[lang]); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {} };

  return (
    <section id="contact" className="section contact">
      <div className="wrap contact-grid">
        <div className="contact-copy">
          <Reveal><p className="kicker"><span className="kicker-line" />{t.contactKicker}</p></Reveal>
          <RiseText lines={[t.contactTitle]} className="sec-title" />
          <Reveal delay={0.1}><p className="contact-text">{t.contactText}</p></Reveal>

          <Reveal delay={0.15} className="appt">
            <span className="appt-dot" aria-hidden="true" />
            <div><b>{t.byAppointment}</b><span>{t.byAppointmentNote}</span></div>
          </Reveal>

          <dl className="contact-list">
            <Reveal delay={0.2} className="c-row">
              <dt><Icon name="phone" /> {t.phone}</dt>
              <dd><a href={`tel:${STUDIO.tel}`} className="c-big">{STUDIO.phone}</a></dd>
            </Reveal>
            <Reveal delay={0.25} className="c-row">
              <dt><Icon name="pin" /> {t.address}</dt>
              <dd>
                <span className="c-big">{STUDIO.address[lang]}</span>
                <span className="c-actions">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noopener noreferrer">{t.directions} ↗</a>
                  <button type="button" onClick={copy}><Icon name="copy" size={14} /> {copied ? t.copied : t.copy}</button>
                </span>
              </dd>
            </Reveal>
            <Reveal delay={0.3} className="c-row">
              <dt><Icon name="insta" /> {t.follow}</dt>
              <dd className="c-social">
                <a href={STUDIO.instagram} target="_blank" rel="noopener noreferrer"><Icon name="insta" size={18} /> {STUDIO.instagramHandle}</a>
                <a href={STUDIO.facebook} target="_blank" rel="noopener noreferrer"><Icon name="fb" size={18} /> Facebook</a>
              </dd>
            </Reveal>
          </dl>
          <Reveal delay={0.35}><a className="btn btn-gold" href={`tel:${STUDIO.tel}`}><Icon name="phone" size={18} /> {t.book}</a></Reveal>
        </div>

        <motion.div className="map" initial={{ clipPath: 'inset(0 0 100% 0)' }} whileInView={{ clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }}>
          <iframe title={t.mapTitle} src={`https://maps.google.com/maps?q=${q}&z=17&hl=${lang}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="map-fallback" aria-hidden="true"><Icon name="pin" size={28} /><span>{STUDIO.address[lang]}</span></div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="footer">
      <div className="wrap footer-row">
        <Wordmark />
        <div className="footer-links">
          <a href={`tel:${STUDIO.tel}`}>{STUDIO.phone}</a>
          <a href={STUDIO.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={STUDIO.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>© {new Date().getFullYear()} {STUDIO.name}. {t.footer}</span>
        <span>{t.photosNote}</span>
      </div>
    </footer>
  );
}

// Floating call button on phones.
export function CallFab() {
  const { t } = useApp();
  return (
    <motion.a className="call-fab" href={`tel:${STUDIO.tel}`} aria-label={`${t.call} ${STUDIO.phone}`}
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 16 }}>
      <Icon name="phone" size={22} />
      <span className="call-ping" aria-hidden="true" />
    </motion.a>
  );
}
