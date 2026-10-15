import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function profileFileWriterPlugin(): Plugin {
  const profilesDir = path.resolve(process.cwd(), 'src/profiles')

  return {
    name: 'profile-file-writer',
    configureServer(server) {
      server.middlewares.use('/api/save-profile', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => {
          res.setHeader('Content-Type', 'application/json')
          try {
            const { id, data } = JSON.parse(body) as { id: string; data: unknown }
            const safeId = String(id).replace(/[^a-zA-Z0-9-_]/g, '')
            if (!safeId) throw new Error('Profile is missing a valid id')

            const filePath = path.join(profilesDir, `${safeId}.json`)
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
            res.end(JSON.stringify({ ok: true, path: `src/profiles/${safeId}.json` }))
          } catch (err) {
            res.statusCode = 400
            res.end(JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'Save failed' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), profileFileWriterPlugin()],
})
