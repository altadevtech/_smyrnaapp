import express from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

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
        siteName: 'Smyrna CMS',
        siteDescription: 'Sistema de Gerenciamento de Conteúdo',
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
      siteName: 'Smyrna CMS',
      siteDescription: 'Sistema de Gerenciamento de Conteúdo',
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
        { key: 'siteName', value: 'Smyrna CMS' },
        { key: 'siteDescription', value: 'Sistema de Gerenciamento de Conteúdo' },
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
