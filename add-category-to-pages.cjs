const sqlite3 = require('sqlite3').verbose()
const path = require('path')

console.log('🔧 Adicionando campo category_id à tabela pages...')

const dbPath = path.join(__dirname, 'server', 'smyrna.db')
const db = new sqlite3.Database(dbPath)

// Adicionar campo category_id
db.run('ALTER TABLE pages ADD COLUMN category_id INTEGER REFERENCES categories(id)', (err) => {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('ℹ️ Campo category_id já existe na tabela pages')
    } else {
      console.error('❌ Erro ao adicionar campo category_id:', err)
      db.close()
      process.exit(1)
    }
  } else {
    console.log('✅ Campo category_id adicionado com sucesso!')
  }
  
  // Verificar novamente a estrutura
  db.all('PRAGMA table_info(pages)', (err, columns) => {
    if (err) {
      console.error('❌ Erro:', err)
      db.close()
      process.exit(1)
    }
    
    console.log('\n📋 Nova estrutura da tabela pages:')
    console.table(columns.map(col => ({ 
      name: col.name, 
      type: col.type, 
      notnull: col.notnull ? 'NOT NULL' : 'NULL' 
    })))
    
    db.close()
    console.log('\n✅ Atualização concluída!')
    process.exit(0)
  })
})
