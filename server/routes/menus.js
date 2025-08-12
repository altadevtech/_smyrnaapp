import { Router } from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Listar todos os menus (publico - para frontend)
router.get('/public', (req, res) => {
  const query = `
    SELECT 
      id,
      title as name,
      url,
      parent_id,
      sort_order as order_position,
      target,
      created_at,
      updated_at
    FROM menus 
    WHERE is_active = 1
    ORDER BY sort_order ASC, id ASC
  `
  
  try {
    const db = Database.getDb()
    db.all(query, [], (err, menus) => {
      if (err) {
        console.error('Erro ao buscar menus:', err)
        return res.status(500).json({ message: 'Erro interno do servidor' })
      }
      
      // Construir hierarquia
      const buildHierarchy = (menus, parentId = null) => {
        return menus
          .filter(menu => menu.parent_id === parentId)
          .map(menu => ({
            ...menu,
            children: buildHierarchy(menus, menu.id)
          }))
      }
      
      const hierarchicalMenus = buildHierarchy(menus)
      res.json(hierarchicalMenus)
    })
  } catch (error) {
    console.error('Erro ao buscar menus:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Listar todos os menus (administrativo)
router.get('/', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      id,
      title as name,
      url,
      parent_id,
      sort_order as order_position,
      target,
      is_active as status,
      created_at,
      updated_at
    FROM menus 
    ORDER BY sort_order ASC, id ASC
  `
  
  try {
    const db = Database.getDb()
    db.all(query, [], (err, menus) => {
      if (err) {
        console.error('Erro ao buscar menus:', err)
        return res.status(500).json({ message: 'Erro interno do servidor' })
      }
      
      // Construir hierarquia
      const buildHierarchy = (menus, parentId = null) => {
        return menus
          .filter(menu => menu.parent_id === parentId)
          .map(menu => ({
            ...menu,
            children: buildHierarchy(menus, menu.id)
          }))
      }
      
      const hierarchicalMenus = buildHierarchy(menus)
      res.json(hierarchicalMenus)
    })
  } catch (error) {
    console.error('Erro ao buscar menus:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Buscar menu específico
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const query = 'SELECT *, title as name, sort_order as order_position, is_active as status FROM menus WHERE id = ?'
  
  try {
    const db = Database.getDb()
    db.get(query, [id], (err, menu) => {
      if (err) {
        console.error('Erro ao buscar menu:', err)
        return res.status(500).json({ message: 'Erro interno do servidor' })
      }
      
      if (!menu) {
        return res.status(404).json({ message: 'Menu não encontrado' })
      }
      
      res.json(menu)
    })
  } catch (error) {
    console.error('Erro ao buscar menu:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Criar novo menu
router.post('/', authenticateToken, (req, res) => {
  const { name, url, parent_id, target, status } = req.body
  
  if (!name) {
    return res.status(400).json({ message: 'Nome é obrigatório' })
  }
  
  try {
    const db = Database.getDb()
    
    // Determinar a ordem
    const getMaxOrderQuery = 'SELECT MAX(sort_order) as max_order FROM menus WHERE parent_id = ?'
    db.get(getMaxOrderQuery, [parent_id || null], (err, maxOrderResult) => {
      if (err) {
        console.error('Erro ao buscar ordem máxima:', err)
        return res.status(500).json({ message: 'Erro interno do servidor' })
      }
      
      const nextOrder = (maxOrderResult?.max_order || 0) + 1
      
      const insertQuery = `
        INSERT INTO menus (title, url, parent_id, sort_order, target, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `
      
      db.run(insertQuery, [name, url || '', parent_id || null, nextOrder, target || '_self', status !== false ? 1 : 0], function(err) {
        if (err) {
          console.error('Erro ao criar menu:', err)
          return res.status(500).json({ message: 'Erro interno do servidor' })
        }
        
        const menuId = this.lastID
        
        // Buscar o menu criado
        db.get('SELECT *, title as name, sort_order as order_position, is_active as status FROM menus WHERE id = ?', [menuId], (err, createdMenu) => {
          if (err) {
            console.error('Erro ao buscar menu criado:', err)
            return res.status(500).json({ message: 'Erro interno do servidor' })
          }
          
          res.status(201).json(createdMenu)
        })
      })
    })
  } catch (error) {
    console.error('Erro ao criar menu:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Atualizar menu
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const { name, url, parent_id, target, status } = req.body
  
  if (!name) {
    return res.status(400).json({ message: 'Nome é obrigatório' })
  }
  
  try {
    const db = Database.getDb()
    
    // Verificar se o menu existe
    db.get('SELECT * FROM menus WHERE id = ?', [id], (err, existingMenu) => {
      if (err) {
        console.error('Erro ao verificar menu:', err)
        return res.status(500).json({ message: 'Erro interno do servidor' })
      }
      
      if (!existingMenu) {
        return res.status(404).json({ message: 'Menu não encontrado' })
      }
      
      const updateQuery = `
        UPDATE menus 
        SET title = ?, url = ?, parent_id = ?, target = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
      
      db.run(updateQuery, [name, url || '', parent_id || null, target || '_self', status !== false ? 1 : 0, id], (err) => {
        if (err) {
          console.error('Erro ao atualizar menu:', err)
          return res.status(500).json({ message: 'Erro interno do servidor' })
        }
        
        // Buscar o menu atualizado
        db.get('SELECT *, title as name, sort_order as order_position, is_active as status FROM menus WHERE id = ?', [id], (err, updatedMenu) => {
          if (err) {
            console.error('Erro ao buscar menu atualizado:', err)
            return res.status(500).json({ message: 'Erro interno do servidor' })
          }
          
          res.json(updatedMenu)
        })
      })
    })
  } catch (error) {
    console.error('Erro ao atualizar menu:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Reordenar menus
router.put('/reorder/batch', authenticateToken, (req, res) => {
  const { menus } = req.body
  
  if (!Array.isArray(menus)) {
    return res.status(400).json({ message: 'Lista de menus inválida' })
  }
  
  try {
    const db = Database.getDb()
    
    // Usar transaction para garantir consistência
    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          console.error('Erro ao iniciar transação:', err)
          return res.status(500).json({ message: 'Erro interno do servidor' })
        }
        
        let completed = 0
        let hasError = false
        
        const updateQuery = 'UPDATE menus SET sort_order = ?, parent_id = ? WHERE id = ?'
        
        menus.forEach((menu, index) => {
          if (hasError) return
          
          db.run(updateQuery, [menu.order_position, menu.parent_id || null, menu.id], (err) => {
            if (err && !hasError) {
              hasError = true
              console.error('Erro ao reordenar menu:', err)
              db.run('ROLLBACK', () => {
                res.status(500).json({ message: 'Erro interno do servidor' })
              })
              return
            }
            
            completed++
            if (completed === menus.length && !hasError) {
              db.run('COMMIT', (err) => {
                if (err) {
                  console.error('Erro ao confirmar transação:', err)
                  return res.status(500).json({ message: 'Erro interno do servidor' })
                }
                res.json({ message: 'Menus reordenados com sucesso' })
              })
            }
          })
        })
      })
    })
  } catch (error) {
    console.error('Erro ao reordenar menus:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Excluir menu
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  
  try {
    const db = Database.getDb()
    
    // Verificar se o menu existe
    db.get('SELECT * FROM menus WHERE id = ?', [id], (err, existingMenu) => {
      if (err) {
        console.error('Erro ao verificar menu:', err)
        return res.status(500).json({ message: 'Erro interno do servidor' })
      }
      
      if (!existingMenu) {
        return res.status(404).json({ message: 'Menu não encontrado' })
      }
      
      // Verificar se tem filhos
      db.get('SELECT COUNT(*) as count FROM menus WHERE parent_id = ?', [id], (err, hasChildren) => {
        if (err) {
          console.error('Erro ao verificar filhos:', err)
          return res.status(500).json({ message: 'Erro interno do servidor' })
        }
        
        if (hasChildren.count > 0) {
          return res.status(400).json({ message: 'Não é possível excluir menu que possui submenus' })
        }
        
        // Excluir o menu
        db.run('DELETE FROM menus WHERE id = ?', [id], (err) => {
          if (err) {
            console.error('Erro ao excluir menu:', err)
            return res.status(500).json({ message: 'Erro interno do servidor' })
          }
          
          res.json({ message: 'Menu excluído com sucesso' })
        })
      })
    })
  } catch (error) {
    console.error('Erro ao excluir menu:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Buscar menus com filtros
router.get('/search/:term', authenticateToken, (req, res) => {
  const { term } = req.params
  const query = `
    SELECT *, title as name, sort_order as order_position, is_active as status FROM menus 
    WHERE title LIKE ? OR url LIKE ?
    ORDER BY sort_order ASC, id ASC
  `
  const params = [`%${term}%`, `%${term}%`]
  
  try {
    const db = Database.getDb()
    db.all(query, params, (err, menus) => {
      if (err) {
        console.error('Erro ao buscar menus:', err)
        return res.status(500).json({ message: 'Erro interno do servidor' })
      }
      
      res.json(menus)
    })
  } catch (error) {
    console.error('Erro ao buscar menus:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

export default router
