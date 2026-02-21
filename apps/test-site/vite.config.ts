import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['cc20-2a02-aa1-1644-5545-451f-bf77-5c23-4c82.ngrok-free.app'],
  },
  plugins: [react()],
})
