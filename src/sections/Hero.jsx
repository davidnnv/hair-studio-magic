import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useApp, scrollToId } from '../lib/app.jsx';
import { IMG, STUDIO } from '../lib/content.js';
import { Counter, EASE, GoldDust, Icon } from '../components/bits.jsx';

const LETTERS = 'MAGIC'.split('');

export default function Hero() {
  const { t } = useApp();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yBig = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const ySmall = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const yWord = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);

  return (
    <section id="top" className="hero" ref={ref}>
      <GoldDust />
      <motion.div className="hero-word" style={{ y: yWord }} aria-hidden="true">
        {LETTERS.map((l, i) => (
          <motion.span key={i} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 + i * 0.08, ease: EASE }}>{l}</motion.span>
        ))}
      </motion.div>

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.p className="kicker" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <span className="kicker-line" />{t.heroKicker}
          </motion.p>
          <h1 className="hero-title">
            {t.heroLine.map((l, i) => (
              <span key={i} className="rise-mask">
                <motion.span className={`rise-line${i === 1 ? ' serif-it gold-text' : ''}`} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.6 + i * 0.14, ease: EASE }}>{l}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hero-text" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.9, ease: EASE }}>{t.heroText}</motion.p>
          <motion.div className="hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.9, ease: EASE }}>
            <a className="btn btn-gold" href={`tel:${STUDIO.tel}`}><Icon name="phone" size={18} /> {t.book}</a>
            <button type="button" className="btn btn-line" onClick={() => scrollToId('work')}>{t.seeWork} <Icon name="arrow" size={18} /></button>
          </motion.div>
          <motion.dl className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35, duration: 1 }}>
            <div><dt><Counter to={STUDIO.years} suffix="+" /></dt><dd>{t.statYears}</dd></div>
            <div><dt><Counter to={STUDIO.rating} decimals={1} /><span className="star">★</span></dt><dd>{t.statRating}</dd></div>
            <div><dt>{t.vip}</dt><dd>{t.statVip}</dd></div>
          </motion.dl>
        </div>

        <div className="hero-photos">
          <motion.figure className="hp-main" style={{ y: yBig }} initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} transition={{ duration: 1.4, delay: 0.3, ease: EASE }}>
            <motion.img src={IMG.portrait.src} alt={STUDIO.owner} style={{ objectPosition: IMG.portrait.pos }} initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 2, delay: 0.3, ease: EASE }} />
          </motion.figure>
          <motion.figure className="hp-small" style={{ y: ySmall }} initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.2, delay: 0.75, ease: EASE }}>
            <img src={IMG.atWork.src} alt="" style={{ objectPosition: IMG.atWork.pos }} />
          </motion.figure>
          <motion.div className="hp-badge" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 1.4, type: 'spring', stiffness: 160, damping: 14 }}>
            <svg viewBox="0 0 120 120" className="badge-ring" aria-hidden="true">
              <defs><path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
              <text><textPath href="#circ">HAIR · COLOUR · MAKE-UP · STRUMICA ·</textPath></text>
            </svg>
            <span className="badge-core">7+</span>
          </motion.div>
        </div>
      </div>

      <motion.button type="button" className="scroll-cue" onClick={() => scrollToId('services')} aria-label={t.nav.services}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
        <span className="scroll-cue-line" />
      </motion.button>
    </section>
  );
}

export function Marquee() {
  const { t } = useApp();
  const items = [...t.marquee, ...t.marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((m, i) => <span key={i}>{m}<i>✦</i></span>)}
      </div>
    </div>
  );
}
