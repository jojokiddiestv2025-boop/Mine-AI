
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load all env variables from the current directory. 
  // The third argument '' allows loading variables without the VITE_ prefix if needed,
  // but VITE_ is preferred for Vercel/Vite client-side exposure.
  // Fix: Cast process as any to access cwd() when Node types are not fully available to the TS compiler
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Prioritize VITE_API_KEY (standard for Vite) then fall back to API_KEY
  const apiKey = env.VITE_API_KEY || env.API_KEY || "";

  return {
    plugins: [react()],
    define: {
      // Replaces all occurrences of process.env.API_KEY in the source code with the actual key string
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.VITE_API_KEY': JSON.stringify(apiKey),
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: './index.html',
        },
      },
    },
    server: {
      port: 3000,
    }
  };
});
