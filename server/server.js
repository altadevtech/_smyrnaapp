import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import Database from './database.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import pageRoutes from './routes/pages.js'
import postRoutes from './routes/posts.js'
import dashboardRoutes from './routes/dashboard.js'
import templateRoutes from './routes/templates.js'
import widgetRoutes from './routes/widgets.js'
import settingsRoutes from './routes/settings.js'
import categoriesRoutes from './routes/categories.js'
import menuRoutes from './routes/menus.js'
import debugRoutes from './routes/debug.js'
import pageVersionsRoutes from './routes/page-versions.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 10000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))

// Initialize database
async function initializeServer() {
  try {
    await Database.init()
    console.log('✅ Database inicializado com sucesso')
    
    // Health check route for Render
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() })
    })

    // Debug endpoint - verificar usuários no banco (TEMPORÁRIO)
    app.get('/api/debug/users', (req, res) => {
      const db = Database.getDb()
      db.all('SELECT id, name, email, role, status FROM users', (err, users) => {
        if (err) {
          res.status(500).json({ error: err.message })
        } else {
          res.json({ 
            count: users.length, 
            users: users,
            message: users.length === 0 ? 'Nenhum usuário encontrado - executar createDefaultUsers' : 'Usuários encontrados'
          })
        }
      })
    })

    // Routes
    app.use('/api/auth', authRoutes)
    app.use('/api/users', userRoutes)
    app.use('/api/pages', pageRoutes)
    app.use('/api/posts', postRoutes)
    app.use('/api/dashboard', dashboardRoutes)
    app.use('/api/templates', templateRoutes)
    app.use('/api/widgets', widgetRoutes)
    app.use('/api/settings', settingsRoutes)
    app.use('/api/categories', categoriesRoutes)
    app.use('/api/menus', menuRoutes)
    app.use('/api/debug', debugRoutes)
    app.use('/api/page-versions', pageVersionsRoutes)

    // Serve React app for all other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'))
    })

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
      console.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`)
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🖥️ Frontend: http://localhost:3000`)
      }
      console.log(`⚡ API: http://localhost:${PORT}/api`)
    })

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server')
      server.close(() => {
        console.log('HTTP server closed')
        Database.close()
        process.exit(0)
      })
    })

  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error)
    process.exit(1)
  }
}

initializeServer()
