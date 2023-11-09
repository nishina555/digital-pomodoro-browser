import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base: './',
  base: "/digital-pomodoro-browser/",
  // base: "/digital-pomodoro-browser/",
  build: {
    // `root` からの相対パスで指定する
    outDir: './docs',
  },
  plugins: [
    // Emotionが提供するcssプロパティ等を反映するために必要となる
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
})
