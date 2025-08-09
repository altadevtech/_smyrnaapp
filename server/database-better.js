import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class DatabaseManager {
  constructor() {
    this.db = null
  }

  init() {
    const dbPath = process.env.DB_PATH || path.join(__dirname, 'smyrna.db')
    console.log('Caminho do banco de dados:', dbPath)
    
    try {
      this.db = new Database(dbPath)
      console.log('Conectado ao banco de dados SQLite com better-sqlite3:', dbPath)
      this.createTables()
    } catch (error) {
      console.error('Erro ao conectar com o banco de dados:', error.message)
      throw error
    }
  }

  createTables() {
    console.log('Criando tabelas do banco de dados...')
    
    try {
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

      // Executar criação das tabelas
      this.db.exec(userTable)
      console.log('Tabela users criada/verificada com sucesso')
      
      this.db.exec(templateTable)
      console.log('Tabela templates criada/verificada com sucesso')
      
      this.db.exec(widgetTable)
      console.log('Tabela widgets criada/verificada com sucesso')
      
      this.db.exec(pageTable)
      console.log('Tabela pages criada/verificada com sucesso')
      
      this.db.exec(postTable)
      console.log('Tabela posts criada/verificada com sucesso')
      
      // Inserir dados padrão
      this.createDefaultTemplates()
      this.createDefaultUsers()
      
    } catch (error) {
      console.error('Erro ao criar tabelas:', error)
    }
  }

  async createDefaultUsers() {
    console.log('Verificando usuários padrão...')
    
    try {
      const adminPassword = await bcrypt.hash('admin123', 10)
      const editorPassword = await bcrypt.hash('editor123', 10)

      // Verificar se já existem usuários
      const result = this.db.prepare('SELECT COUNT(*) as count FROM users').get()
      console.log('Usuários existentes no banco:', result.count)

      if (result.count === 0) {
        console.log('Criando usuários padrão...')
        
        // Inserir usuário admin
        const insertUser = this.db.prepare(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
        )
        
        const adminResult = insertUser.run('Admin', 'admin@smyrna.com', adminPassword, 'admin')
        console.log('✅ Usuário admin criado com ID:', adminResult.lastInsertRowid)

        // Inserir usuário editor
        const editorResult = insertUser.run('Editor', 'editor@smyrna.com', editorPassword, 'editor')
        console.log('✅ Usuário editor criado com ID:', editorResult.lastInsertRowid)
      } else {
        console.log('Usuários já existem no banco de dados')
      }
    } catch (error) {
      console.error('Erro ao criar usuários padrão:', error)
    }
  }

  createDefaultTemplates() {
    console.log('Verificando templates padrão...')
    
    try {
      // Verificar se já existem templates
      const result = this.db.prepare('SELECT COUNT(*) as count FROM templates').get()

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
        const insertTemplate = this.db.prepare(
          'INSERT INTO templates (name, description, layout, is_default) VALUES (?, ?, ?, ?)'
        )
        
        const template1Result = insertTemplate.run(
          'Layout Básico', 
          'Template simples com bloco de conteúdo', 
          JSON.stringify(template1Layout), 
          1
        )
        console.log('✅ Template 1 criado com ID:', template1Result.lastInsertRowid)

        const insertTemplate2 = this.db.prepare(
          'INSERT INTO templates (name, description, layout) VALUES (?, ?, ?)'
        )
        
        const template2Result = insertTemplate2.run(
          'Layout com Banner', 
          'Template com banner principal e conteúdo', 
          JSON.stringify(template2Layout)
        )
        console.log('✅ Template 2 criado com ID:', template2Result.lastInsertRowid)

        const template3Result = insertTemplate2.run(
          'Layout Completo', 
          'Template completo com banner, notícias, conteúdo e contato', 
          JSON.stringify(template3Layout)
        )
        console.log('✅ Template 3 criado com ID:', template3Result.lastInsertRowid)
      } else {
        console.log('Templates já existem no banco de dados')
      }
    } catch (error) {
      console.error('Erro ao criar templates padrão:', error)
    }
  }

  getDb() {
    return this.db
  }

  close() {
    if (this.db) {
      this.db.close()
      console.log('Conexão com o banco de dados fechada.')
    }
  }
}

export default new DatabaseManager()
