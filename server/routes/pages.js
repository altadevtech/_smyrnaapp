import express from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Listar páginas públicas (sem autenticação)
router.get('/public', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    `SELECT p.id, p.title, p.content, p.slug, p.created_at, p.updated_at, u.name as author_name 
     FROM pages p 
     JOIN users u ON p.author_id = u.id 
     WHERE p.status = 'published' AND (p.is_home IS NULL OR p.is_home = false)
     ORDER BY p.updated_at DESC`,
    (err, pages) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar páginas' })
      }
      res.json(pages)
    }
  )
})

// Buscar página específica por slug (público)
router.get('/public/:slug', (req, res) => {
  const { slug } = req.params
  const db = Database.getDb()
  
  // Buscar por slug primeiro, depois por ID como fallback
  db.get(
    `SELECT p.*, u.name as author_name, t.name as template_name, t.layout as template_layout, t.show_header, t.show_footer
     FROM pages p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN templates t ON p.template_id = t.id
     WHERE (p.slug = ? OR p.id = ?) AND p.status = 'published'`,
    [slug, slug],
    (err, page) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar página' })
      }
      
      if (!page) {
        return res.status(404).json({ message: 'Página não encontrada' })
      }
      
      // Parse JSON fields
      if (page.widget_data) {
        page.widget_data = JSON.parse(page.widget_data)
      }
      if (page.template_layout) {
        page.template_layout = JSON.parse(page.template_layout)
      }
      
      res.json(page)
    }
  )
})

// Buscar página home (público)
router.get('/public/home', (req, res) => {
  const db = Database.getDb()
  
  db.get(
    `SELECT p.*, u.name as author_name, t.name as template_name, t.layout as template_layout, t.show_header, t.show_footer
     FROM pages p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN templates t ON p.template_id = t.id
     WHERE p.is_home = true AND p.status = 'published'`,
    (err, page) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar página home' })
      }
      
      if (!page) {
        return res.status(404).json({ message: 'Página home não encontrada' })
      }
      
      // Parse JSON fields
      if (page.widget_data) {
        page.widget_data = JSON.parse(page.widget_data)
      }
      if (page.template_layout) {
        page.template_layout = JSON.parse(page.template_layout)
      }
      
      res.json(page)
    }
  )
})

// Alias para página home (sem /public)
router.get('/home', (req, res) => {
  const db = Database.getDb()
  
  db.get(
    `SELECT p.*, u.name as author_name, t.name as template_name, t.layout as template_layout, t.show_header, t.show_footer
     FROM pages p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN templates t ON p.template_id = t.id
     WHERE p.is_home = true AND p.status = 'published'`,
    (err, page) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar página home' })
      }
      
      if (!page) {
        return res.status(404).json({ message: 'Página home não encontrada' })
      }
      
      // Parse JSON fields
      if (page.widget_data) {
        page.widget_data = JSON.parse(page.widget_data)
      }
      if (page.template_layout) {
        page.template_layout = JSON.parse(page.template_layout)
      }
      
      res.json(page)
    }
  )
})

// Todas as rotas abaixo necessitam autenticação
router.use(authenticateToken)

// Listar páginas (admin/editor)
router.get('/', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    `SELECT p.id, p.title, p.content, p.status, p.slug, p.is_home, p.created_at, p.updated_at, 
            u.name as author_name, t.name as template_name 
     FROM pages p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN templates t ON p.template_id = t.id
     ORDER BY p.updated_at DESC`,
    (err, pages) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar páginas' })
      }
      res.json(pages)
    }
  )
})

// Buscar página específica
router.get('/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  db.get(
    `SELECT p.*, u.name as author_name, t.name as template_name, t.layout as template_layout 
     FROM pages p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN templates t ON p.template_id = t.id
     WHERE p.id = ?`,
    [id],
    (err, page) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar página' })
      }
      
      if (!page) {
        return res.status(404).json({ message: 'Página não encontrada' })
      }
      
      // Parse JSON fields
      if (page.widget_data) {
        page.widget_data = JSON.parse(page.widget_data)
      }
      if (page.template_layout) {
        page.template_layout = JSON.parse(page.template_layout)
      }
      
      res.json(page)
    }
  )
})

