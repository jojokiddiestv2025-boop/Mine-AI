
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all envs regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Prioritize MINE_AI_GATEWAY_KEY from both file-based env and system-level process.env (Netlify)
  const apiKey = env.MINE_AI_GATEWAY_KEY || 
                 process.env.MINE_AI_GATEWAY_KEY || 
                 env.VITE_API_KEY || 
                 env.API_KEY || 
                 "";

  console.log(`[MINE AI Build] API Key detected: ${apiKey ? 'YES' : 'NO'}`);

  return {
    plugins: [react()],
    define: {
      // Replaces process.env.API_KEY in the source code with the actual key string
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
    },
    server: {
      port: 3000,
    }
  };
});
