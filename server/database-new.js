import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class DatabaseManager {
  constructor() {
    this.db = null
    this.useBetter = false
  }

  async init() {
    const dbPath = process.env.DB_PATH || path.join(__dirname, 'smyrna.db')
    console.log('Caminho do banco de dados:', dbPath)
    
    // Tentar usar better-sqlite3 primeiro (mais confiável no Render)
    try {
      const BetterSqlite3 = (await import('better-sqlite3')).default
      this.db = new BetterSqlite3(dbPath)
      this.useBetter = true
      console.log('✅ Conectado ao banco com better-sqlite3:', dbPath)
      this.createTables()
      return
    } catch (error) {
      console.log('⚠️ better-sqlite3 não disponível, tentando sqlite3...')
    }

    // Fallback para sqlite3
    try {
      const sqlite3 = (await import('sqlite3')).default.verbose()
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('❌ Erro ao conectar com sqlite3:', err.message)
          throw err
        } else {
          this.useBetter = false
          console.log('✅ Conectado ao banco com sqlite3:', dbPath)
          this.createTables()
        }
      })
    } catch (error) {
      console.error('❌ Nenhuma biblioteca SQLite disponível:', error)
      throw new Error('SQLite não disponível')
    }
  }

  createTables() {
    console.log('🔧 Criando tabelas do banco de dados...')
    
    const tables = {
      users: `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'editor',
          status TEXT NOT NULL DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
      templates: `
        CREATE TABLE IF NOT EXISTS templates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          layout JSON NOT NULL,
          is_default BOOLEAN DEFAULT false,
          show_header BOOLEAN DEFAULT true,
          show_footer BOOLEAN DEFAULT true,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
      widgets: `
        CREATE TABLE IF NOT EXISTS widgets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          name TEXT NOT NULL,
          config JSON NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
      pages: `
        CREATE TABLE IF NOT EXISTS pages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'draft',
          author_id INTEGER NOT NULL,
          template_id INTEGER DEFAULT 1,
          widget_data JSON,
          slug TEXT UNIQUE,
          is_home BOOLEAN DEFAULT false,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users (id),
          FOREIGN KEY (template_id) REFERENCES templates (id)
        )
      `,
      posts: `
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'draft',
          author_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users (id)
        )
      `
    }

    if (this.useBetter) {
      // Better SQLite3 - síncrono
      try {
        Object.entries(tables).forEach(([name, sql]) => {
          this.db.exec(sql)
          console.log(`✅ Tabela ${name} criada/verificada`)
        })
        this.createDefaultTemplates()
        this.createDefaultUsers()
      } catch (error) {
        console.error('❌ Erro ao criar tabelas (better-sqlite3):', error)
      }
    } else {
      // SQLite3 - assíncrono
      this.db.serialize(() => {
        Object.entries(tables).forEach(([name, sql]) => {
          this.db.run(sql, (err) => {
            if (err) {
              console.error(`❌ Erro ao criar tabela ${name}:`, err)
            } else {
              console.log(`✅ Tabela ${name} criada/verificada`)
            }
          })
        })
        this.createDefaultTemplates()
        this.createDefaultUsers()
      })
    }
  }

  async createDefaultUsers() {
    console.log('👥 Verificando usuários padrão...')
    
    try {
      const adminPassword = await bcrypt.hash('admin123', 10)
      const editorPassword = await bcrypt.hash('editor123', 10)

      if (this.useBetter) {
        // Better SQLite3
        const result = this.db.prepare('SELECT COUNT(*) as count FROM users').get()
        
        if (result.count === 0) {
          console.log('➕ Criando usuários padrão...')
          
          const insertUser = this.db.prepare(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
          )
          
          const adminResult = insertUser.run('Admin', 'admin@smyrna.com', adminPassword, 'admin')
          console.log('✅ Admin criado, ID:', adminResult.lastInsertRowid)

          const editorResult = insertUser.run('Editor', 'editor@smyrna.com', editorPassword, 'editor')
          console.log('✅ Editor criado, ID:', editorResult.lastInsertRowid)
        } else {
          console.log('👥 Usuários já existem')
        }
      } else {
        // SQLite3
        this.db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
          if (err) {
            console.error('❌ Erro ao verificar usuários:', err)
            return
          }

          if (result.count === 0) {
            console.log('➕ Criando usuários padrão...')
            
            this.db.run(
              'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
              ['Admin', 'admin@smyrna.com', adminPassword, 'admin'],
              function(err) {
                if (err) {
                  console.error('❌ Erro ao criar admin:', err)
                } else {
                  console.log('✅ Admin criado, ID:', this.lastID)
                }
              }
            )

            this.db.run(
              'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
              ['Editor', 'editor@smyrna.com', editorPassword, 'editor'],
              function(err) {
                if (err) {
                  console.error('❌ Erro ao criar editor:', err)
                } else {
                  console.log('✅ Editor criado, ID:', this.lastID)
                }
              }
            )
          } else {
            console.log('👥 Usuários já existem')
          }
        })
      }
    } catch (error) {
      console.error('❌ Erro ao criar usuários:', error)
    }
  }

  createDefaultTemplates() {
    console.log('📋 Verificando templates padrão...')
    
    const templates = [
      {
        name: 'Layout Básico',
        description: 'Template simples com bloco de conteúdo',
        layout: { blocks: [{ id: 'block-1', type: 'content', config: { title: 'Bloco de Conteúdo', allowHtml: true } }] },
        is_default: true
      },
      {
        name: 'Layout com Banner',
        description: 'Template com banner principal e conteúdo',
        layout: { 
          blocks: [
            { id: 'block-1', type: 'banner', config: { title: 'Banner Principal', height: '400px' } },
            { id: 'block-2', type: 'content', config: { title: 'Conteúdo Principal', allowHtml: true } }
          ] 
        },
        is_default: false
      },
      {
        name: 'Layout Completo',
        description: 'Template completo com banner, notícias, conteúdo e contato',
        layout: { 
          blocks: [
            { id: 'block-1', type: 'banner', config: { title: 'Banner Principal', height: '300px' } },
            { id: 'block-2', type: 'news', config: { title: 'Últimas Notícias', count: 6 } },
            { id: 'block-3', type: 'content', config: { title: 'Sobre Nós', allowHtml: true } },
            { id: 'block-4', type: 'contact', config: { title: 'Fale Conosco' } }
          ] 
        },
        is_default: false
      }
    ]

    if (this.useBetter) {
      // Better SQLite3
      try {
        const result = this.db.prepare('SELECT COUNT(*) as count FROM templates').get()
        
        if (result.count === 0) {
          console.log('➕ Criando templates padrão...')
          
          const insertTemplate = this.db.prepare(
            'INSERT INTO templates (name, description, layout, is_default) VALUES (?, ?, ?, ?)'
          )
          
          templates.forEach((template, index) => {
            const result = insertTemplate.run(
              template.name, 
              template.description, 
              JSON.stringify(template.layout), 
              template.is_default ? 1 : 0
            )
            console.log(`✅ Template ${index + 1} criado, ID:`, result.lastInsertRowid)
          })
        } else {
          console.log('📋 Templates já existem')
        }
      } catch (error) {
        console.error('❌ Erro ao criar templates (better-sqlite3):', error)
      }
    } else {
      // SQLite3
      this.db.get('SELECT COUNT(*) as count FROM templates', (err, result) => {
        if (err) {
          console.error('❌ Erro ao verificar templates:', err)
          return
        }

        if (result.count === 0) {
          console.log('➕ Criando templates padrão...')
          
          templates.forEach((template, index) => {
            this.db.run(
              'INSERT INTO templates (name, description, layout, is_default) VALUES (?, ?, ?, ?)',
              [template.name, template.description, JSON.stringify(template.layout), template.is_default ? 1 : 0],
              function(err) {
                if (err) {
                  console.error(`❌ Erro ao criar template ${index + 1}:`, err)
                } else {
                  console.log(`✅ Template ${index + 1} criado, ID:`, this.lastID)
                }
              }
            )
          })
        } else {
          console.log('📋 Templates já existem')
        }
      })
    }
  }

  getDb() {
    return this.db
  }

  close() {
    if (this.db) {
      if (this.useBetter) {
        this.db.close()
      } else {
        this.db.close((err) => {
          if (err) {
            console.error('❌ Erro ao fechar banco:', err.message)
          } else {
            console.log('✅ Banco fechado')
          }
        })
      }
    }
  }
}

export default new DatabaseManager()
