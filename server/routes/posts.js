import express from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Listar posts públicos (sem autenticação)
router.get('/public', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    `SELECT p.id, p.title, p.slug, p.summary, p.content, p.featured_image, p.created_at, p.updated_at, 
            u.name as author_name, c.name as category_name, c.slug as category_slug, c.color as category_color 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id 
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

// Buscar post público por ID (temporário - sem funcionalidade de slug)
router.get('/public/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  // Buscar apenas por ID (funcionalidade temporária sem slug)
  db.get(
    `SELECT p.*, u.name as author_name, c.name as category_name, c.slug as category_slug, c.color as category_color 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id 
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

// Endpoint público para posts recentes
router.get('/recent', (req, res) => {
  const db = Database.getDb()
  const { limit = 10 } = req.query
  
  db.all(
    `SELECT p.id, p.title, p.slug, p.summary, p.featured_image, p.created_at, p.updated_at, 
            u.name as author_name, c.name as category_name, c.slug as category_slug, c.color as category_color 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id AND c.type = 'blog'
     WHERE p.status = 'published' 
     ORDER BY p.created_at DESC 
     LIMIT ?`,
    [parseInt(limit)],
    (err, posts) => {
      if (err) {
        console.error('Erro ao buscar posts recentes:', err)
        return res.status(500).json({ message: 'Erro ao buscar posts recentes' })
      }
      res.json(posts)
    }
  )
})

// Todas as rotas abaixo necessitam autenticação
router.use(authenticateToken)

// Listar posts (admin/editor)
router.get('/', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    `SELECT p.id, p.title, p.content, p.status, p.created_at, p.updated_at, 
            u.name as author_name, c.name as category_name, c.slug as category_slug, c.color as category_color 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id 
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
    `SELECT p.*, u.name as author_name, c.name as category_name, c.slug as category_slug, c.color as category_color 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id 
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
  console.log('📝 Tentativa de criar post:', req.body)
  console.log('👤 Usuário autenticado:', req.user)
  
  const { title, slug, summary, content, status = 'draft', category_id, featured_image } = req.body

  if (!title || !content) {
    console.log('❌ Erro: Título ou conteúdo faltando')
    return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' })
  }

  if (!slug || !slug.trim()) {
    console.log('❌ Erro: Slug é obrigatório')
    return res.status(400).json({ message: 'Slug é obrigatório' })
  }

  if (!['draft', 'published'].includes(status)) {
    console.log('❌ Erro: Status inválido:', status)
    return res.status(400).json({ message: 'Status inválido' })
  }

  const db = Database.getDb()
  
  console.log('💾 Executando inserção no banco...')
  db.run(
    'INSERT INTO posts (title, slug, summary, content, status, author_id, category_id, featured_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, slug.trim(), summary || '', content, status, req.user.id, category_id || null, featured_image || null],
    function(err) {
      if (err) {
        console.error('❌ Erro ao inserir post no banco:', err)
        // Verificar se é erro de slug duplicado
        if (err.message.includes('UNIQUE constraint failed: posts.slug')) {
          return res.status(400).json({ message: 'Este slug já está sendo usado. Por favor, escolha outro.' })
        }
        return res.status(500).json({ message: 'Erro ao criar post' })
      }

      console.log('✅ Post criado com sucesso, ID:', this.lastID)
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
  const { title, slug, summary, content, status, category_id, featured_image } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' })
  }

  if (!slug || !slug.trim()) {
    return res.status(400).json({ message: 'Slug é obrigatório' })
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
      'UPDATE posts SET title = ?, slug = ?, summary = ?, content = ?, status = ?, category_id = ?, featured_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, slug.trim(), summary || '', content, status, category_id || null, featured_image || null, id],
      function(err) {
        if (err) {
          // Verificar se é erro de slug duplicado
          if (err.message.includes('UNIQUE constraint failed: posts.slug')) {
            return res.status(400).json({ message: 'Este slug já está sendo usado. Por favor, escolha outro.' })
          }
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
