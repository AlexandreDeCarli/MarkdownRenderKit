import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { execSync } from 'child_process'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

let gitCommit = ''
try {
  gitCommit = execSync('git rev-parse --short HEAD').toString().trim()
} catch (e) {
  gitCommit = 'dev'
}

const now = new Date()
const formattedBuildTime = now.toLocaleString('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_BUILD_INFO__: JSON.stringify({
      version: pkg.version || '1.0.0',
      buildTime: now.toISOString(),
      formattedBuildTime,
      commit: gitCommit,
    })
  }
})
