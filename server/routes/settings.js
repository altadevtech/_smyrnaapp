import express from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// GET /api/settings/homepage - Obter configuração da página inicial (público)
router.get('/homepage', async (req, res) => {
  try {
    const db = Database.getDb()
    
    // Buscar configuração da página inicial
    const homepageSettings = await new Promise((resolve, reject) => {
      db.get(
        'SELECT value FROM settings WHERE key = ?',
        ['homepage_config'],
        (err, row) => {
          if (err) reject(err)
          else resolve(row ? JSON.parse(row.value) : null)
        }
      )
    })

    // Se não existe configuração, retornar padrão
    if (!homepageSettings) {
      return res.json({
        title: 'Bem-vindo ao Smyrna Wiki',
        content: '<h2>Sistema de Wiki e Gerenciamento de Conhecimento</h2><p>Este é um sistema completo para organização e compartilhamento de conhecimento.</p><h3>Funcionalidades:</h3><ul><li>📄 Páginas Wiki organizadas</li><li>📝 Blog integrado</li><li>👥 Gerenciamento de usuários</li><li>🎨 Interface responsiva</li></ul>',
        layout: 'default',
        isEnabled: true
      })
    }

    res.json({
      ...homepageSettings,
      isEnabled: true
    })
  } catch (error) {
    console.error('Erro ao buscar configuração da página inicial:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/settings/homepage - Atualizar configuração da página inicial
router.put('/homepage', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem alterar a página inicial.' })
    }

    const { title, content, layout = 'default', isEnabled = true } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' })
    }

    const db = Database.getDb()
    
    // Verificar se a tabela de configurações existe
    const tableExists = await new Promise((resolve, reject) => {
      db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='settings'",
        (err, row) => {
          if (err) reject(err)
          else resolve(!!row)
        }
      )
    })

    if (!tableExists) {
      // Criar tabela se não existe
      await new Promise((resolve, reject) => {
        db.run(`
          CREATE TABLE settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }

    const homepageConfig = JSON.stringify({ title, content, layout, isEnabled })

    // Inserir ou atualizar configuração da página inicial
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        ['homepage_config', homepageConfig],
        (err) => {
          if (err) reject(err)
          else resolve()
        }
      )
    })

    res.json({ 
      message: 'Configuração da página inicial salva com sucesso',
      data: { title, content, layout, isEnabled }
    })
  } catch (error) {
    console.error('Erro ao salvar configuração da página inicial:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/settings/public - Obter configurações públicas (sem autenticação)
router.get('/public', async (req, res) => {
  try {
    const db = Database.getDb()
    
    // Verificar se a tabela de configurações existe
    const tableExists = await new Promise((resolve, reject) => {
      db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='settings'",
        (err, row) => {
          if (err) reject(err)
          else resolve(!!row)
        }
      )
    })

    if (!tableExists) {
      // Retornar configurações padrão se tabela não existe
      return res.json({
        siteName: 'Smyrna Wiki',
        siteDescription: 'Sistema de Wiki e Gerenciamento de Conhecimento',
        logo: '',
        contactEmail: '',
        contactPhone: '',
        contactAddress: '',
        website: '',
        theme: 'light'
      })
    }

    // Buscar configurações no banco
    const settings = await new Promise((resolve, reject) => {
      db.all('SELECT key, value FROM settings', (err, rows) => {
        if (err) reject(err)
        else {
          const settingsObj = {}
          rows.forEach(row => {
            settingsObj[row.key] = row.value
          })
          resolve(settingsObj)
        }
      })
    })

    // Adicionar valores padrão para chaves que não existem
    const defaultSettings = {
      siteName: 'Smyrna Wiki',
      siteDescription: 'Sistema de Wiki e Gerenciamento de Conhecimento',
      logo: '',
      contactEmail: '',
      contactPhone: '',
      contactAddress: '',
      website: '',
      theme: 'light'
    }

    res.json({ ...defaultSettings, ...settings })
  } catch (error) {
    console.error('Erro ao obter configurações públicas:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Aplicar middleware de autenticação para todas as outras rotas
router.use(authenticateToken)

// GET /api/settings - Obter configurações do sistema
router.get('/', async (req, res) => {
  try {
    const db = Database.getDb()
    
    // Verificar se a tabela de configurações existe
    const tableExists = await new Promise((resolve, reject) => {
      db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='settings'",
        (err, row) => {
          if (err) reject(err)
          else resolve(!!row)
        }
      )
    })

    if (!tableExists) {
      // Criar tabela de configurações se não existir
      await new Promise((resolve, reject) => {
        db.run(`
          CREATE TABLE settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })

      // Inserir configurações padrão
      const defaultSettings = [
        { key: 'siteName', value: 'Smyrna Wiki' },
        { key: 'siteDescription', value: 'Sistema de Wiki e Gerenciamento de Conhecimento' },
        { key: 'logo', value: '' },
        { key: 'contactEmail', value: '' },
        { key: 'contactPhone', value: '' },
        { key: 'contactAddress', value: '' },
        { key: 'website', value: '' },
        { key: 'theme', value: 'light' }
      ]

      for (const setting of defaultSettings) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO settings (key, value) VALUES (?, ?)',
            [setting.key, setting.value],
            (err) => {
              if (err) reject(err)
              else resolve()
            }
          )
        })
      }
    }

    // Buscar todas as configurações
    const settings = await new Promise((resolve, reject) => {
      db.all('SELECT key, value FROM settings', (err, rows) => {
        if (err) reject(err)
        else {
          const settingsObj = {}
          rows.forEach(row => {
            settingsObj[row.key] = row.value
          })
          resolve(settingsObj)
        }
      })
    })

    res.json(settings)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/settings - Atualizar configurações do sistema
router.put('/', async (req, res) => {
  try {
    // Verificar se é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem alterar configurações.' })
    }

    const db = Database.getDb()
    const settings = req.body

    // Atualizar cada configuração
    for (const [key, value] of Object.entries(settings)) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR REPLACE INTO settings (key, value, updated_at) 
           VALUES (?, ?, CURRENT_TIMESTAMP)`,
          [key, value],
          (err) => {
            if (err) reject(err)
            else resolve()
          }
        )
      })
    }

    res.json({ message: 'Configurações atualizadas com sucesso!' })
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

export default router
