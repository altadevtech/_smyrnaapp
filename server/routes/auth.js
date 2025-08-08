import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Database from '../database.js'
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js'

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' })
  }

  const db = Database.getDb()
  
  db.get(
    'SELECT * FROM users WHERE email = ? AND status = "active"',
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' })
      }

      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' })
      }

      try {
        const isValidPassword = await bcrypt.compare(password, user.password)
        
        if (!isValidPassword) {
          return res.status(401).json({ message: 'Credenciais inválidas' })
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '24h' }
        )

        const userResponse = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }

        res.json({ token, user: userResponse })
      } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' })
      }
    }
  )
})

// Verificar autenticação
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user })
})

export default router
