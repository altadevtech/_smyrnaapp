const sqlite3 = require('sqlite3').verbose()
const path = require('path')

console.log('🔍 Verificando estrutura da tabela pages...')

const dbPath = path.join(__dirname, 'server', 'smyrna.db')
const db = new sqlite3.Database(dbPath)

db.all('PRAGMA table_info(pages)', (err, columns) => {
  if (err) {
    console.error('❌ Erro:', err)
    process.exit(1)
  }
  
  console.log('\n📋 Estrutura da tabela pages:')
  console.table(columns)
  
  const hasCategoryId = columns.some(col => col.name === 'category_id')
  console.log(`\n🏷️ Campo category_id: ${hasCategoryId ? '✅ Existe' : '❌ Não existe'}`)
  
  if (!hasCategoryId) {
    console.log('\n➕ Será necessário adicionar o campo category_id')
  }
  
  db.close()
  process.exit(0)
})
