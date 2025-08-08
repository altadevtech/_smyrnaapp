import jwt from 'jsonwebtoken'
import Database from '../database.js'

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura_aqui'

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso necessário' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' })
    }

    // Verificar se o usuário ainda existe e está ativo
    const db = Database.getDb()
    db.get(
      'SELECT id, name, email, role, status FROM users WHERE id = ? AND status = "active"',
      [user.id],
      (err, dbUser) => {
        if (err) {
          return res.status(500).json({ message: 'Erro interno do servidor' })
        }

        if (!dbUser) {
          return res.status(403).json({ message: 'Usuário não encontrado ou inativo' })
        }

        req.user = dbUser
        next()
      }
    )
  })
}

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Permissão insuficiente' })
    }
    next()
  }
}

export {
  authenticateToken,
  requireRole,
  JWT_SECRET
}
