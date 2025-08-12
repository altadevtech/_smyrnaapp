import express from 'express'
import Database from '../database.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Listar templates públicos (para seleção)
router.get('/public', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    'SELECT id, name, description FROM templates ORDER BY name',
    (err, templates) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar templates' })
      }
      res.json(templates)
    }
  )
})

// Buscar template específico
router.get('/public/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  db.get(
    'SELECT * FROM templates WHERE id = ?',
    [id],
    (err, template) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar template' })
      }
      
      if (!template) {
        return res.status(404).json({ message: 'Template não encontrado' })
      }
      
      // Parse do JSON
      if (template.layout) {
        template.layout = JSON.parse(template.layout)
      }
      
      res.json(template)
    }
  )
})

// Todas as rotas abaixo necessitam autenticação
router.use(authenticateToken)

// Listar templates (admin/editor)
router.get('/', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    'SELECT * FROM templates ORDER BY name',
    (err, templates) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar templates' })
      }
      
      // Parse do JSON para cada template
      templates.forEach(template => {
        if (template.layout) {
          template.layout = JSON.parse(template.layout)
        }
      })
      
      res.json(templates)
    }
  )
})

// Buscar template específico (admin/editor)
router.get('/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  db.get(
    'SELECT * FROM templates WHERE id = ?',
    [id],
    (err, template) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar template' })
      }
      
      if (!template) {
        return res.status(404).json({ message: 'Template não encontrado' })
      }
      
      // Parse do JSON
      if (template.layout) {
        template.layout = JSON.parse(template.layout)
      }
      
      res.json(template)
    }
  )
})

// Criar template (apenas admin)
router.post('/', requireRole('admin'), (req, res) => {
  const { name, description, layout, showHeader = true, showFooter = true } = req.body

  if (!name || !layout) {
    return res.status(400).json({ message: 'Nome e layout são obrigatórios' })
  }

  const db = Database.getDb()
  
  db.run(
    'INSERT INTO templates (name, description, layout, show_header, show_footer) VALUES (?, ?, ?, ?, ?)',
    [name, description, JSON.stringify(layout), showHeader, showFooter],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao criar template' })
      }

      res.status(201).json({ 
        id: this.lastID,
        message: 'Template criado com sucesso' 
      })
    }
  )
})

// Atualizar template (apenas admin)
router.put('/:id', requireRole('admin'), (req, res) => {
  const { id } = req.params
  const { name, description, layout, showHeader, showFooter, isDefault } = req.body

  if (!name || !layout) {
    return res.status(400).json({ message: 'Nome e layout são obrigatórios' })
  }

  const db = Database.getDb()

  // Se definindo como padrão, remover flag de outros templates
  if (isDefault) {
    db.run('UPDATE templates SET is_default = false', (err) => {
      if (err) {
        console.error('Erro ao atualizar templates padrão:', err)
      }
    })
  }
  
  db.run(
    'UPDATE templates SET name = ?, description = ?, layout = ?, show_header = ?, show_footer = ?, is_default = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, JSON.stringify(layout), showHeader, showFooter, isDefault || false, id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar template' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Template não encontrado' })
      }

      res.json({ message: 'Template atualizado com sucesso' })
    }
  )
})

// Excluir template (apenas admin)
router.delete('/:id', requireRole('admin'), (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  // Verificar se o template não é o padrão
  db.get('SELECT is_default FROM templates WHERE id = ?', [id], (err, template) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar template' })
    }

    if (!template) {
      return res.status(404).json({ message: 'Template não encontrado' })
    }

    if (template.is_default) {
      return res.status(400).json({ message: 'Não é possível excluir o template padrão' })
    }

    // Verificar se há páginas do wiki usando este template
    db.get('SELECT COUNT(*) as count FROM pages WHERE template_id = ?', [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao verificar páginas do wiki' })
      }

      if (result.count > 0) {
        return res.status(400).json({ message: 'Não é possível excluir template em uso por páginas do wiki' })
      }

      // Excluir template
      db.run('DELETE FROM templates WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({ message: 'Erro ao excluir template' })
        }
        res.json({ message: 'Template excluído com sucesso' })
      })
    })
  })
})

export default router