// Criar página
router.post('/', (req, res) => {
  const { title, content, status = 'draft', templateId = 1, slug, widgetData, isHome = false } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' })
  }

  if (!['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido' })
  }

  const db = Database.getDb()

  // Gerar slug se não fornecido
  const finalSlug = slug || title.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')

  // Se definindo como home, remover flag de outras páginas
  if (isHome) {
    db.run('UPDATE pages SET is_home = false WHERE is_home = true', (err) => {
      if (err) {
        console.error('Erro ao atualizar páginas home:', err)
      }
    })
  }
  
  db.run(
    'INSERT INTO pages (title, content, status, author_id, template_id, slug, widget_data, is_home) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, content, status, req.user.id, templateId, finalSlug, widgetData ? JSON.stringify(widgetData) : null, isHome],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed: pages.slug')) {
          return res.status(400).json({ message: 'Slug já está em uso' })
        }
        return res.status(500).json({ message: 'Erro ao criar página' })
      }

      res.status(201).json({ 
        id: this.lastID,
        message: 'Página criada com sucesso' 
      })
    }
  )
})

// Atualizar página
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { title, content, status, templateId, slug, widgetData, isHome } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' })
  }

  if (status && !['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido' })
  }

  const db = Database.getDb()
  
  // Verificar se o usuário pode editar esta página
  db.get('SELECT author_id FROM pages WHERE id = ?', [id], (err, page) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar página' })
    }

    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' })
    }

    // Admin pode editar qualquer página, editor só suas próprias
    if (req.user.role !== 'admin' && page.author_id !== req.user.id) {
      return res.status(403).json({ message: 'Sem permissão para editar esta página' })
    }

    // Se definindo como home, remover flag de outras páginas
    if (isHome) {
      db.run('UPDATE pages SET is_home = false WHERE is_home = true AND id != ?', [id], (err) => {
        if (err) {
          console.error('Erro ao atualizar páginas home:', err)
        }
      })
    }

    db.run(
      `UPDATE pages SET title = ?, content = ?, status = ?, template_id = ?, slug = ?, 
                        widget_data = ?, is_home = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, content, status, templateId, slug, widgetData ? JSON.stringify(widgetData) : null, isHome || false, id],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed: pages.slug')) {
            return res.status(400).json({ message: 'Slug já está em uso' })
          }
          return res.status(500).json({ message: 'Erro ao atualizar página' })
        }

        res.json({ message: 'Página atualizada com sucesso' })
      }
    )
  })
})

// Alterar status da página
router.patch('/:id/status', (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido' })
  }

  const db = Database.getDb()
  
  // Verificar se o usuário pode editar esta página
  db.get('SELECT author_id FROM pages WHERE id = ?', [id], (err, page) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar página' })
    }

    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' })
    }

    // Admin pode editar qualquer página, editor só suas próprias
    if (req.user.role !== 'admin' && page.author_id !== req.user.id) {
      return res.status(403).json({ message: 'Sem permissão para editar esta página' })
    }

    db.run(
      'UPDATE pages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
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

// Excluir página
router.delete('/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  // Verificar se o usuário pode excluir esta página
  db.get('SELECT author_id FROM pages WHERE id = ?', [id], (err, page) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar página' })
    }

    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' })
    }

    // Admin pode excluir qualquer página, editor só suas próprias
    if (req.user.role !== 'admin' && page.author_id !== req.user.id) {
      return res.status(403).json({ message: 'Sem permissão para excluir esta página' })
    }

    db.run('DELETE FROM pages WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao excluir página' })
      }

      res.json({ message: 'Página excluída com sucesso' })
    })
  })
})

export default router
