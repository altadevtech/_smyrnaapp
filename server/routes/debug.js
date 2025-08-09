import express from 'express'
import bcrypt from 'bcryptjs'
import Database from '../database.js'

const router = express.Router()

// Endpoint temporário para debug - forçar criação de usuários padrão
router.post('/create-default-users', async (req, res) => {
  const db = Database.getDb()
  
  try {
    console.log('🔧 Forçando criação de usuários padrão...')
    
    // Verificar quantos usuários existem
    db.get('SELECT COUNT(*) as count FROM users', async (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao verificar usuários', details: err.message })
      }

      console.log('📊 Usuários existentes:', result.count)

      if (result.count > 0) {
        return res.json({ 
          message: 'Usuários já existem', 
          count: result.count,
          action: 'Não foi necessário criar usuários'
        })
      }

      // Criar senhas hash
      const adminPassword = await bcrypt.hash('admin123', 10)
      const editorPassword = await bcrypt.hash('editor123', 10)

      let usersCreated = 0
      const totalUsers = 2

      // Inserir usuário admin
      db.run(
        'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
        ['Admin', 'admin@smyrna.com', adminPassword, 'admin', 'active'],
        function(err) {
          if (err) {
            console.error('❌ Erro ao criar admin:', err)
          } else {
            console.log('✅ Admin criado, ID:', this.lastID)
            usersCreated++
            
            if (usersCreated === totalUsers) {
              res.json({ 
                message: 'Usuários padrão criados com sucesso!',
                users: ['admin@smyrna.com', 'editor@smyrna.com'],
                passwords: 'admin123 / editor123'
              })
            }
          }
        }
      )

      // Inserir usuário editor
      db.run(
        'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
        ['Editor', 'editor@smyrna.com', editorPassword, 'editor', 'active'],
        function(err) {
          if (err) {
            console.error('❌ Erro ao criar editor:', err)
          } else {
            console.log('✅ Editor criado, ID:', this.lastID)
            usersCreated++
            
            if (usersCreated === totalUsers) {
              res.json({ 
                message: 'Usuários padrão criados com sucesso!',
                users: ['admin@smyrna.com', 'editor@smyrna.com'],
                passwords: 'admin123 / editor123'
              })
            }
          }
        }
      )
    })
  } catch (error) {
    console.error('❌ Erro:', error)
    res.status(500).json({ error: 'Erro interno', details: error.message })
  }
})

// Endpoint para verificar hash de senha (debug)
router.post('/test-password', async (req, res) => {
  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha obrigatórios' })
  }

  const db = Database.getDb()
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (!user) {
      return res.json({ found: false, message: 'Usuário não encontrado' })
    }

    try {
      const isValid = await bcrypt.compare(password, user.password)
      res.json({
        found: true,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        passwordValid: isValid,
        hashLength: user.password.length,
        hashStart: user.password.substring(0, 10) + '...'
      })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao verificar senha', details: error.message })
    }
  })
})

export default router
