import { Router } from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Listar todos os menus (público - para frontend)
router.get('/public', (req, res) => {
  const query = `
    SELECT 
      m.*,
      p.title as page_title,
      p.slug as page_slug
    FROM menus m
    LEFT JOIN pages p ON m.page_id = p.id
    WHERE m.is_active = 1
    ORDER BY m.sort_order, m.title
  `
  
  Database.getDb().all(query, (err, rows) => {
    if (err) {
      console.error('❌ Erro ao buscar menus públicos:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }

    // Organizar em hierarquia
    const buildHierarchy = (items, parentId = null) => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          ...item,
          children: buildHierarchy(items, item.id)
        }))
    }

    const hierarchicalMenus = buildHierarchy(rows)
    res.json(hierarchicalMenus)
  })
})

// Listar todos os menus (admin)
router.get('/', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      m.*,
      p.title as page_title,
      p.slug as page_slug,
      parent.title as parent_title
    FROM menus m
    LEFT JOIN pages p ON m.page_id = p.id
    LEFT JOIN menus parent ON m.parent_id = parent.id
    ORDER BY m.sort_order, m.title
  `
  
  Database.getDb().all(query, (err, rows) => {
    if (err) {
      console.error('❌ Erro ao buscar menus:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }

    res.json(rows)
  })
})

// Buscar menu por ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  
  const query = `
    SELECT 
      m.*,
      p.title as page_title,
      p.slug as page_slug
    FROM menus m
    LEFT JOIN pages p ON m.page_id = p.id
    WHERE m.id = ?
  `
  
  Database.getDb().get(query, [id], (err, row) => {
    if (err) {
      console.error('❌ Erro ao buscar menu:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }

    if (!row) {
      return res.status(404).json({ error: 'Menu não encontrado' })
    }

    res.json(row)
  })
})

// Criar novo menu
router.post('/', authenticateToken, (req, res) => {
  const { 
    title, 
    url, 
    target = '_self', 
    parent_id, 
    page_id, 
    sort_order = 0, 
    is_active = true, 
    css_class, 
    icon 
  } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Título é obrigatório' })
  }

  // Validar se parent_id existe (se fornecido)
  if (parent_id) {
    Database.getDb().get('SELECT id FROM menus WHERE id = ?', [parent_id], (err, parentRow) => {
      if (err) {
        console.error('❌ Erro ao verificar menu pai:', err)
        return res.status(500).json({ error: 'Erro interno do servidor' })
      }

      if (!parentRow) {
        return res.status(400).json({ error: 'Menu pai não encontrado' })
      }

      createMenu()
    })
  } else {
    createMenu()
  }

  function createMenu() {
    const query = `
      INSERT INTO menus (title, url, target, parent_id, page_id, sort_order, is_active, css_class, icon)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    
    Database.getDb().run(
      query,
      [title, url, target, parent_id, page_id, sort_order, is_active, css_class, icon],
      function(err) {
        if (err) {
          console.error('❌ Erro ao criar menu:', err)
          return res.status(500).json({ error: 'Erro interno do servidor' })
        }

        res.status(201).json({ 
          id: this.lastID, 
          message: 'Menu criado com sucesso' 
        })
      }
    )
  }
})

// Atualizar menu
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const { 
    title, 
    url, 
    target, 
    parent_id, 
    page_id, 
    sort_order, 
    is_active, 
    css_class, 
    icon 
  } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Título é obrigatório' })
  }

  // Verificar se o menu existe
  Database.getDb().get('SELECT id FROM menus WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('❌ Erro ao verificar menu:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }

    if (!row) {
      return res.status(404).json({ error: 'Menu não encontrado' })
    }

    // Validar parent_id (não pode ser o próprio item)
    if (parent_id && parent_id == id) {
      return res.status(400).json({ error: 'Um menu não pode ser pai de si mesmo' })
    }

    const query = `
      UPDATE menus 
      SET title = ?, url = ?, target = ?, parent_id = ?, page_id = ?, 
          sort_order = ?, is_active = ?, css_class = ?, icon = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    Database.getDb().run(
      query,
      [title, url, target, parent_id, page_id, sort_order, is_active, css_class, icon, id],
      function(err) {
        if (err) {
          console.error('❌ Erro ao atualizar menu:', err)
          return res.status(500).json({ error: 'Erro interno do servidor' })
        }

        res.json({ message: 'Menu atualizado com sucesso' })
      }
    )
  })
})

// Excluir menu
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params

  // Verificar se existem submenus
  Database.getDb().get('SELECT COUNT(*) as count FROM menus WHERE parent_id = ?', [id], (err, row) => {
    if (err) {
      console.error('❌ Erro ao verificar submenus:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }

    if (row.count > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir um menu que possui submenus. Exclua os submenus primeiro.' 
      })
    }

    Database.getDb().run('DELETE FROM menus WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('❌ Erro ao excluir menu:', err)
        return res.status(500).json({ error: 'Erro interno do servidor' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Menu não encontrado' })
      }

      res.json({ message: 'Menu excluído com sucesso' })
    })
  })
})

// Reordenar menus
router.post('/reorder', authenticateToken, (req, res) => {
  const { items } = req.body

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items deve ser um array' })
  }

  const db = Database.getDb()
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION')

    let errorOccurred = false
    let completed = 0

    items.forEach((item, index) => {
      if (!item.id) {
        errorOccurred = true
        return
      }

      db.run(
        'UPDATE menus SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [index + 1, item.id],
        function(err) {
          if (err) {
            console.error('❌ Erro ao reordenar menu:', err)
            errorOccurred = true
          }

          completed++
          
          if (completed === items.length) {
            if (errorOccurred) {
              db.run('ROLLBACK')
              return res.status(500).json({ error: 'Erro ao reordenar menus' })
            } else {
              db.run('COMMIT')
              res.json({ message: 'Menus reordenados com sucesso' })
            }
          }
        }
      )
    })
  })
})

export default router
