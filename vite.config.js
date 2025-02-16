import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [vue()],
    server: {
      host: env.VITE_HOST || 'localhost',
      port: env.VITE_PORT || 3000,
      proxy: {
        '/api': {
          target: `http://localhost:${env.VITE_SERVER_PORT || 3001}`,
          changeOrigin: true
        }
      }
    }
  }
}) 