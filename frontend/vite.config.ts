import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-antd': ['antd', '@ant-design/icons'],
          'vendor-ag-grid': ['ag-grid-react', 'ag-grid-community'],
          'vendor-query': ['@tanstack/react-query', 'axios'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/cafes': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/cafe': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/employees': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/employee': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
