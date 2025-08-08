import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

sqlite3.verbose()

const dbPath = path.join(__dirname, 'smyrna.db')
const db = new sqlite3.Database(dbPath)

console.log('🔍 Verificando estrutura da tabela pages...')

// Primeiro, vamos ver a estrutura atual
db.all('PRAGMA table_info(pages)', (err, rows) => {
  if (err) {
    console.error('Erro ao verificar estrutura:', err)
    return
  }
  
  console.log('\n📋 Colunas atuais da tabela pages:')
  const currentColumns = rows.map(row => row.name)
  rows.forEach(row => {
    console.log(`  - ${row.name} (${row.type})`)
  })
  
  // Verificar quais colunas estão faltando
  const requiredColumns = ['template_id', 'widget_data', 'slug', 'is_home']
  const missingColumns = requiredColumns.filter(col => !currentColumns.includes(col))
  
  if (missingColumns.length > 0) {
    console.log('\n❌ Colunas faltando:', missingColumns)
    console.log('🔧 Adicionando colunas faltantes...')
    
    addMissingColumns(missingColumns)
  } else {
    console.log('\n✅ Todas as colunas necessárias estão presentes!')
    db.close()
  }
})

function addMissingColumns(missingColumns) {
  const alterCommands = []
  
  if (missingColumns.includes('template_id')) {
    alterCommands.push('ALTER TABLE pages ADD COLUMN template_id INTEGER DEFAULT 1')
  }
  
  if (missingColumns.includes('widget_data')) {
    alterCommands.push('ALTER TABLE pages ADD COLUMN widget_data JSON')
  }
  
  if (missingColumns.includes('slug')) {
    alterCommands.push('ALTER TABLE pages ADD COLUMN slug TEXT UNIQUE')
  }
  
  if (missingColumns.includes('is_home')) {
    alterCommands.push('ALTER TABLE pages ADD COLUMN is_home BOOLEAN DEFAULT false')
  }
  
  // Executar comandos ALTER TABLE
  let completed = 0
  alterCommands.forEach((command, index) => {
    db.run(command, (err) => {
      if (err) {
        console.error(`❌ Erro ao executar: ${command}`, err)
      } else {
        console.log(`✅ Executado: ${command}`)
      }
      
      completed++
      if (completed === alterCommands.length) {
        console.log('\n🎉 Banco de dados atualizado com sucesso!')
        
        // Verificar novamente
        db.all('PRAGMA table_info(pages)', (err, rows) => {
          if (!err) {
            console.log('\n📋 Nova estrutura da tabela pages:')
            rows.forEach(row => {
              console.log(`  - ${row.name} (${row.type})`)
            })
          }
          db.close()
        })
      }
    })
  })
}
