import Database from './database.js'

const checkDatabase = () => {
  const db = Database.getDb()

  console.log('🔍 Verificando estrutura da tabela posts...')
  
  db.all("PRAGMA table_info(posts)", [], (err, columns) => {
    if (err) {
      console.error('❌ Erro ao verificar estrutura:', err)
      process.exit(1)
    }

    console.log('📊 Colunas da tabela posts:')
    columns.forEach(col => {
      console.log(`  - ${col.name}: ${col.type} (nullable: ${col.notnull ? 'NO' : 'YES'})`)
    })

    const hasSlugColumn = columns.some(col => col.name === 'slug')
    console.log(`\n✅ Coluna slug existe: ${hasSlugColumn}`)

    if (hasSlugColumn) {
      db.all('SELECT id, title, slug FROM posts LIMIT 5', [], (err, posts) => {
        if (err) {
          console.error('❌ Erro ao buscar posts:', err)
        } else {
          console.log(`\n📝 Posts encontrados: ${posts.length}`)
          posts.forEach(post => {
            console.log(`  - ID: ${post.id}, Título: "${post.title}", Slug: "${post.slug}"`)
          })
        }
        process.exit(0)
      })
    } else {
      console.log('❌ Coluna slug não existe na tabela posts')
      process.exit(1)
    }
  })
}

// Conectar ao banco e executar verificação
Database.init()
setTimeout(checkDatabase, 1000)
