import express from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Todas as rotas necessitam autenticação
router.use(authenticateToken)

// Rota de teste do banco de dados
router.get('/test-db', (req, res) => {
  const db = Database.getDb()
  
  if (!db) {
    return res.status(500).json({ message: 'Banco de dados não disponível' })
  }

  // Testar todas as tabelas
  const tests = []
  
  // Testar tabela users
  tests.push(new Promise((resolve) => {
    db.all('SELECT * FROM users', (err, result) => {
      resolve({ table: 'users', error: err?.message, count: result?.length || 0, data: result })
    })
  }))

  // Testar tabela pages
  tests.push(new Promise((resolve) => {
    db.all('SELECT * FROM pages', (err, result) => {
      resolve({ table: 'pages', error: err?.message, count: result?.length || 0, data: result })
    })
  }))

  // Testar tabela posts
  tests.push(new Promise((resolve) => {
    db.all('SELECT * FROM posts', (err, result) => {
      resolve({ table: 'posts', error: err?.message, count: result?.length || 0, data: result })
    })
  }))

  Promise.all(tests).then(results => {
    res.json({
      database: 'SQLite',
      status: 'connected',
      tables: results
    })
  })
})

// Estatísticas do dashboard
router.get('/stats', (req, res) => {
  const db = Database.getDb()
  
  if (!db) {
    return res.status(500).json({ message: 'Banco de dados não disponível' })
  }

  // Contar totais com tratamento melhorado
  const countPages = () => new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM pages', (err, result) => {
      if (err) {
        console.error('Erro ao contar páginas do wiki:', err)
        reject(err)
      } else {
        console.log('Páginas do wiki encontradas:', result)
        resolve(result?.count || 0)
      }
    })
  })

  const countPosts = () => new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM posts', (err, result) => {
      if (err) {
        console.error('Erro ao contar posts:', err)
        reject(err)
      } else {
        console.log('Posts encontrados:', result)
        resolve(result?.count || 0)
      }
    })
  })

  const countUsers = () => new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM users WHERE status = ?', ['active'], (err, result) => {
      if (err) {
        console.error('Erro ao contar usuários:', err)
        reject(err)
      } else {
        console.log('Usuários encontrados:', result)
        resolve(result?.count || 0)
      }
    })
  })

  // Executar todas as consultas
  Promise.all([countPages(), countPosts(), countUsers()])
    .then(([totalPages, totalPosts, totalUsers]) => {
      console.log('Totais calculados:', { totalPages, totalPosts, totalUsers })
      
      // Buscar atividade recente
      const recentActivityQuery = `
        SELECT * FROM (
          SELECT 
            'criou página' as action,
            p.title,
            u.name as author_name,
            p.created_at as activity_date
          FROM pages p
          JOIN users u ON p.author_id = u.id
          UNION ALL
          SELECT 
            'criou post' as action,
            p.title,
            u.name as author_name,
            p.created_at as activity_date
          FROM posts p
          JOIN users u ON p.author_id = u.id
        ) 
        ORDER BY activity_date DESC
        LIMIT 10
      `

      db.all(recentActivityQuery, (err, recentActivity) => {
        if (err) {
          console.error('Erro ao buscar atividade recente:', err)
          recentActivity = []
        }

        const response = {
          totalPages: parseInt(totalPages) || 0,
          totalPosts: parseInt(totalPosts) || 0,
          totalUsers: req.user.role === 'admin' ? (parseInt(totalUsers) || 0) : 0,
          recentActivity: recentActivity || []
        }

        console.log('Resposta final:', response)
        res.json(response)
      })

    })
    .catch(error => {
      console.error('Erro ao buscar estatísticas:', error)
      res.status(500).json({ 
        message: 'Erro ao buscar estatísticas',
        error: error.message,
        totalPages: 0,
        totalPosts: 0,
        totalUsers: 0,
        recentActivity: []
      })
    })
})

export default router
