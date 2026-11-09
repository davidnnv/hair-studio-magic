import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works on GitHub Pages under /hair-studio-magic/.
export default defineConfig({ base: './', plugins: [react()] });
