import database from './database.js'

async function addSummaryFields() {
  try {
    await database.init()
    console.log('🔧 Adicionando campos summary...')
    
    // Adicionar campo summary na tabela posts
    await new Promise((resolve, reject) => {
      database.db.run(`
        ALTER TABLE posts ADD COLUMN summary TEXT DEFAULT '';
      `, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error('❌ Erro ao adicionar summary em posts:', err.message)
          reject(err)
        } else {
          console.log('✅ Campo summary adicionado em posts')
          resolve()
        }
      })
    })
    
    // Adicionar campo summary na tabela pages
    await new Promise((resolve, reject) => {
      database.db.run(`
        ALTER TABLE pages ADD COLUMN summary TEXT DEFAULT '';
      `, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error('❌ Erro ao adicionar summary em pages:', err.message)
          reject(err)
        } else {
          console.log('✅ Campo summary adicionado em pages')
          resolve()
        }
      })
    })
    
    // Verificar se os campos foram adicionados
    await new Promise((resolve, reject) => {
      database.db.all(`PRAGMA table_info(posts)`, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          console.log('📋 Estrutura da tabela posts:')
          rows.forEach(row => {
            console.log(`   - ${row.name} (${row.type})`)
          })
          resolve()
        }
      })
    })
    
    await new Promise((resolve, reject) => {
      database.db.all(`PRAGMA table_info(pages)`, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          console.log('📋 Estrutura da tabela pages:')
          rows.forEach(row => {
            console.log(`   - ${row.name} (${row.type})`)
          })
          resolve()
        }
      })
    })
    
    console.log('✅ Migração concluída com sucesso!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Erro na migração:', error.message)
    process.exit(1)
  }
}

addSummaryFields()
