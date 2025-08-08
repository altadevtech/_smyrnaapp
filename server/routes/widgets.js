import express from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Listar widgets públicos (para renderização)
router.get('/public', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    'SELECT * FROM widgets ORDER BY name',
    (err, widgets) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar widgets' })
      }
      
      // Parse do JSON para cada widget
      widgets.forEach(widget => {
        if (widget.config) {
          widget.config = JSON.parse(widget.config)
        }
      })
      
      res.json(widgets)
    }
  )
})

// Buscar widget específico
router.get('/public/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  db.get(
    'SELECT * FROM widgets WHERE id = ?',
    [id],
    (err, widget) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar widget' })
      }
      
      if (!widget) {
        return res.status(404).json({ message: 'Widget não encontrado' })
      }
      
      // Parse do JSON
      if (widget.config) {
        widget.config = JSON.parse(widget.config)
      }
      
      res.json(widget)
    }
  )
})

// Widget de notícias - endpoint especial para carregar posts
router.get('/news/posts', (req, res) => {
  const { limit = 6 } = req.query
  const db = Database.getDb()
  
  db.all(
    `SELECT p.id, p.title, p.content, p.created_at, u.name as author_name 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     WHERE p.status = 'published' 
     ORDER BY p.created_at DESC 
     LIMIT ?`,
    [parseInt(limit)],
    (err, posts) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar posts' })
      }
      res.json(posts)
    }
  )
})

// Todas as rotas abaixo necessitam autenticação
router.use(authenticateToken)

// Listar widgets (admin/editor)
router.get('/', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    'SELECT * FROM widgets ORDER BY name',
    (err, widgets) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar widgets' })
      }
      
      // Parse do JSON para cada widget
      widgets.forEach(widget => {
        if (widget.config) {
          widget.config = JSON.parse(widget.config)
        }
      })
      
      res.json(widgets)
    }
  )
})

// Buscar widget específico (admin/editor)
router.get('/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  db.get(
    'SELECT * FROM widgets WHERE id = ?',
    [id],
    (err, widget) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar widget' })
      }
      
      if (!widget) {
        return res.status(404).json({ message: 'Widget não encontrado' })
      }
      
      // Parse do JSON
      if (widget.config) {
        widget.config = JSON.parse(widget.config)
      }
      
      res.json(widget)
    }
  )
})

// Criar widget
router.post('/', (req, res) => {
  const { type, name, config } = req.body

  if (!type || !name || !config) {
    return res.status(400).json({ message: 'Tipo, nome e configuração são obrigatórios' })
  }

  // Validar tipo de widget
  const validTypes = ['banner', 'news', 'login', 'contact', 'image', 'video', 'content']
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Tipo de widget inválido' })
  }

  const db = Database.getDb()
  
  db.run(
    'INSERT INTO widgets (type, name, config) VALUES (?, ?, ?)',
    [type, name, JSON.stringify(config)],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao criar widget' })
      }

      res.status(201).json({ 
        id: this.lastID,
        message: 'Widget criado com sucesso' 
      })
    }
  )
})

// Atualizar widget
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { type, name, config } = req.body

  if (!type || !name || !config) {
    return res.status(400).json({ message: 'Tipo, nome e configuração são obrigatórios' })
  }

  // Validar tipo de widget
  const validTypes = ['banner', 'news', 'login', 'contact', 'image', 'video', 'content']
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Tipo de widget inválido' })
  }

  const db = Database.getDb()
  
  db.run(
    'UPDATE widgets SET type = ?, name = ?, config = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [type, name, JSON.stringify(config), id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar widget' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Widget não encontrado' })
      }

      res.json({ message: 'Widget atualizado com sucesso' })
    }
  )
})

// Excluir widget
router.delete('/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  db.run('DELETE FROM widgets WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Erro ao excluir widget' })
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Widget não encontrado' })
    }

    res.json({ message: 'Widget excluído com sucesso' })
  })
})

// Endpoint para upload de arquivos (implementação básica)
router.post('/upload', (req, res) => {
  // Por enquanto retorna URL simulada
  // Em produção, implementar upload real para storage/CDN
  res.json({ 
    url: '/uploads/placeholder-image.jpg',
    message: 'Upload simulado - implementar upload real em produção' 
  })
})

export default router
