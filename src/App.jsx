import { motion, useScroll, useSpring } from 'framer-motion';
import { AppProvider } from './lib/app.jsx';
import Nav from './components/Nav.jsx';
import Hero, { Marquee } from './sections/Hero.jsx';
import Services from './sections/Services.jsx';
import Owner from './sections/Owner.jsx';
import Work from './sections/Work.jsx';
import Contact, { CallFab, Footer, Rating } from './sections/Contact.jsx';

function Progress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="progress" style={{ scaleX: x }} aria-hidden="true" />;
}

export default function App() {
  return (
    <AppProvider>
      <Progress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Owner />
        <Work />
        <Rating />
        <Contact />
      </main>
      <Footer />
      <CallFab />
    </AppProvider>
  );
}
