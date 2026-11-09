import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../lib/app.jsx';
import { EASE, Icon, Reveal, RiseText } from '../components/bits.jsx';

const PHOTO = { styling: 'img/bw-glam.jpg', colour: 'img/blonde-waves.jpg', makeup: 'img/rollers.jpg' };

export default function Services() {
  const { t } = useApp();
  const [hover, setHover] = useState('colour');

  return (
    <section id="services" className="section services">
      <div className="wrap">
        <header className="sec-head">
          <Reveal><p className="kicker"><span className="kicker-line" />{t.servicesKicker}</p></Reveal>
          <RiseText lines={[t.servicesTitle]} className="sec-title" />
        </header>

        <div className="svc-layout">
          <ul className="svc-list">
            {t.services.map((s, i) => (
              <motion.li key={s.id} className={`svc${hover === s.id ? ' is-on' : ''}`} onMouseEnter={() => setHover(s.id)} onFocus={() => setHover(s.id)} tabIndex={0}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}>
                <div className="svc-img-m"><img src={PHOTO[s.id]} alt="" loading="lazy" /></div>
                <div className="svc-body">
                  <h3 className="svc-title">
                    <span>{s.title}</span>
                    <span className="svc-arrow"><Icon name="arrow" size={28} /></span>
                  </h3>
                  <p className="svc-text">{s.text}</p>
                  <ul className="svc-tags">{s.items.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              </motion.li>
            ))}
          </ul>

          <div className="svc-visual" aria-hidden="true">
            <div className="svc-frame">
              <AnimatePresence mode="popLayout">
                <motion.img key={hover} src={PHOTO[hover]} alt="" initial={{ opacity: 0, scale: 1.12, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.8, ease: EASE }} />
              </AnimatePresence>
              <span className="svc-frame-line" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
