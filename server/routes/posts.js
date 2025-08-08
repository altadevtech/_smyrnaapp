import express from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Listar posts públicos (sem autenticação)
router.get('/public', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    `SELECT p.id, p.title, p.content, p.created_at, p.updated_at, u.name as author_name 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     WHERE p.status = 'published' 
     ORDER BY p.created_at DESC 
     LIMIT 10`,
    (err, posts) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar posts' })
      }
      res.json(posts)
    }
  )
})

// Buscar post específico por slug (público)
router.get('/public/:slug', (req, res) => {
  const { slug } = req.params
  
  // Extrair ID do slug (formato: titulo-slug-ID)
  const slugParts = slug.split('-')
  const id = slugParts[slugParts.length - 1]
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Slug inválido' })
  }

  const db = Database.getDb()
  
  db.get(
    `SELECT p.*, u.name as author_name 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     WHERE p.id = ? AND p.status = 'published'`,
    [id],
    (err, post) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar post' })
      }
      
      if (!post) {
        return res.status(404).json({ message: 'Post não encontrado' })
      }
      
      res.json(post)
    }
  )
})

// Todas as rotas abaixo necessitam autenticação
router.use(authenticateToken)

// Listar posts (admin/editor)
router.get('/', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    `SELECT p.id, p.title, p.content, p.status, p.created_at, p.updated_at, u.name as author_name 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     ORDER BY p.created_at DESC`,
    (err, posts) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar posts' })
      }
      res.json(posts)
    }
  )
})

// Buscar post específico
router.get('/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  db.get(
    `SELECT p.*, u.name as author_name 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     WHERE p.id = ?`,
    [id],
    (err, post) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar post' })
      }
      
      if (!post) {
        return res.status(404).json({ message: 'Post não encontrado' })
      }
      
      res.json(post)
    }
  )
})

// Criar post
router.post('/', (req, res) => {
  const { title, content, status = 'draft' } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' })
  }

  if (!['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido' })
  }

  const db = Database.getDb()
  
  db.run(
    'INSERT INTO posts (title, content, status, author_id) VALUES (?, ?, ?, ?)',
    [title, content, status, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao criar post' })
      }

      res.status(201).json({ 
        id: this.lastID,
        message: 'Post criado com sucesso' 
      })
    }
  )
})

// Atualizar post
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { title, content, status } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' })
  }

  if (status && !['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido' })
  }

  const db = Database.getDb()
  
  // Verificar se o usuário pode editar este post
  db.get('SELECT author_id FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar post' })
    }

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' })
    }

    // Admin pode editar qualquer post, editor só seus próprios
    if (req.user.role !== 'admin' && post.author_id !== req.user.id) {
      return res.status(403).json({ message: 'Sem permissão para editar este post' })
    }

    db.run(
      'UPDATE posts SET title = ?, content = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, status, id],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Erro ao atualizar post' })
        }

        res.json({ message: 'Post atualizado com sucesso' })
      }
    )
  })
})

// Alterar status do post
router.patch('/:id/status', (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido' })
  }

  const db = Database.getDb()
  
  // Verificar se o usuário pode editar este post
  db.get('SELECT author_id FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar post' })
    }

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' })
    }

    // Admin pode editar qualquer post, editor só seus próprios
    if (req.user.role !== 'admin' && post.author_id !== req.user.id) {
      return res.status(403).json({ message: 'Sem permissão para editar este post' })
    }

    db.run(
      'UPDATE posts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Erro ao atualizar status' })
        }

        res.json({ message: 'Status atualizado com sucesso' })
      }
    )
  })
})

// Excluir post
router.delete('/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  // Verificar se o usuário pode excluir este post
  db.get('SELECT author_id FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar post' })
    }

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' })
    }

    // Admin pode excluir qualquer post, editor só seus próprios
    if (req.user.role !== 'admin' && post.author_id !== req.user.id) {
      return res.status(403).json({ message: 'Sem permissão para excluir este post' })
    }

    db.run('DELETE FROM posts WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao excluir post' })
      }

      res.json({ message: 'Post excluído com sucesso' })
    })
  })
})

export default router
