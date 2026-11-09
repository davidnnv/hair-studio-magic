import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];

// Text that rises line by line out of a mask. The heading itself is observed (the clipped lines can't be).
export function RiseText({ lines, className = '', delay = 0, as = 'h2', id }) {
  const Tag = motion[as];
  return (
    <Tag id={id} className={className} initial="hide" whileInView="show" viewport={{ once: true, margin: '-10% 0px' }}>
      {lines.map((l, i) => (
        <span key={i} className="rise-mask">
          <motion.span className={`rise-line ${typeof l === 'object' ? l.className : ''}`}
            variants={{ hide: { y: '110%' }, show: { y: 0, transition: { duration: 1, delay: delay + i * 0.12, ease: EASE } } }}>
            {typeof l === 'object' ? l.text : l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// Fades and lifts children when scrolled into view.
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}>
      {children}
    </M>
  );
}

// Photo that is uncovered by a sliding curtain, then settles from a slight zoom.
export function RevealImage({ src, alt = '', pos = '50% 50%', className = '', delay = 0, from = 'bottom', eager = false }) {
  const clip = { bottom: 'inset(100% 0 0 0)', left: 'inset(0 100% 0 0)', right: 'inset(0 0 0 100%)', top: 'inset(0 0 100% 0)' }[from];
  return (
    <motion.div className={`reveal-img ${className}`} initial={{ clipPath: clip }} whileInView={{ clipPath: 'inset(0 0 0 0)' }}
      viewport={{ once: true, margin: '-5% 0px' }} transition={{ duration: 1.2, delay, ease: EASE }}>
      <motion.img src={src} alt={alt} style={{ objectPosition: pos }} loading={eager ? 'eager' : 'lazy'} decoding="async"
        initial={{ scale: 1.18 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, delay, ease: EASE }} />
    </motion.div>
  );
}

export function Counter({ to, decimals = 0, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: setV });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref} className="counter">{v.toFixed(decimals).replace('.', ',')}{suffix}</span>;
}

// Floating gold dust for the hero. Canvas, paused when off-screen or with reduced motion.
export function GoldDust({ density = 60 }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = cv.getContext('2d');
    let w, h, raf, running = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => { w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const parts = Array.from({ length: density }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + 0.4,
      vy: -(Math.random() * 0.25 + 0.05), vx: (Math.random() - 0.5) * 0.15, a: Math.random() * Math.PI * 2, s: Math.random() * 0.02 + 0.005,
    }));
    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.a += p.s;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        const alpha = 0.25 + Math.sin(p.a) * 0.25 + 0.25;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(240, 210, 140, ${alpha})`);
        g.addColorStop(1, 'rgba(240, 210, 140, 0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) { cancelAnimationFrame(raf); tick(); } });
    io.observe(cv);
    window.addEventListener('resize', size);
    tick();
    return () => { running = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', size); };
  }, [density]);
  return <canvas ref={ref} className="gold-dust" aria-hidden="true" />;
}

export function Icon({ name, size = 20 }) {
  const p = {
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
    pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
    insta: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></>,
    fb: <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v3.5H8V21h3.5v-7.5H14l.5-3.5h-3V7.8c0-.7.5-1.3 1.3-1.3H15z" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    down: <path d="M12 5v14M6 13l6 6 6-6" />,
    close: <path d="M18 6L6 18M6 6l12 12" />,
    left: <path d="M15 18l-6-6 6-6" />,
    right: <path d="M9 18l6-6-6-6" />,
    star: <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />,
    copy: <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></>,
    sparkle: <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" />,
  }[name];
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p}</svg>
  );
}
