import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import "@tremor/react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
