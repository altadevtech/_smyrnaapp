import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Função para importar SQLite3 com verificação de bindings
async function importSQLite3() {
  try {
    console.log('🔍 Verificando bindings do SQLite3...')
    const sqlite3Module = await import('sqlite3')
    console.log('✅ SQLite3 importado com sucesso')
    return sqlite3Module.default.verbose()
  } catch (error) {
    console.error('❌ Erro ao importar SQLite3:', error.message)
    
    if (error.message.includes('bindings')) {
      console.log('🔧 Erro de bindings detectado - tentando rebuild automático...')
      
      try {
        const { execSync } = await import('child_process')
        execSync('npm rebuild sqlite3', { stdio: 'inherit' })
        console.log('✅ Rebuild do SQLite3 concluído, tentando importar novamente...')
        
        const sqlite3Module = await import('sqlite3')
        return sqlite3Module.default.verbose()
      } catch (rebuildError) {
        console.error('❌ Falha no rebuild automático:', rebuildError.message)
        throw rebuildError
      }
    }
    
    throw error
  }
}

class Database {
  constructor() {
    this.db = null
    this.sqlite3 = null
  }

  async init() {
    try {
      // Importar SQLite3 com verificação de bindings
      this.sqlite3 = await importSQLite3()
      
      const dbPath = process.env.DB_PATH || path.join(__dirname, 'smyrna.db')
      console.log('🗄️ Caminho do banco de dados:', dbPath)
      
      return new Promise((resolve, reject) => {
        this.db = new this.sqlite3.Database(dbPath, (err) => {
          if (err) {
            console.error('❌ Erro ao conectar com o banco de dados:', err.message)
            reject(err)
          } else {
            console.log('✅ Conectado ao banco de dados SQLite:', dbPath)
            this.createTables()
              .then(() => {
                console.log('✅ Database inicializado com sucesso')
                resolve()
              })
              .catch(reject)
          }
        })
      })
    } catch (error) {
      console.error('❌ Erro durante inicialização do database:', error.message)
      throw error
    }
  }

