import Database from './database.js'

async function addFeaturedImageField() {
  try {
    console.log('🔧 Iniciando adição do campo featured_image...')
    
    await Database.init()
    const db = Database.getDb()
    
    return new Promise((resolve, reject) => {
      // Verificar se a coluna já existe
      db.get("PRAGMA table_info(posts)", (err, result) => {
        if (err) {
          console.error('❌ Erro ao verificar estrutura da tabela:', err)
          reject(err)
          return
        }
        
        // Adicionar a coluna featured_image se não existir
        db.run(
          'ALTER TABLE posts ADD COLUMN featured_image TEXT',
          (err) => {
            if (err) {
              if (err.message.includes('duplicate column name')) {
                console.log('✅ Campo featured_image já existe na tabela posts')
                resolve()
              } else {
                console.error('❌ Erro ao adicionar campo featured_image:', err)
                reject(err)
              }
            } else {
              console.log('✅ Campo featured_image adicionado com sucesso à tabela posts')
              resolve()
            }
          }
        )
      })
    })
  } catch (error) {
    console.error('❌ Erro durante execução:', error)
    throw error
  }
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  addFeaturedImageField()
    .then(() => {
      console.log('🎉 Migração concluída com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Falha na migração:', error)
      process.exit(1)
    })
}

export default addFeaturedImageField
