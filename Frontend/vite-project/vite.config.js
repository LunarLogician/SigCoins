import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/SigCoins/',
  build: {
    rollupOptions: {
      external: ['react-router-dom', 'axios'],  // Externalize both react-router-dom and axios
    },
  },
})
