import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Make sure assets use absolute paths
  plugins: [react()],
  server: {
    host: true // Allow mobile access on LAN
  },
  build: {
    outDir: 'dist', // Output matches what Netlify expects
  }
});
