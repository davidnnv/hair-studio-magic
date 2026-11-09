import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useApp } from '../lib/app.jsx';
import { WORK } from '../lib/content.js';
import { EASE, Icon, Reveal, RiseText } from '../components/bits.jsx';

const FILTERS = ['all', 'colour', 'styling', 'makeup'];

export default function Work() {
  const { t, lang } = useApp();
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null); // index into `list`
  const list = WORK.filter((w) => filter === 'all' || w.tag === filter);

  return (
    <section id="work" className="section work">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Reveal><p className="kicker"><span className="kicker-line" />{t.workKicker}</p></Reveal>
            <RiseText lines={[t.workTitle]} className="sec-title" />
          </div>
          <Reveal delay={0.1}>
            <div className="filters" role="group" aria-label={t.workKicker}>
              {FILTERS.map((f) => (
                <button key={f} type="button" className={filter === f ? 'is-on' : ''} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  <span>{t.filters[f]}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </header>

        <LayoutGroup>
          <motion.ul className="gallery" layout>
            <AnimatePresence mode="popLayout">
              {list.map((w, i) => (
                <motion.li key={w.src} layout className={`g-item g-${i % 5}`} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.6, ease: EASE }}>
                  <button type="button" className="g-btn" onClick={() => setOpen(i)} aria-label={`${t.openPhoto}: ${w[lang]}`}>
                    <motion.img layoutId={`img-${w.src}`} src={w.src} alt={w[lang]} loading="lazy" />
                    <span className="g-cap"><span className="g-tag">{t.filters[w.tag]}</span>{w[lang]}</span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          <Lightbox list={list} index={open} setIndex={setOpen} />
        </LayoutGroup>
      </div>
    </section>
  );
}

function Lightbox({ list, index, setIndex }) {
  const { t, lang } = useApp();
  const [dir, setDir] = useState(0);
  const item = index != null ? list[index] : null;
  const step = useCallback((d) => { setDir(d); setIndex((i) => (i + d + list.length) % list.length); }, [list.length, setIndex]);

  useEffect(() => {
    if (index == null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [index, step, setIndex]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div className="lb" role="dialog" aria-modal="true" aria-label={item[lang]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="lb-bg" onClick={() => setIndex(null)} />
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.figure key={item.src} className="lb-fig" custom={dir}
              initial={dir ? { x: dir * 120, opacity: 0 } : false} animate={{ x: 0, opacity: 1 }} exit={{ x: dir * -120, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.4}
              onDragEnd={(_, info) => { if (info.offset.x < -80) step(1); else if (info.offset.x > 80) step(-1); }}>
              <motion.img layoutId={dir ? undefined : `img-${item.src}`} src={item.src} alt={item[lang]} draggable="false" />
              <figcaption><span className="g-tag">{t.filters[item.tag]}</span>{item[lang]}<span className="lb-count">{index + 1} / {list.length}</span></figcaption>
            </motion.figure>
          </AnimatePresence>
          <button type="button" className="lb-btn lb-close" onClick={() => setIndex(null)} aria-label={t.close} autoFocus><Icon name="close" /></button>
          <button type="button" className="lb-btn lb-prev" onClick={() => step(-1)} aria-label={t.prev}><Icon name="left" /></button>
          <button type="button" className="lb-btn lb-next" onClick={() => step(1)} aria-label={t.next}><Icon name="right" /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
