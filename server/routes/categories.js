import express from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Listar todas as categorias (público) com filtro por tipo e hierarquia
router.get('/', (req, res) => {
  const db = Database.getDb()
  const { type, hierarchical } = req.query // 'wiki' ou 'blog', hierarchical='true' para estrutura hierárquica
  
  let query = 'SELECT id, name, slug, color, type, parent_id FROM categories'
  let params = []
  
  if (type && ['wiki', 'blog'].includes(type)) {
    query += ' WHERE type = ?'
    params.push(type)
  }
  
  query += ' ORDER BY name'
  
  db.all(query, params, (err, categories) => {
    if (err) {
      console.error('Erro ao buscar categorias:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    
    // Se hierárquico, organizar em árvore
    if (hierarchical === 'true') {
      const categoriesMap = {}
      const tree = []
      
      // Criar mapa de categorias
      categories.forEach(cat => {
        categoriesMap[cat.id] = { ...cat, subcategories: [] }
      })
      
      // Organizar hierarquia
      categories.forEach(cat => {
        if (cat.parent_id) {
          if (categoriesMap[cat.parent_id]) {
            categoriesMap[cat.parent_id].subcategories.push(categoriesMap[cat.id])
          }
        } else {
          tree.push(categoriesMap[cat.id])
        }
      })
      
      return res.json(tree)
    }
    
    res.json(categories)
  })
})

// Buscar categoria por ID (público)
router.get('/:id', (req, res) => {
  const db = Database.getDb()
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

// Buscar categorias principais de um tipo (sem parent_id)
router.get('/main/:type', (req, res) => {
  const db = Database.getDb()
  const { type } = req.params
  
  if (!['wiki', 'blog'].includes(type)) {
    return res.status(400).json({ error: 'Tipo deve ser "wiki" ou "blog"' })
  }
  
  db.all('SELECT * FROM categories WHERE type = ? AND parent_id IS NULL ORDER BY name', [type], (err, categories) => {
    if (err) {
      console.error('Erro ao buscar categorias principais:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    
    res.json(categories)
  })
})

// Buscar subcategorias de uma categoria
router.get('/:id/subcategories', (req, res) => {
  const db = Database.getDb()
  const { id } = req.params
  
  db.all('SELECT * FROM categories WHERE parent_id = ? ORDER BY name', [id], (err, subcategories) => {
    if (err) {
      console.error('Erro ao buscar subcategorias:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    
    res.json(subcategories)
  })
})

// Buscar categoria por slug (público)
router.get('/slug/:slug', (req, res) => {
  const db = Database.getDb()
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

// Criar nova categoria (admin)
router.post('/', authenticateToken, (req, res) => {
  const db = Database.getDb()
  const { name, slug, color, type, parent_id } = req.body
  
  // Validações
  if (!name || !slug || !type) {
    return res.status(400).json({ error: 'Nome, slug e tipo são obrigatórios' })
  }
  
  if (!['wiki', 'blog'].includes(type)) {
    return res.status(400).json({ error: 'Tipo deve ser "wiki" ou "blog"' })
  }
  
  // Validar parent_id se fornecido
  if (parent_id) {
    db.get('SELECT id, type FROM categories WHERE id = ?', [parent_id], (err, parentCategory) => {
      if (err) {
        console.error('Erro ao verificar categoria pai:', err)
        return res.status(500).json({ error: 'Erro interno do servidor' })
      }
      
      if (!parentCategory) {
        return res.status(400).json({ error: 'Categoria pai não encontrada' })
      }
      
      if (parentCategory.type !== type) {
        return res.status(400).json({ error: 'Categoria pai deve ser do mesmo tipo' })
      }
      
      // Continua com a criação
      createCategory()
    })
  } else {
    createCategory()
  }
  
  function createCategory() {
    // Verificar se slug já existe para o mesmo tipo e parent_id
    let checkQuery = 'SELECT id FROM categories WHERE slug = ? AND type = ?'
    let checkParams = [slug, type]
    
    if (parent_id) {
      checkQuery += ' AND parent_id = ?'
      checkParams.push(parent_id)
    } else {
      checkQuery += ' AND parent_id IS NULL'
    }
    
    db.get(checkQuery, checkParams, (err, existing) => {
      if (err) {
        console.error('Erro ao verificar slug:', err)
        return res.status(500).json({ error: 'Erro interno do servidor' })
      }
      
      if (existing) {
        return res.status(400).json({ error: 'Slug já existe para este contexto' })
      }
      
      // Inserir nova categoria
      const query = `
        INSERT INTO categories (name, slug, color, type, parent_id, created_at) 
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `
      
      db.run(query, [name, slug, color || '#3B82F6', type, parent_id || null], function(err) {
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
      })
    })
  }
})

// Atualizar categoria (admin)
router.put('/:id', authenticateToken, (req, res) => {
  const db = Database.getDb()
  const { id } = req.params
  const { name, slug, color, type, parent_id } = req.body
  
  // Validações
  if (!name || !slug || !type) {
    return res.status(400).json({ error: 'Nome, slug e tipo são obrigatórios' })
  }
  
  if (!['wiki', 'blog'].includes(type)) {
    return res.status(400).json({ error: 'Tipo deve ser "wiki" ou "blog"' })
  }
  
  // Verificar se categoria existe
  db.get('SELECT * FROM categories WHERE id = ?', [id], (err, category) => {
    if (err) {
      console.error('Erro ao buscar categoria:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' })
    }
    
    // Validar parent_id se fornecido
    if (parent_id && parent_id != id) { // Não pode ser pai de si mesmo
      db.get('SELECT id, type FROM categories WHERE id = ?', [parent_id], (err, parentCategory) => {
        if (err) {
          console.error('Erro ao verificar categoria pai:', err)
          return res.status(500).json({ error: 'Erro interno do servidor' })
        }
        
        if (!parentCategory) {
          return res.status(400).json({ error: 'Categoria pai não encontrada' })
        }
        
        if (parentCategory.type !== type) {
          return res.status(400).json({ error: 'Categoria pai deve ser do mesmo tipo' })
        }
        
        // Verificar se não criaria ciclo (parent_id não pode ser uma subcategoria desta categoria)
        checkForCycle(parent_id, id, (hasCycle) => {
          if (hasCycle) {
            return res.status(400).json({ error: 'Não é possível criar hierarquia circular' })
          }
          updateCategory()
        })
      })
    } else {
      updateCategory()
    }
    
    function updateCategory() {
      // Verificar se slug já existe para outro registro
      let checkQuery = 'SELECT id FROM categories WHERE slug = ? AND type = ? AND id != ?'
      let checkParams = [slug, type, id]
      
      if (parent_id) {
        checkQuery += ' AND parent_id = ?'
        checkParams.push(parent_id)
      } else {
        checkQuery += ' AND parent_id IS NULL'
      }
      
      db.get(checkQuery, checkParams, (err, existing) => {
        if (err) {
          console.error('Erro ao verificar slug:', err)
          return res.status(500).json({ error: 'Erro interno do servidor' })
        }
        
        if (existing) {
          return res.status(400).json({ error: 'Slug já existe para este contexto' })
        }
        
        // Atualizar categoria
        const query = `
          UPDATE categories 
          SET name = ?, slug = ?, color = ?, type = ?, parent_id = ?, updated_at = datetime('now')
          WHERE id = ?
        `
        
        db.run(query, [name, slug, color || '#3B82F6', type, parent_id || null, id], function(err) {
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
        })
      })
    }
  })
})

// Função auxiliar para verificar ciclos na hierarquia
function checkForCycle(parentId, categoryId, callback) {
  const db = Database.getDb()
  
  function checkParent(currentParentId) {
    if (currentParentId == categoryId) {
      return callback(true) // Ciclo detectado
    }
    
    db.get('SELECT parent_id FROM categories WHERE id = ?', [currentParentId], (err, result) => {
      if (err || !result || !result.parent_id) {
        return callback(false) // Sem ciclo
      }
      
      checkParent(result.parent_id)
    })
  }
  
  checkParent(parentId)
}

// Deletar categoria (admin)
router.delete('/:id', authenticateToken, (req, res) => {
  const db = Database.getDb()
  const { id } = req.params
  
  // Verificar se categoria existe
  db.get('SELECT * FROM categories WHERE id = ?', [id], (err, category) => {
    if (err) {
      console.error('Erro ao buscar categoria:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' })
    }
    
    // Verificar se há subcategorias
    db.get('SELECT COUNT(*) as count FROM categories WHERE parent_id = ?', [id], (err, subcatsResult) => {
      if (err) {
        console.error('Erro ao verificar subcategorias:', err)
        return res.status(500).json({ error: 'Erro interno do servidor' })
      }
      
      if (subcatsResult.count > 0) {
        return res.status(400).json({ error: 'Não é possível deletar categoria com subcategorias' })
      }
      
      // Verificar se há posts usando esta categoria
      db.get('SELECT COUNT(*) as count FROM posts WHERE category_id = ?', [id], (err, postsResult) => {
        if (err) {
          console.error('Erro ao verificar posts:', err)
          return res.status(500).json({ error: 'Erro interno do servidor' })
        }
        
        if (postsResult.count > 0) {
          return res.status(400).json({ error: 'Não é possível deletar categoria com posts' })
        }
        
        // Verificar se há páginas usando esta categoria
        db.get('SELECT COUNT(*) as count FROM pages WHERE category_id = ?', [id], (err, pagesResult) => {
          if (err) {
            console.error('Erro ao verificar páginas:', err)
            return res.status(500).json({ error: 'Erro interno do servidor' })
          }
          
          if (pagesResult.count > 0) {
            return res.status(400).json({ error: 'Não é possível deletar categoria com páginas' })
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
  })
})

// Buscar posts de uma categoria (público)
router.get('/:id/posts', (req, res) => {
  const db = Database.getDb()
  const { id } = req.params
  const { limit = 10, offset = 0 } = req.query
  
  // Verificar se categoria existe
  db.get('SELECT * FROM categories WHERE id = ?', [id], (err, category) => {
    if (err) {
      console.error('Erro ao buscar categoria:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' })
    }
    
    // Buscar posts da categoria
    const query = `
      SELECT p.*, u.name as author_name 
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.category_id = ? AND p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `
    
    db.all(query, [id, parseInt(limit), parseInt(offset)], (err, posts) => {
      if (err) {
        console.error('Erro ao buscar posts:', err)
        return res.status(500).json({ error: 'Erro interno do servidor' })
      }
      
      res.json(posts)
    })
  })
})

// Buscar categorias com contagem de posts (público)
router.get('/stats/with-posts', (req, res) => {
  const db = Database.getDb()
  const { type } = req.query // 'wiki' ou 'blog'
  
  let query = `
    SELECT 
      c.id,
      c.name,
      c.slug,
      c.color,
      c.type,
      COUNT(p.id) as post_count
    FROM categories c
    LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
  `
  
  let params = []
  
  if (type && ['wiki', 'blog'].includes(type)) {
    query += ' WHERE c.type = ?'
    params.push(type)
  }
  
  query += `
    GROUP BY c.id, c.name, c.slug, c.color, c.type
    HAVING COUNT(p.id) > 0
    ORDER BY c.name
  `

  db.all(query, params, (err, categories) => {
    if (err) {
      console.error('Erro ao buscar categorias com posts:', err)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
    
    res.json(categories)
  })
})

export default router
