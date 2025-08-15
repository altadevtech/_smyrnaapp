import express from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Listar artigos do wiki públicos (sem autenticação) com busca e filtros
router.get('/public', (req, res) => {
  const db = Database.getDb()
  const { search, tag, category } = req.query
  
  let query = `
    SELECT p.id, p.title, p.content, p.slug, p.created_at, p.updated_at, 
           u.name as author_name, c.name as category_name, c.color as category_color
    FROM pages p 
    JOIN users u ON p.author_id = u.id 
    LEFT JOIN categories c ON p.category_id = c.id AND c.type = 'wiki'
    WHERE p.status = 'published' AND (p.is_home IS NULL OR p.is_home = false)
  `
  
  const params = []
  
  // Filtro por busca de texto
  if (search) {
    query += ` AND (p.title LIKE ? OR p.content LIKE ?)`
    params.push(`%${search}%`, `%${search}%`)
  }
  
  // Filtro por categoria
  if (category) {
    query += ` AND p.category_id = ?`
    params.push(category)
  }
  
  // Filtro por tag (busca no conteúdo por tags)
  if (tag) {
    query += ` AND p.content LIKE ?`
    params.push(`%#${tag}%`)
  }
  
  query += ` ORDER BY p.updated_at DESC`
  
  db.all(query, params, (err, pages) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar artigos do wiki' })
    }
    res.json(pages)
  })
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

// Endpoint público para páginas recentes
router.get('/recent', (req, res) => {
  const db = Database.getDb()
  const { limit = 10 } = req.query
  
  db.all(
    `SELECT p.id, p.title, p.slug, p.created_at, p.updated_at, 
            u.name as author_name, c.name as category_name, c.color as category_color
     FROM pages p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id AND c.type = 'wiki'
     WHERE p.status = 'published' AND (p.is_home IS NULL OR p.is_home = false)
     ORDER BY p.updated_at DESC
     LIMIT ?`,
    [parseInt(limit)],
    (err, pages) => {
      if (err) {
        console.error('Erro ao buscar páginas recentes:', err)
        return res.status(500).json({ message: 'Erro ao buscar páginas recentes' })
      }
      res.json(pages)
    }
  )
})

// Todas as rotas abaixo necessitam autenticação
router.use(authenticateToken)

