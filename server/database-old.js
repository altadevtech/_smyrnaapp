import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let sqlite3, BetterSqlite3

// Tentar usar better-sqlite3 primeiro, depois sqlite3
try {
  const betterSqlite3Module = await import('better-sqlite3')
  BetterSqlite3 = betterSqlite3Module.default
  console.log('Usando better-sqlite3')
} catch (error) {
  console.log('better-sqlite3 não disponível, tentando sqlite3...')
  try {
    const sqlite3Module = await import('sqlite3')
    sqlite3 = sqlite3Module.default.verbose()
    console.log('Usando sqlite3')
  } catch (error2) {
    console.error('Nenhuma biblioteca SQLite disponível:', error2)
    throw new Error('SQLite não disponível')
  }
}

class Database {
  constructor() {
    this.db = null
  }

  init() {
    const dbPath = process.env.DB_PATH || path.join(__dirname, 'smyrna.db')
    console.log('Caminho do banco de dados:', dbPath)
    
    if (BetterSqlite3) {
      // Usar better-sqlite3 (síncrono)
      try {
        this.db = new BetterSqlite3(dbPath)
        this.useBetter = true
        console.log('Conectado ao banco de dados SQLite com better-sqlite3:', dbPath)
        this.createTables()
      } catch (error) {
        console.error('Erro ao conectar com better-sqlite3:', error.message)
        throw error
      }
    } else if (sqlite3) {
      // Usar sqlite3 (assíncrono)
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Erro ao conectar com o banco de dados:', err.message)
        } else {
          this.useBetter = false
          console.log('Conectado ao banco de dados SQLite com sqlite3:', dbPath)
          this.createTables()
        }
      })
    } else {
      throw new Error('Nenhuma biblioteca SQLite disponível')
    }
  }

  createTables() {
    console.log('Criando tabelas do banco de dados...')
    
    // Tabela de usuários
    const userTable = `
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
    `

    // Tabela de páginas
    const pageTable = `
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
    `

    // Tabela de posts
    const postTable = `
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

    // Tabela de templates
    const templateTable = `
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
    `

    // Tabela de widgets
    const widgetTable = `
      CREATE TABLE IF NOT EXISTS widgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        config JSON NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `

    this.db.serialize(() => {
      this.db.run(userTable, (err) => {
        if (err) {
          console.error('Erro ao criar tabela users:', err)
        } else {
          console.log('Tabela users criada/verificada com sucesso')
        }
      })
      
      this.db.run(templateTable, (err) => {
        if (err) {
          console.error('Erro ao criar tabela templates:', err)
        } else {
          console.log('Tabela templates criada/verificada com sucesso')
          this.createDefaultTemplates()
        }
      })
      
      this.db.run(widgetTable, (err) => {
        if (err) {
          console.error('Erro ao criar tabela widgets:', err)
        } else {
          console.log('Tabela widgets criada/verificada com sucesso')
          this.createDefaultWidgets()
        }
      })
      
      this.db.run(pageTable, (err) => {
        if (err) {
          console.error('Erro ao criar tabela pages:', err)
        } else {
          console.log('Tabela pages criada/verificada com sucesso')
        }
      })
      
      this.db.run(postTable, (err) => {
        if (err) {
          console.error('Erro ao criar tabela posts:', err)
        } else {
          console.log('Tabela posts criada/verificada com sucesso')
        }
      })
      
      // Inserir usuários padrão
      this.createDefaultUsers()
    })
  }

  async createDefaultUsers() {
    console.log('Verificando usuários padrão...')
    
    try {
      const adminPassword = await bcrypt.hash('admin123', 10)
      const editorPassword = await bcrypt.hash('editor123', 10)

      // Verificar se já existem usuários
      this.db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
        if (err) {
          console.error('Erro ao verificar usuários existentes:', err)
          return
        }

        console.log('Usuários existentes no banco:', result.count)

        if (result.count === 0) {
          console.log('Criando usuários padrão...')
          
          // Inserir usuário admin
          this.db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin', 'admin@smyrna.com', adminPassword, 'admin'],
            function(err) {
              if (err) {
                console.error('Erro ao criar usuário admin:', err)
              } else {
                console.log('✅ Usuário admin criado com ID:', this.lastID)
              }
            }
          )

          // Inserir usuário editor
          this.db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Editor', 'editor@smyrna.com', editorPassword, 'editor'],
            function(err) {
              if (err) {
                console.error('Erro ao criar usuário editor:', err)
              } else {
                console.log('✅ Usuário editor criado com ID:', this.lastID)
              }
            }
          )
        } else {
          console.log('Usuários já existem no banco de dados')
        }
      })
    } catch (error) {
      console.error('Erro ao criar senhas hash:', error)
    }
  }

  createDefaultWidgets() {
    console.log('Verificando widgets padrão...')
    
    // Verificar se já existem widgets
    this.db.get('SELECT COUNT(*) as count FROM widgets', (err, result) => {
      if (err) {
        console.error('Erro ao verificar widgets existentes:', err)
        return
      }

      if (result.count === 0) {
        console.log('Criando widgets padrão...')
        
        // Widget 1 - Banner Principal
        const bannerConfig = {
          title: 'Bem-vindo ao Smyrna Wiki',
          description: 'Sistema de wiki e gerenciamento de conhecimento moderno e eficiente',
          image: '',
          link: '#',
          buttonText: 'Saiba Mais'
        }

        // Widget 2 - Notícias
        const newsConfig = {
          title: 'Últimas Notícias',
          count: 6,
          showDate: true,
          showExcerpt: true
        }

        // Widget 3 - Login
        const loginConfig = {
          title: 'Área Restrita',
          showRegister: false,
          redirectAfterLogin: '/dashboard'
        }

        // Widget 4 - Contato
        const contactConfig = {
          title: 'Entre em Contato',
          email: 'contato@smyrna.com',
          phone: '(11) 99999-9999',
          address: 'São Paulo, SP, Brasil',
          showForm: true
        }

        this.db.run(
          'INSERT INTO widgets (type, name, config) VALUES (?, ?, ?)',
          ['banner', 'Banner Principal', JSON.stringify(bannerConfig)],
          function(err) {
            if (err) {
              console.error('Erro ao criar widget banner:', err)
            } else {
              console.log('✅ Widget Banner criado com ID:', this.lastID)
            }
          }
        )

        this.db.run(
          'INSERT INTO widgets (type, name, config) VALUES (?, ?, ?)',
          ['news', 'Widget de Notícias', JSON.stringify(newsConfig)],
          function(err) {
            if (err) {
              console.error('Erro ao criar widget news:', err)
            } else {
              console.log('✅ Widget Notícias criado com ID:', this.lastID)
            }
          }
        )

        this.db.run(
          'INSERT INTO widgets (type, name, config) VALUES (?, ?, ?)',
          ['login', 'Widget de Login', JSON.stringify(loginConfig)],
          function(err) {
            if (err) {
              console.error('Erro ao criar widget login:', err)
            } else {
              console.log('✅ Widget Login criado com ID:', this.lastID)
            }
          }
        )

        this.db.run(
          'INSERT INTO widgets (type, name, config) VALUES (?, ?, ?)',
          ['contact', 'Widget de Contato', JSON.stringify(contactConfig)],
          function(err) {
            if (err) {
              console.error('Erro ao criar widget contact:', err)
            } else {
              console.log('✅ Widget Contato criado com ID:', this.lastID)
            }
          }
        )
      } else {
        console.log('Widgets já existem no banco de dados')
      }
    })
  }

  createDefaultTemplates() {
    console.log('Verificando templates padrão...')
    
    // Verificar se já existem templates
    this.db.get('SELECT COUNT(*) as count FROM templates', (err, result) => {
      if (err) {
        console.error('Erro ao verificar templates existentes:', err)
        return
      }

      if (result.count === 0) {
        console.log('Criando templates padrão...')
        
        // Template 1 - Layout Básico
        const template1Layout = {
          blocks: [
            { 
              id: 'block-1', 
              type: 'content', 
              config: { title: 'Bloco de Conteúdo', allowHtml: true } 
            }
          ]
        }

        // Template 2 - Layout com Banner
        const template2Layout = {
          blocks: [
            { 
              id: 'block-1', 
              type: 'banner', 
              config: { title: 'Banner Principal', height: '400px' } 
            },
            { 
              id: 'block-2', 
              type: 'content', 
              config: { title: 'Conteúdo Principal', allowHtml: true } 
            }
          ]
        }

        // Template 3 - Layout Completo
        const template3Layout = {
          blocks: [
            { 
              id: 'block-1', 
              type: 'banner', 
              config: { title: 'Banner Principal', height: '300px' } 
            },
            { 
              id: 'block-2', 
              type: 'news', 
              config: { title: 'Últimas Notícias', count: 6 } 
            },
            { 
              id: 'block-3', 
              type: 'content', 
              config: { title: 'Sobre Nós', allowHtml: true } 
            },
            { 
              id: 'block-4', 
              type: 'contact', 
              config: { title: 'Fale Conosco' } 
            }
          ]
        }

        // Inserir templates
        this.db.run(
          'INSERT INTO templates (name, description, layout, is_default) VALUES (?, ?, ?, ?)',
          ['Layout Básico', 'Template simples com bloco de conteúdo', JSON.stringify(template1Layout), true],
          function(err) {
            if (err) {
              console.error('Erro ao criar template 1:', err)
            } else {
              console.log('✅ Template 1 criado com ID:', this.lastID)
            }
          }
        )

        this.db.run(
          'INSERT INTO templates (name, description, layout) VALUES (?, ?, ?)',
          ['Layout com Banner', 'Template com banner principal e conteúdo', JSON.stringify(template2Layout)],
          function(err) {
            if (err) {
              console.error('Erro ao criar template 2:', err)
            } else {
              console.log('✅ Template 2 criado com ID:', this.lastID)
            }
          }
        )

        this.db.run(
          'INSERT INTO templates (name, description, layout) VALUES (?, ?, ?)',
          ['Layout Completo', 'Template completo com banner, notícias, conteúdo e contato', JSON.stringify(template3Layout)],
          function(err) {
            if (err) {
              console.error('Erro ao criar template 3:', err)
            } else {
              console.log('✅ Template 3 criado com ID:', this.lastID)
            }
          }
        )
      } else {
        console.log('Templates já existem no banco de dados')
      }
    })
  }

  getDb() {
    return this.db
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Erro ao fechar o banco de dados:', err.message)
        } else {
          console.log('Conexão com o banco de dados fechada.')
        }
      })
    }
  }
}

export default new Database()
