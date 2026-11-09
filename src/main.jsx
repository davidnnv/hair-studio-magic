import React from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import '@fontsource/jost/cyrillic-400.css';
import '@fontsource/jost/cyrillic-500.css';
import '@fontsource/jost/latin-400.css';
import '@fontsource/jost/latin-500.css';
import '@fontsource/cormorant-garamond/cyrillic-400-italic.css';
import '@fontsource/cormorant-garamond/cyrillic-500-italic.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/manrope/cyrillic-400.css';
import '@fontsource/manrope/cyrillic-500.css';
import '@fontsource/manrope/cyrillic-600.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
);
