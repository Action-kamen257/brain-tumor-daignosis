import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/predict': 'http://localhost:8000',
      '/gradcam': 'http://localhost:8000',
      '/outputs': 'http://localhost:8000',
    }
  }
})