// Listar artigos do wiki (admin/editor)
router.get('/', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    `SELECT p.id, p.title, p.content, p.status, p.slug, p.is_home, p.created_at, p.updated_at, 
            u.name as author_name, t.name as template_name, c.name as category_name, c.color as category_color
     FROM pages p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN templates t ON p.template_id = t.id
     LEFT JOIN categories c ON p.category_id = c.id AND c.type = 'wiki'
     ORDER BY p.updated_at DESC`,
    (err, pages) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar artigos do wiki' })
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
  const { title, summary, content, status = 'draft', templateId = 1, slug, widgetData, category_id } = req.body

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
  
  db.run(
    'INSERT INTO pages (title, summary, content, status, author_id, template_id, slug, widget_data, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, summary || '', content, status, req.user.id, templateId, finalSlug, widgetData ? JSON.stringify(widgetData) : null, category_id || null],
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
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const { title, summary, content, status, templateId, slug, widgetData, category_id } = req.body

  console.log('📝 Atualizando página ID:', id)
  console.log('📋 Dados recebidos:', { title, summary, status, slug, category_id })

  if (!title || !content) {
    console.log('❌ Título ou conteúdo ausente')
    return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' })
  }

  if (status && !['draft', 'published'].includes(status)) {
    console.log('❌ Status inválido:', status)
    return res.status(400).json({ message: 'Status inválido' })
  }

  const db = Database.getDb()
  
  // Verificar se o usuário pode editar esta página e obter dados completos
  db.get('SELECT * FROM pages WHERE id = ?', [id], (err, page) => {
    if (err) {
      console.error('❌ Erro ao buscar página:', err)
      return res.status(500).json({ message: 'Erro ao buscar página' })
    }

    if (!page) {
      console.log('❌ Página não encontrada:', id)
      return res.status(404).json({ message: 'Página não encontrada' })
    }

    console.log('✅ Página encontrada:', page.title, 'Author:', page.author_id)

    // Admin pode editar qualquer página, editor só suas próprias
    if (req.user.role !== 'admin' && page.author_id !== req.user.id) {
      console.log('❌ Sem permissão. User:', req.user.id, 'Author:', page.author_id, 'Role:', req.user.role)
      return res.status(403).json({ message: 'Sem permissão para editar esta página' })
    }

    console.log('✅ Permissão validada para usuário:', req.user.id)

    // Criar versão antes de atualizar
    console.log('📦 Criando versão antes de atualizar...')
    createPageVersion(db, page, req.user.id, req.body.changeSummary || 'Edição da página', () => {
      console.log('🔄 Executando UPDATE da página...')
      db.run(
        `UPDATE pages SET title = ?, summary = ?, content = ?, status = ?, template_id = ?, slug = ?, 
                          widget_data = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [title, summary || '', content, status, templateId, slug, widgetData ? JSON.stringify(widgetData) : null, category_id || null, id],
        function(err) {
          if (err) {
            console.error('❌ Erro no UPDATE:', err)
            if (err.message.includes('UNIQUE constraint failed: pages.slug')) {
              return res.status(400).json({ message: 'Slug já está em uso' })
            }
            return res.status(500).json({ message: 'Erro ao atualizar página' })
          }

          console.log('✅ Página atualizada com sucesso')
          res.json({ message: 'Página atualizada com sucesso' })
        }
      )
    })
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

// Função auxiliar para criar versão da página
// Listar versões de uma página
router.get('/:id/versions', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()

  db.all(
    `SELECT pv.*, u.name as author_name 
     FROM page_versions pv 
     LEFT JOIN users u ON pv.author_id = u.id 
     WHERE pv.page_id = ? 
     ORDER BY pv.version_number DESC`,
    [id],
    (err, versions) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar versões' })
      }
      res.json(versions)
    }
  )
})

// Buscar versão específica
router.get('/:id/versions/:versionNumber', (req, res) => {
  const { id, versionNumber } = req.params
  const db = Database.getDb()

  db.get(
    `SELECT pv.*, u.name as author_name 
     FROM page_versions pv 
     LEFT JOIN users u ON pv.author_id = u.id 
     WHERE pv.page_id = ? AND pv.version_number = ?`,
    [id, versionNumber],
    (err, version) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar versão' })
      }

      if (!version) {
        return res.status(404).json({ message: 'Versão não encontrada' })
      }

      res.json(version)
    }
  )
})

// Restaurar versão específica
router.post('/:id/versions/:versionNumber/restore', (req, res) => {
  const { id, versionNumber } = req.params
  const { changeSummary } = req.body
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

    // Buscar a versão a ser restaurada
    db.get(
      'SELECT * FROM page_versions WHERE page_id = ? AND version_number = ?',
      [id, versionNumber],
      (err, version) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao buscar versão' })
        }

        if (!version) {
          return res.status(404).json({ message: 'Versão não encontrada' })
        }

        // Criar versão atual antes de restaurar
        db.get('SELECT * FROM pages WHERE id = ?', [id], (err, currentPage) => {
          if (err) {
            return res.status(500).json({ message: 'Erro ao buscar página atual' })
          }

          createPageVersion(db, currentPage, req.user.id, `Backup antes de restaurar versão ${versionNumber}`, () => {
            // Atualizar página com o conteúdo da versão
            db.run(
              `UPDATE pages SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
              [version.title, version.content, id],
              function(err) {
                if (err) {
                  return res.status(500).json({ message: 'Erro ao restaurar versão' })
                }

                // Criar nova versão para marcar a restauração
                const restoreSummary = changeSummary || `Restaurada versão ${versionNumber}`
                createPageVersion(db, { 
                  id, 
                  title: version.title, 
                  content: version.content 
                }, req.user.id, restoreSummary, () => {
                  res.json({ 
                    message: `Versão ${versionNumber} restaurada com sucesso`,
                    restoredVersion: versionNumber
                  })
                })
              }
            )
          })
        })
      }
    )
  })
})

function createPageVersion(db, page, authorId, changeSummary, callback) {
  // Verificar se a página tem dados necessários
  if (!page || !page.id || !page.title || !page.content) {
    console.error('Dados da página insuficientes para criar versão:', page)
    return callback()
  }

  // Obter próximo número de versão
  db.get(
    'SELECT MAX(version_number) as max_version FROM page_versions WHERE page_id = ?',
    [page.id],
    (err, result) => {
      if (err) {
        console.error('Erro ao obter versão:', err)
        return callback()
      }
      
      const nextVersion = (result.max_version || 0) + 1
      
      // Criar nova versão
      db.run(
        `INSERT INTO page_versions (page_id, version_number, title, content, author_id, change_summary, created_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [page.id, nextVersion, page.title, page.content, authorId, changeSummary],
        (err) => {
          if (err) {
            console.error('Erro ao criar versão:', err)
            console.error('Dados:', { page_id: page.id, version: nextVersion, title: page.title, author: authorId })
          } else {
            console.log('✅ Versão criada com sucesso:', nextVersion, 'para página', page.id)
          }
          callback()
        }
      )
    }
  )
}

export default router
