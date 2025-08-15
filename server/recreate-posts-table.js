import Database from './database.js'
import fs from 'fs'
import path from 'path'

const recreatePostsTable = async () => {
  console.log('🔄 Iniciando recriação da tabela posts com coluna slug...')

  const db = Database.getDb()

  try {
    // 1. Primeiro, backup dos dados existentes
    console.log('📊 Fazendo backup dos dados de posts...')
    const posts = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM posts', [], (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })

    console.log(`✅ ${posts.length} posts encontrados para backup`)

    // 2. Verificar estrutura atual
    const columns = await new Promise((resolve, reject) => {
      db.all("PRAGMA table_info(posts)", [], (err, cols) => {
        if (err) reject(err)
        else resolve(cols)
      })
    })

    const hasSlugColumn = columns.some(col => col.name === 'slug')
    console.log(`📊 Estrutura atual tem coluna slug: ${hasSlugColumn}`)

    if (hasSlugColumn) {
      console.log('✅ Tabela já tem coluna slug. Verificando se há algum problema...')
      
      // Testar uma consulta que estava falhando
      try {
        const testQuery = await new Promise((resolve, reject) => {
          db.all('SELECT p.id, p.title, p.slug, p.created_at FROM posts p LIMIT 1', [], (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
          })
        })
        console.log('✅ Consulta com slug funcionando corretamente!')
        console.log('🎉 Tabela posts está funcionando. Problema pode estar no cache do servidor.')
        process.exit(0)
      } catch (testErr) {
        console.log('❌ Erro na consulta com slug:', testErr.message)
        console.log('🔧 Forçando recriação da tabela...')
      }
    }

    // 3. Dropar e recriar tabela
    console.log('🗑️  Removendo tabela posts antiga...')
    await new Promise((resolve, reject) => {
      db.run('DROP TABLE IF EXISTS posts', (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    // 4. Criar nova tabela com slug
    console.log('🔧 Criando nova tabela posts com slug...')
    const createTableSQL = `
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT,
        content TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        author_id INTEGER NOT NULL,
        category_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users (id),
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )
    `

    await new Promise((resolve, reject) => {
      db.run(createTableSQL, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    console.log('✅ Nova tabela posts criada!')

    // 5. Restaurar dados
    console.log('📥 Restaurando dados dos posts...')
    const generateSlug = (title, id) => {
      return title.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-') + '-' + id
    }

    for (const post of posts) {
      const slug = post.slug || generateSlug(post.title, post.id)
      
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO posts (id, title, slug, content, status, author_id, category_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [post.id, post.title, slug, post.content, post.status, post.author_id, post.category_id, post.created_at, post.updated_at],
          (err) => {
            if (err) reject(err)
            else resolve()
          }
        )
      })
      
      console.log(`✅ Post "${post.title}" restaurado com slug: ${slug}`)
    }

    console.log('🎉 Recriação da tabela posts concluída com sucesso!')
    
    // 6. Verificar resultado final
    const finalPosts = await new Promise((resolve, reject) => {
      db.all('SELECT id, title, slug FROM posts', [], (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })

    console.log(`📊 Posts finais: ${finalPosts.length}`)
    finalPosts.forEach(post => {
      console.log(`  - ID: ${post.id}, Título: "${post.title}", Slug: "${post.slug}"`)
    })

    process.exit(0)

  } catch (error) {
    console.error('❌ Erro durante recriação:', error)
    process.exit(1)
  }
}

// Conectar ao banco e executar
Database.init()
setTimeout(recreatePostsTable, 1000)
