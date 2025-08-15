import Database from './database.js'

async function migrateFeaturedImage() {
  try {
    console.log('🔧 Executando migração para featured_image...')
    
    await Database.init()
    const db = Database.getDb()
    
    return new Promise((resolve, reject) => {
      // Adicionar o campo featured_image
      db.run(
        'ALTER TABLE posts ADD COLUMN featured_image TEXT',
        (err) => {
          if (err) {
            if (err.message.includes('duplicate column name')) {
              console.log('✅ Campo featured_image já existe')
            } else {
              console.error('❌ Erro ao adicionar campo:', err.message)
              reject(err)
              return
            }
          } else {
            console.log('✅ Campo featured_image adicionado com sucesso!')
          }
          
          // Verificar a estrutura após a alteração
          db.all("PRAGMA table_info(posts)", (err, columns) => {
            if (err) {
              console.error('❌ Erro ao verificar tabela:', err)
              reject(err)
            } else {
              console.log('📋 Nova estrutura da tabela posts:')
              columns.forEach(col => {
                console.log(`  - ${col.name}: ${col.type}`)
              })
              resolve()
            }
          })
        }
      )
    })
  } catch (error) {
    console.error('❌ Erro durante migração:', error)
    throw error
  }
}

migrateFeaturedImage()
  .then(() => {
    console.log('🎉 Migração concluída!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Falha na migração:', error)
    process.exit(1)
  })
