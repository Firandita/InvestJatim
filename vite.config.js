import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'generate-nojekyll',
      closeBundle() {
        fs.writeFileSync(resolve(__dirname, 'dist/.nojekyll'), '')
      }
    }
  ],
  base: '/InvestJatim/',
})