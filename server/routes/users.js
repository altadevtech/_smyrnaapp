import express from 'express'
import bcrypt from 'bcryptjs'
import Database from '../database.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Todas as rotas necessitam autenticação e role de admin
router.use(authenticateToken)
router.use(requireRole('admin'))

// Listar usuários
router.get('/', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC',
    (err, users) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar usuários' })
      }
      res.json(users)
    }
  )
})

// Criar usuário
router.post('/', async (req, res) => {
  const { name, email, password, role = 'editor' } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' })
  }

  if (!['admin', 'editor'].includes(role)) {
    return res.status(400).json({ message: 'Role inválido' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const db = Database.getDb()

    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: 'Email já está em uso' })
          }
          return res.status(500).json({ message: 'Erro ao criar usuário' })
        }

        res.status(201).json({ 
          id: this.lastID,
          message: 'Usuário criado com sucesso' 
        })
      }
    )
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Atualizar usuário
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, email, password, role } = req.body

  if (!name || !email) {
    return res.status(400).json({ message: 'Nome e email são obrigatórios' })
  }

  if (role && !['admin', 'editor'].includes(role)) {
    return res.status(400).json({ message: 'Role inválido' })
  }

  try {
    const db = Database.getDb()
    
    let query = 'UPDATE users SET name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    let params = [name, email, role, id]

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      query = 'UPDATE users SET name = ?, email = ?, password = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      params = [name, email, hashedPassword, role, id]
    }

    db.run(query, params, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ message: 'Email já está em uso' })
        }
        return res.status(500).json({ message: 'Erro ao atualizar usuário' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      res.json({ message: 'Usuário atualizado com sucesso' })
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Alterar status do usuário
router.patch('/:id/status', (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido' })
  }

  const db = Database.getDb()
  
  db.run(
    'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar status' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      res.json({ message: 'Status atualizado com sucesso' })
    }
  )
})

// Excluir usuário
router.delete('/:id', (req, res) => {
  const { id } = req.params

  // Não permitir excluir o próprio usuário
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: 'Não é possível excluir seu próprio usuário' })
  }

  const db = Database.getDb()
  
  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Erro ao excluir usuário' })
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    res.json({ message: 'Usuário excluído com sucesso' })
  })
})

export default router
