import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

sqlite3.verbose()

const dbPath = path.join(__dirname, 'smyrna.db')
const db = new sqlite3.Database(dbPath)

console.log('🔍 Verificando e corrigindo estrutura do banco de dados...\n')

// Verificar estrutura atual da tabela pages
db.all('PRAGMA table_info(pages)', (err, rows) => {
  if (err) {
    console.error('❌ Erro ao verificar estrutura:', err)
    return
  }
  
  console.log('📋 Colunas atuais da tabela pages:')
  const currentColumns = rows.map(row => row.name)
  rows.forEach(row => {
    console.log(`  - ${row.name} (${row.type})`)
  })
  
  // Verificar quais colunas estão faltando
  const requiredColumns = {
    'template_id': 'INTEGER DEFAULT 1',
    'widget_data': 'TEXT',
    'slug': 'TEXT',
    'is_home': 'INTEGER DEFAULT 0'
  }
  
  const missingColumns = Object.keys(requiredColumns).filter(col => !currentColumns.includes(col))
  
  if (missingColumns.length > 0) {
    console.log('\n❌ Colunas faltando:', missingColumns)
    console.log('🔧 Adicionando colunas faltantes...\n')
    
    addMissingColumns(missingColumns, requiredColumns)
  } else {
    console.log('\n✅ Todas as colunas necessárias estão presentes!')
    checkTemplatesTable()
  }
})

function addMissingColumns(missingColumns, requiredColumns) {
  let completed = 0
  
  missingColumns.forEach((column) => {
    const columnDef = requiredColumns[column]
    const command = `ALTER TABLE pages ADD COLUMN ${column} ${columnDef}`
    
    db.run(command, (err) => {
      if (err) {
        console.error(`❌ Erro ao adicionar ${column}:`, err.message)
      } else {
        console.log(`✅ Coluna ${column} adicionada com sucesso`)
      }
      
      completed++
      if (completed === missingColumns.length) {
        console.log('\n🎉 Colunas da tabela pages atualizadas!')
        checkTemplatesTable()
      }
    })
  })
}

function checkTemplatesTable() {
  console.log('\n🔍 Verificando tabela templates...')
  
  db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='templates'", (err, rows) => {
    if (err) {
      console.error('❌ Erro ao verificar templates:', err)
      return
    }
    
    if (rows.length === 0) {
      console.log('❌ Tabela templates não existe. Criando...')
      createTemplatesTable()
    } else {
      console.log('✅ Tabela templates existe')
      checkWidgetsTable()
    }
  })
}

function createTemplatesTable() {
  const templateTable = `
    CREATE TABLE templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      layout TEXT NOT NULL,
      is_default INTEGER DEFAULT 0,
      show_header INTEGER DEFAULT 1,
      show_footer INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  
  db.run(templateTable, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela templates:', err)
    } else {
      console.log('✅ Tabela templates criada com sucesso')
      insertDefaultTemplates()
    }
  })
}

function insertDefaultTemplates() {
  console.log('🔧 Inserindo templates padrão...')
  
  const templates = [
    {
      name: 'Layout Básico',
      description: 'Template simples com cabeçalho, conteúdo e rodapé',
      layout: JSON.stringify({
        sections: [
          { id: 'header', widgets: [] },
          { id: 'content', widgets: [] },
          { id: 'footer', widgets: [] }
        ]
      }),
      is_default: 1
    },
    {
      name: 'Layout com Banner',
      description: 'Template com banner principal e conteúdo lateral',
      layout: JSON.stringify({
        sections: [
          { id: 'banner', widgets: [] },
          { id: 'main', widgets: [] },
          { id: 'sidebar', widgets: [] }
        ]
      }),
      is_default: 0
    },
    {
      name: 'Layout Completo',
      description: 'Template com múltiplas seções flexíveis',
      layout: JSON.stringify({
        sections: [
          { id: 'header', widgets: [] },
          { id: 'hero', widgets: [] },
          { id: 'content', widgets: [] },
          { id: 'widgets', widgets: [] },
          { id: 'footer', widgets: [] }
        ]
      }),
      is_default: 0
    }
  ]
  
  let inserted = 0
  templates.forEach((template, index) => {
    const sql = `INSERT INTO templates (name, description, layout, is_default, show_header, show_footer) 
                 VALUES (?, ?, ?, ?, ?, ?)`
    
    db.run(sql, [template.name, template.description, template.layout, template.is_default, 1, 1], (err) => {
      if (err) {
        console.error(`❌ Erro ao inserir template ${template.name}:`, err)
      } else {
        console.log(`✅ Template "${template.name}" inserido`)
      }
      
      inserted++
      if (inserted === templates.length) {
        checkWidgetsTable()
      }
    })
  })
}

function checkWidgetsTable() {
  console.log('\n🔍 Verificando tabela widgets...')
  
  db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='widgets'", (err, rows) => {
    if (err) {
      console.error('❌ Erro ao verificar widgets:', err)
      return
    }
    
    if (rows.length === 0) {
      console.log('❌ Tabela widgets não existe. Criando...')
      createWidgetsTable()
    } else {
      console.log('✅ Tabela widgets existe')
      finalCheck()
    }
  })
}

function createWidgetsTable() {
  const widgetTable = `
    CREATE TABLE widgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      config TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  
  db.run(widgetTable, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela widgets:', err)
    } else {
      console.log('✅ Tabela widgets criada com sucesso')
      finalCheck()
    }
  })
}

function finalCheck() {
  console.log('\n🔍 Verificação final da estrutura...')
  
  db.all('PRAGMA table_info(pages)', (err, rows) => {
    if (!err) {
      console.log('\n📋 Estrutura final da tabela pages:')
      rows.forEach(row => {
        console.log(`  - ${row.name} (${row.type})`)
      })
    }
    
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (!err) {
        console.log('\n📋 Tabelas no banco de dados:')
        tables.forEach(table => {
          console.log(`  - ${table.name}`)
        })
      }
      
      console.log('\n🎉 Banco de dados verificado e corrigido!')
      console.log('✅ Agora você pode tentar criar/atualizar páginas do wiki novamente')
      
      db.close()
    })
  })
}
