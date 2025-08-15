import Database from './database.js'

const migratePostsAddSlug = () => {
  const db = Database.getDb()

  console.log('🔄 Iniciando migração: adicionando coluna slug aos posts...')

  // Primeiro, verificar se a coluna slug já existe
  db.all("PRAGMA table_info(posts)", [], (err, columns) => {
    if (err) {
      console.error('❌ Erro ao verificar estrutura da tabela posts:', err)
      return
    }

    const hasSlugColumn = columns.some(col => col.name === 'slug')
    
    if (hasSlugColumn) {
      console.log('✅ Coluna slug já existe na tabela posts')
      process.exit(0)
      return
    }

    console.log('📊 Estrutura atual da tabela posts:')
    columns.forEach(col => {
      console.log(`  - ${col.name}: ${col.type}`)
    })

    // Adicionar a coluna slug
    db.run('ALTER TABLE posts ADD COLUMN slug TEXT', (err) => {
      if (err) {
        console.error('❌ Erro ao adicionar coluna slug:', err)
        return
      }

      console.log('✅ Coluna slug adicionada com sucesso!')
      
      // Agora buscar todos os posts e gerar slugs para eles
      db.all('SELECT id, title FROM posts', [], (err, posts) => {
        if (err) {
          console.error('❌ Erro ao buscar posts:', err)
          return
        }

        console.log(`📝 Encontrados ${posts.length} posts para atualizar slugs`)

        const generateSlug = (title, id) => {
          return title.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-') + '-' + id
        }

        let updatedCount = 0
        
        posts.forEach(post => {
          const slug = generateSlug(post.title, post.id)
          
          db.run('UPDATE posts SET slug = ? WHERE id = ?', [slug, post.id], (err) => {
            if (err) {
              console.error(`❌ Erro ao atualizar slug para post ${post.id}:`, err)
              return
            }
            
            updatedCount++
            console.log(`✅ Post "${post.title}" atualizado com slug: ${slug}`)
            
            if (updatedCount === posts.length) {
              console.log(`🎉 Migração concluída! ${updatedCount} posts atualizados com slugs`)
              process.exit(0)
            }
          })
        })

        if (posts.length === 0) {
          console.log('ℹ️ Nenhum post encontrado para atualizar')
          process.exit(0)
        }
      })
    })
  })
}

// Conectar ao banco e executar migração
Database.init()
setTimeout(migratePostsAddSlug, 1000) // Aguardar a inicialização do banco
