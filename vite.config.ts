import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env from .env files and system environment
  const env = loadEnv(mode, process.cwd(), '');

  // Get API key from env or system environment
  const apiKey = env.VITE_API_KEY || process.env.VITE_API_KEY || '';

  console.log(`[Vite] Building in ${mode} mode`);
  console.log(`[Vite] API Key present: ${apiKey ? 'Yes' : 'No'}`);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    define: {
      'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey)
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'recharts']
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': [
              'react',
              'react-dom',
            ],
            'charts': ['recharts'],
            'icons': ['lucide-react'],
            'qr': ['jsqr'],
            'gemini': ['@google/genai'],
          }
        }
      }
    }
  };
});