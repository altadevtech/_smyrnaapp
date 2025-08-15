import Database from './database.js'

async function migrateSubcategories() {
  console.log('🔄 Iniciando migração para suporte a subcategorias...')
  
  try {
    await Database.init()
    const db = Database.getDb()
    
    // Verificar se a coluna parent_id já existe
    const tableInfo = await new Promise((resolve, reject) => {
      db.all("PRAGMA table_info(categories)", (err, columns) => {
        if (err) reject(err)
        else resolve(columns)
      })
    })
    
    const hasParentId = tableInfo.some(col => col.name === 'parent_id')
    
    if (!hasParentId) {
      // Adicionar coluna parent_id
      await new Promise((resolve, reject) => {
        db.run(`ALTER TABLE categories ADD COLUMN parent_id INTEGER DEFAULT NULL`, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
      
      console.log('✅ Coluna parent_id adicionada com sucesso!')
    } else {
      console.log('✅ Coluna parent_id já existe na tabela categories')
    }
    
    // Limpar qualquer tabela temporária que possa existir
    await new Promise((resolve, reject) => {
      db.run(`DROP TABLE IF EXISTS categories_new`, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
    
    console.log('🎉 Migração concluída com sucesso!')
    console.log('✅ Tabela categories pronta para suportar subcategorias')
    
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

migrateSubcategories()
