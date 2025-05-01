import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  // 兼容 Next.js 的公共资源目录
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
  // 开发服务器配置
  server: {
    port: 3000,
  },
}) 