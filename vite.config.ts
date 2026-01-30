
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Cast process to any to avoid "Property 'cwd' does not exist on type 'Process'" error.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Expose VITE_API_KEY specifically as requested
      'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || process.env.VITE_API_KEY || process.env.API_KEY),
      // Keep process.env.API_KEY for compatibility with SDK defaults if needed
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || process.env.VITE_API_KEY || process.env.API_KEY),
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
