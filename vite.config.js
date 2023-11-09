import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Use the default import
import replace from '@rollup/plugin-replace';

console.log(process.env.VITE_API_KEY);

export default defineConfig({
  plugins: [react(), replace({
    'process.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY),
    'process.env.VITE_AUTH_DOMAIN': JSON.stringify(process.env.VITE_AUTH_DOMAIN),
    'process.env.VITE_DATABASE_URL': JSON.stringify(process.env.VITE_DATABASE_URL),
    'process.env.VITE_PROJECT_ID': JSON.stringify(process.env.VITE_PROJECT_ID),
    'process.env.VITE_STORAGE_BUCKET': JSON.stringify(process.env.VITE_STORAGE_BUCKET),
    'process.env.VITE_MESSAGING_SENDER_ID': JSON.stringify(process.env.VITE_MESSAGING_SENDER_ID),
    'process.env.VITE_APP_ID': JSON.stringify(process.env.VITE_APP_ID),
    'process.env.VITE_MEASUREMENT_ID': JSON.stringify(process.env.VITE_MEASUREMENT_ID),
  })],
  server: {
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
});
