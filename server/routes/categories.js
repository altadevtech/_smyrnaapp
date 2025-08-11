import express from 'express'
import database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Listar todas as categorias (público)
router.get('/', (req, res) => {
  const db = database.getDb()
  
  db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
    if (err) {
      console.error('Erro ao buscar categorias:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    res.json(categories)
  })
})

// Buscar categoria por ID (público)
router.get('/:id', (req, res) => {
  const db = database.getDb()
  const { id } = req.params
  
  db.get('SELECT * FROM categories WHERE id = ?', [id], (err, category) => {
    if (err) {
      console.error('Erro ao buscar categoria:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' })
    }
    
    res.json(category)
  })
})

// Buscar categoria por slug (público)
router.get('/slug/:slug', (req, res) => {
  const db = database.getDb()
  const { slug } = req.params
  
  db.get('SELECT * FROM categories WHERE slug = ?', [slug], (err, category) => {
    if (err) {
      console.error('Erro ao buscar categoria:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' })
    }
    
    res.json(category)
  })
})

// Criar nova categoria (apenas admin)
router.post('/', authenticateToken, (req, res) => {
  const db = database.getDb()
  const { name, slug, description, color } = req.body

  // Verificar se é admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Apenas administradores podem criar categorias' })
  }

  // Validações
  if (!name || !slug) {
    return res.status(400).json({ error: 'Nome e slug são obrigatórios' })
  }

  // Verificar se o slug já existe
  db.get('SELECT id FROM categories WHERE slug = ?', [slug], (err, existingCategory) => {
    if (err) {
      console.error('Erro ao verificar slug:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }

    if (existingCategory) {
      return res.status(400).json({ error: 'Slug já existe' })
    }

    // Criar categoria
    db.run(
      'INSERT INTO categories (name, slug, description, color) VALUES (?, ?, ?, ?)',
      [name, slug, description || '', color || '#6366f1'],
      function(err) {
        if (err) {
          console.error('Erro ao criar categoria:', err)
          return res.status(500).json({ error: 'Erro interno do servidor' })
        }

        // Buscar a categoria criada
        db.get('SELECT * FROM categories WHERE id = ?', [this.lastID], (err, category) => {
          if (err) {
            console.error('Erro ao buscar categoria criada:', err)
            return res.status(500).json({ error: 'Erro interno do servidor' })
          }
          
          res.status(201).json(category)
        })
      }
    )
  })
})

// Atualizar categoria (apenas admin)
router.put('/:id', authenticateToken, (req, res) => {
  const db = database.getDb()
  const { id } = req.params
  const { name, slug, description, color } = req.body

  // Verificar se é admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Apenas administradores podem editar categorias' })
  }

  // Validações
  if (!name || !slug) {
    return res.status(400).json({ error: 'Nome e slug são obrigatórios' })
  }

  // Verificar se a categoria existe
  db.get('SELECT * FROM categories WHERE id = ?', [id], (err, category) => {
    if (err) {
      console.error('Erro ao buscar categoria:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' })
    }

    // Verificar se o slug já existe em outra categoria
    db.get('SELECT id FROM categories WHERE slug = ? AND id != ?', [slug, id], (err, existingCategory) => {
      if (err) {
        console.error('Erro ao verificar slug:', err)
        return res.status(500).json({ error: 'Erro interno do servidor' })
      }

      if (existingCategory) {
        return res.status(400).json({ error: 'Slug já existe' })
      }

      // Atualizar categoria
      db.run(
        'UPDATE categories SET name = ?, slug = ?, description = ?, color = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, slug, description || '', color || '#6366f1', id],
        function(err) {
          if (err) {
            console.error('Erro ao atualizar categoria:', err)
            return res.status(500).json({ error: 'Erro interno do servidor' })
          }

          // Buscar a categoria atualizada
          db.get('SELECT * FROM categories WHERE id = ?', [id], (err, updatedCategory) => {
            if (err) {
              console.error('Erro ao buscar categoria atualizada:', err)
              return res.status(500).json({ error: 'Erro interno do servidor' })
            }
            
            res.json(updatedCategory)
          })
        }
      )
    })
  })
})

// Deletar categoria (apenas admin)
router.delete('/:id', authenticateToken, (req, res) => {
  const db = database.getDb()
  const { id } = req.params

  // Verificar se é admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Apenas administradores podem deletar categorias' })
  }

  // Verificar se a categoria existe
  db.get('SELECT * FROM categories WHERE id = ?', [id], (err, category) => {
    if (err) {
      console.error('Erro ao buscar categoria:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' })
    }

    // Verificar se há posts usando esta categoria
    db.get('SELECT COUNT(*) as count FROM posts WHERE category_id = ?', [id], (err, result) => {
      if (err) {
        console.error('Erro ao verificar posts da categoria:', err)
        return res.status(500).json({ error: 'Erro interno do servidor' })
      }

      if (result.count > 0) {
        return res.status(400).json({ 
          error: `Não é possível deletar a categoria. Existem ${result.count} post(s) usando esta categoria.` 
        })
      }

      // Deletar categoria
      db.run('DELETE FROM categories WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Erro ao deletar categoria:', err)
          return res.status(500).json({ error: 'Erro interno do servidor' })
        }

        res.json({ message: 'Categoria deletada com sucesso' })
      })
    })
  })
})

// Buscar posts por categoria (público)
router.get('/:id/posts', (req, res) => {
  const db = database.getDb()
  const { id } = req.params
  const { status } = req.query

  let query = `
    SELECT p.*, u.name as author_name, c.name as category_name, c.color as category_color
    FROM posts p 
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ?
  `
  
  const params = [id]

  // Filtrar por status se especificado
  if (status) {
    query += ' AND p.status = ?'
    params.push(status)
  }

  query += ' ORDER BY p.created_at DESC'

  db.all(query, params, (err, posts) => {
    if (err) {
      console.error('Erro ao buscar posts da categoria:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    
    res.json(posts)
  })
})

// Buscar categorias com contagem de posts (público)
router.get('/stats/with-posts', (req, res) => {
  const db = database.getDb()
  
  const query = `
    SELECT 
      c.id,
      c.name,
      c.slug,
      c.color,
      COUNT(p.id) as post_count
    FROM categories c
    LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
    GROUP BY c.id, c.name, c.slug, c.color
    HAVING COUNT(p.id) > 0
    ORDER BY c.name
  `

  db.all(query, (err, categories) => {
    if (err) {
      console.error('Erro ao buscar categorias com posts:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    
    res.json(categories)
  })
})

export default router
