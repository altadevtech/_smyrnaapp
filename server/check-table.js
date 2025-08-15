import Database from './database.js'

async function checkPostsTable() {
  try {
    await Database.init()
    const db = Database.getDb()
    
    return new Promise((resolve, reject) => {
      db.all("PRAGMA table_info(posts)", (err, columns) => {
        if (err) {
          console.error('❌ Erro:', err)
          reject(err)
        } else {
          console.log('📋 Estrutura da tabela posts:')
          columns.forEach(col => {
            console.log(`  - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`)
          })
          resolve()
        }
      })
    })
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

checkPostsTable()