  createTables() {
    return new Promise((resolve, reject) => {
      console.log('🔧 Criando tabelas do banco de dados...')
      
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

      // Tabela do wiki
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
          category_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users (id),
          FOREIGN KEY (template_id) REFERENCES templates (id),
          FOREIGN KEY (category_id) REFERENCES categories (id)
        )
      `

      // Tabela de posts
      const postTable = `
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT UNIQUE,
          content TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'draft',
          author_id INTEGER NOT NULL,
          category_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users (id),
          FOREIGN KEY (category_id) REFERENCES categories (id)
        )
      `

      // Tabela de categorias
      const categoryTable = `
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          slug TEXT NOT NULL,
          description TEXT,
          type TEXT NOT NULL DEFAULT 'blog',
          color TEXT DEFAULT '#3b82f6',
          parent_id INTEGER DEFAULT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(name, type, parent_id),
          UNIQUE(slug, type, parent_id),
          FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE CASCADE
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

      // Tabela de menus hierárquicos
      const menuTable = `
        CREATE TABLE IF NOT EXISTS menus (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          url TEXT,
          target TEXT DEFAULT '_self',
          parent_id INTEGER,
          page_id INTEGER,
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          css_class TEXT,
          icon TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (parent_id) REFERENCES menus (id) ON DELETE CASCADE,
          FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE SET NULL
        )
      `

      // Tabela de versões do wiki
      const pageVersionsTable = `
        CREATE TABLE IF NOT EXISTS page_versions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          page_id INTEGER NOT NULL,
          version_number INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          author_id INTEGER NOT NULL,
          change_summary TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE,
          FOREIGN KEY (author_id) REFERENCES users (id),
          UNIQUE(page_id, version_number)
        )
      `

      // Tabela de comentários no wiki
      const pageCommentsTable = `
        CREATE TABLE IF NOT EXISTS page_comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          page_id INTEGER NOT NULL,
          author_id INTEGER NOT NULL,
          content TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'approved',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE,
          FOREIGN KEY (author_id) REFERENCES users (id)
        )
      `

      this.db.serialize(() => {
        let completed = 0
        const totalTables = 9  // Adicionadas tabelas de versões e comentários
        const checkComplete = () => {
          completed++
          if (completed === totalTables) {
            this.createDefaultTemplates()
            this.createDefaultUsers()
            this.createDefaultCategories()
            resolve()
          }
        }

        this.db.run(userTable, (err) => {
          if (err) {
            console.error('❌ Erro ao criar tabela users:', err)
            reject(err)
          } else {
            console.log('✅ Tabela users criada/verificada')
            checkComplete()
          }
        })
        
        this.db.run(templateTable, (err) => {
          if (err) {
            console.error('❌ Erro ao criar tabela templates:', err)
            reject(err)
          } else {
            console.log('✅ Tabela templates criada/verificada')
            checkComplete()
          }
        })
        
        this.db.run(widgetTable, (err) => {
          if (err) {
            console.error('❌ Erro ao criar tabela widgets:', err)
            reject(err)
          } else {
            console.log('✅ Tabela widgets criada/verificada')
            checkComplete()
          }
        })
        
        this.db.run(pageTable, (err) => {
          if (err) {
            console.error('❌ Erro ao criar tabela pages:', err)
            reject(err)
          } else {
            console.log('✅ Tabela pages criada/verificada')
            checkComplete()
          }
        })
        
        this.db.run(categoryTable, (err) => {
          if (err) {
            console.error('❌ Erro ao criar tabela categories:', err)
            reject(err)
          } else {
            console.log('✅ Tabela categories criada/verificada')
            checkComplete()
          }
        })
        
        this.db.run(postTable, (err) => {
          if (err) {
            console.error('❌ Erro ao criar tabela posts:', err)
            reject(err)
          } else {
            console.log('✅ Tabela posts criada/verificada')
            checkComplete()
          }
        })

        this.db.run(menuTable, (err) => {
          if (err) {
            console.error('❌ Erro ao criar tabela menus:', err)
            reject(err)
          } else {
            console.log('✅ Tabela menus criada/verificada')
            this.createDefaultMenus()
            checkComplete()
          }
        })

        this.db.run(pageVersionsTable, (err) => {
          if (err) {
            console.error('❌ Erro ao criar tabela page_versions:', err)
            reject(err)
          } else {
            console.log('✅ Tabela page_versions criada/verificada')
            checkComplete()
          }
        })

        this.db.run(pageCommentsTable, (err) => {
          if (err) {
            console.error('❌ Erro ao criar tabela page_comments:', err)
            reject(err)
          } else {
            console.log('✅ Tabela page_comments criada/verificada')
            checkComplete()
          }
        })
      })
    })
  }

  async createDefaultUsers() {
    console.log('👥 Verificando usuários padrão...')
    
    try {
      const adminPassword = await bcrypt.hash('admin123', 10)
      const editorPassword = await bcrypt.hash('editor123', 10)

      // Verificar se já existem usuários
      this.db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
        if (err) {
          console.error('❌ Erro ao verificar usuários existentes:', err)
          return
        }

        console.log('📊 Usuários existentes no banco:', result.count)

        if (result.count === 0) {
          console.log('➕ Criando usuários padrão...')
          
          // Inserir usuário admin
          this.db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin', 'admin@smyrna.com', adminPassword, 'admin'],
            function(err) {
              if (err) {
                console.error('❌ Erro ao criar usuário admin:', err)
              } else {
                console.log('✅ Usuário admin criado, ID:', this.lastID)
              }
            }
          )

          // Inserir usuário editor
          this.db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Editor', 'editor@smyrna.com', editorPassword, 'editor'],
            function(err) {
              if (err) {
                console.error('❌ Erro ao criar usuário editor:', err)
              } else {
                console.log('✅ Usuário editor criado, ID:', this.lastID)
              }
            }
          )
        } else {
          console.log('👥 Usuários já existem no banco de dados')
        }
      })
    } catch (error) {
      console.error('❌ Erro ao criar senhas hash:', error)
    }
  }

  createDefaultCategories() {
    console.log('🏷️  Verificando categorias padrão...')
    
    // Verificar se já existem categorias
    this.db.get('SELECT COUNT(*) as count FROM categories', (err, result) => {
      if (err) {
        console.error('❌ Erro ao verificar categorias existentes:', err)
        return
      }

      console.log('📊 Categorias existentes no banco:', result.count)

      if (result.count === 0) {
        console.log('➕ Criando categorias padrão...')
        
        const defaultCategories = [
          // Categorias para Blog
          {
            name: 'Geral',
            slug: 'geral',
            description: 'Categoria geral para posts diversos',
            color: '#6366f1',
            type: 'blog'
          },
          {
            name: 'Tecnologia',
            slug: 'tecnologia',
            description: 'Posts sobre tecnologia e inovação',
            color: '#06b6d4',
            type: 'blog'
          },
          {
            name: 'Negócios',
            slug: 'negocios',
            description: 'Conteúdo relacionado a negócios e economia',
            color: '#10b981',
            type: 'blog'
          },
          {
            name: 'Anúncios',
            slug: 'anuncios',
            description: 'Comunicados e anúncios importantes',
            color: '#f59e0b',
            type: 'blog'
          },
          // Categorias para Wiki
          {
            name: 'Documentação',
            slug: 'documentacao',
            description: 'Documentação técnica e procedimentos',
            color: '#8b5cf6',
            type: 'wiki'
          },
          {
            name: 'Tutoriais',
            slug: 'tutoriais',
            description: 'Guias e tutoriais passo a passo',
            color: '#ef4444',
            type: 'wiki'
          },
          {
            name: 'FAQ',
            slug: 'faq',
            description: 'Perguntas frequentes e respostas',
            color: '#f97316',
            type: 'wiki'
          },
          {
            name: 'Conhecimento Geral',
            slug: 'conhecimento-geral',
            description: 'Conhecimento geral e informações úteis',
            color: '#22c55e',
            type: 'wiki'
          }
        ]

        defaultCategories.forEach((category, index) => {
          this.db.run(
            'INSERT INTO categories (name, slug, description, color, type) VALUES (?, ?, ?, ?, ?)',
            [category.name, category.slug, category.description, category.color, category.type],
            function(err) {
              if (err) {
                console.error(`❌ Erro ao criar categoria ${category.name}:`, err)
              } else {
                console.log(`✅ Categoria "${category.name}" (${category.type}) criada, ID:`, this.lastID)
              }
            }
          )
        })
      } else {
        console.log('🏷️  Categorias já existem no banco de dados')
      }
    })
  }

  createDefaultTemplates() {
    console.log('📋 Verificando templates padrão...')
    
    // Verificar se já existem templates
    this.db.get('SELECT COUNT(*) as count FROM templates', (err, result) => {
      if (err) {
        console.error('❌ Erro ao verificar templates existentes:', err)
        return
      }

      if (result.count === 0) {
        console.log('➕ Criando templates padrão...')
        
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
              console.error('❌ Erro ao criar template 1:', err)
            } else {
              console.log('✅ Template 1 criado, ID:', this.lastID)
            }
          }
        )

        this.db.run(
          'INSERT INTO templates (name, description, layout) VALUES (?, ?, ?)',
          ['Layout com Banner', 'Template com banner principal e conteúdo', JSON.stringify(template2Layout)],
          function(err) {
            if (err) {
              console.error('❌ Erro ao criar template 2:', err)
            } else {
              console.log('✅ Template 2 criado, ID:', this.lastID)
            }
          }
        )

        this.db.run(
          'INSERT INTO templates (name, description, layout) VALUES (?, ?, ?)',
          ['Layout Completo', 'Template completo com banner, notícias, conteúdo e contato', JSON.stringify(template3Layout)],
          function(err) {
            if (err) {
              console.error('❌ Erro ao criar template 3:', err)
            } else {
              console.log('✅ Template 3 criado, ID:', this.lastID)
            }
          }
        )
      } else {
        console.log('📋 Templates já existem no banco de dados')
      }
    })
  }

  createDefaultMenus() {
    this.db.get('SELECT COUNT(*) as count FROM menus', (err, row) => {
      if (err) {
        console.error('ÔØî Erro ao verificar menus:', err)
        return
      }

      if (row.count === 0) {
        console.log('­ƒì£ Criando menus padr├úo...')

        // Menu principal
        const defaultMenus = [
          { title: 'Home', url: '/', sort_order: 1, is_active: true },
          { title: 'Sobre', url: '/sobre', sort_order: 2, is_active: true },
          { title: 'Servi├ºos', url: '/servicos', sort_order: 3, is_active: true },
          { title: 'Blog', url: '/blog', sort_order: 4, is_active: true },
          { title: 'Contato', url: '/contato', sort_order: 5, is_active: true }
        ]

        defaultMenus.forEach((menu, index) => {
          this.db.run(
            'INSERT INTO menus (title, url, sort_order, is_active) VALUES (?, ?, ?, ?)',
            [menu.title, menu.url, menu.sort_order, menu.is_active],
            function(err) {
              if (err) {
                console.error(`❌ Erro ao criar menu ${menu.title}:`, err)
              } else {
                console.log(`✅ Menu ${menu.title} criado, ID:`, this.lastID)
              }
            }
          )
        })
      } else {
        console.log('🍜 Menus já existem no banco de dados')
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
          console.error('❌ Erro ao fechar o banco de dados:', err.message)
        } else {
          console.log('✅ Conexão com o banco de dados fechada.')
        }
      })
    }
  }
}

export default new Database()
