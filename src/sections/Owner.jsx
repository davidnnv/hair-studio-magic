import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useApp } from '../lib/app.jsx';
import { IMG, STUDIO } from '../lib/content.js';
import { Counter, EASE, Reveal, RevealImage, RiseText } from '../components/bits.jsx';

// "Meet the owner": a layered portrait collage with parallax, a gold frame that draws itself,
// a giant name that slides behind, animated facts and a hand-drawn signature.
export default function Owner() {
  const { t } = useApp();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const nameX = useTransform(p, [0, 1], ['8%', '-38%']);
  const yBw = useTransform(p, [0, 1], [80, -80]);
  const yColor = useTransform(p, [0, 1], [-30, 60]);
  const rot = useTransform(p, [0, 1], [-4, 3]);

  return (
    <section id="owner" className="owner" ref={ref} aria-labelledby="owner-name">
      <motion.div className="owner-bgname" style={{ x: nameX }} aria-hidden="true">PETROV · MARJAN · PETROV</motion.div>

      <div className="wrap owner-grid">
        <div className="owner-collage">
          <motion.div className="oc-bw" style={{ y: yBw }}>
            <RevealImage src={IMG.portraitBw.src} pos={IMG.portraitBw.pos} alt={STUDIO.owner} from="bottom" />
          </motion.div>
          <motion.div className="oc-color" style={{ y: yColor, rotate: rot }}>
            <RevealImage src={IMG.portrait.src} pos={IMG.portrait.pos} alt="" from="left" delay={0.3} />
          </motion.div>
          <svg className="oc-frame" viewBox="0 0 100 130" preserveAspectRatio="none" aria-hidden="true">
            <motion.rect x="1" y="1" width="98" height="128" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
              transition={{ duration: 2.2, delay: 0.4, ease: [0.65, 0, 0.35, 1] }} />
          </svg>
          <motion.div className="oc-tag" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 1, duration: 0.8, ease: EASE }}>
            <span className="oc-tag-k">EST.</span><span className="oc-tag-v">{new Date().getFullYear() - STUDIO.years}</span>
          </motion.div>
        </div>

        <div className="owner-copy">
          <Reveal><p className="kicker"><span className="kicker-line" />{t.ownerKicker}</p></Reveal>
          <RiseText as="h2" id="owner-name" className="owner-name" lines={[t.ownerName[0], { text: t.ownerName[1], className: 'serif-it gold-text' }]} />
          <Reveal delay={0.2}><p className="owner-role">{t.ownerRole}</p></Reveal>
          <Reveal delay={0.3}><p className="owner-lead">{t.ownerLead}</p></Reveal>
          {t.ownerBody.map((b, i) => <Reveal key={i} delay={0.4 + i * 0.1}><p className="owner-body">{b}</p></Reveal>)}

          <Signature text={t.ownerSign} />

          <dl className="owner-facts">
            {t.ownerFacts.map((f, i) => (
              <Reveal key={f.label} delay={0.2 + i * 0.12} className="fact">
                <dt><Counter to={f.n} decimals={f.decimals || 0} suffix={f.suffix} /></dt>
                <dd>{f.label}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>

      <Backstage />
    </section>
  );
}

function Signature({ text }) {
  return (
    <div className="signature" aria-label={text}>
      <motion.span className="sig-text" initial={{ clipPath: 'inset(0 100% 0 0)' }} whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true }} transition={{ duration: 1.8, delay: 0.3, ease: [0.65, 0, 0.35, 1] }} aria-hidden="true">{text}</motion.span>
      <svg viewBox="0 0 300 30" className="sig-line" aria-hidden="true">
        <motion.path d="M4 20 C 60 4, 110 30, 170 14 S 260 6, 296 18" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 1.6, ease: EASE }} />
      </svg>
    </div>
  );
}

const STRIP = [
  { ...IMG.backstage, w: 'tall' },
  { ...IMG.bwBackstage, w: 'tall' },
  { ...IMG.atWork, w: 'mid' },
  { ...IMG.vipEvent, w: 'wide' },
  { ...IMG.spray, w: 'mid' },
  { ...IMG.vipSelfie, w: 'tall' },
];

// Horizontal film strip; drags on desktop, swipes on touch.
function Backstage() {
  const { t } = useApp();
  const track = useRef(null);
  const wrap = useRef(null);
  return (
    <div className="backstage">
      <div className="wrap backstage-head">
        <Reveal><h3 className="backstage-title serif-it">{t.backstageTitle}</h3></Reveal>
        <Reveal delay={0.1}><p className="backstage-text">{t.backstageText}</p></Reveal>
      </div>
      <div className="strip" ref={wrap}>
        <motion.ul className="strip-track" ref={track} drag="x" dragConstraints={wrap} dragElastic={0.08}>
          {STRIP.map((s, i) => (
            <motion.li key={s.src} className={`strip-item is-${s.w}`} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px -5% 0px 0px' }} transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}>
              <img src={s.src} alt="" style={{ objectPosition: s.pos }} loading="lazy" draggable="false" />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
