// Script para migrar a tabela categories para incluir colunas type
import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, 'server', 'smyrna.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar com o banco:', err.message)
    process.exit(1)
  }
  console.log('✅ Conectado ao banco de dados SQLite')
})

// Verificar se a coluna 'type' existe
db.all("PRAGMA table_info(categories)", (err, columns) => {
  if (err) {
    console.error('❌ Erro ao verificar estrutura da tabela:', err)
    process.exit(1)
  }

  const hasTypeColumn = columns.some(col => col.name === 'type')
  
  if (hasTypeColumn) {
    console.log('✅ Coluna "type" já existe na tabela categories')
    db.close()
    return
  }

  console.log('🔧 Adicionando coluna "type" à tabela categories...')
  
  // Adicionar coluna type
  db.run("ALTER TABLE categories ADD COLUMN type TEXT DEFAULT 'blog'", (err) => {
    if (err) {
      console.error('❌ Erro ao adicionar coluna type:', err)
      process.exit(1)
    }
    
    console.log('✅ Coluna "type" adicionada com sucesso')
    
    // Atualizar constraints (criar nova tabela com constraints corretos)
    console.log('🔧 Atualizando constraints da tabela...')
    
    // Criar nova tabela com constraints corretos
    const createNewTable = `
      CREATE TABLE categories_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL DEFAULT 'blog',
        color TEXT DEFAULT '#3b82f6',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name, type),
        UNIQUE(slug, type)
      )
    `
    
    db.run(createNewTable, (err) => {
      if (err) {
        console.error('❌ Erro ao criar nova tabela:', err)
        process.exit(1)
      }
      
      // Copiar dados da tabela antiga
      db.run("INSERT INTO categories_new (id, name, slug, description, color, created_at, updated_at, type) SELECT id, name, slug, description, color, created_at, updated_at, 'blog' FROM categories", (err) => {
        if (err) {
          console.error('❌ Erro ao copiar dados:', err)
          process.exit(1)
        }
        
        // Remover tabela antiga
        db.run("DROP TABLE categories", (err) => {
          if (err) {
            console.error('❌ Erro ao remover tabela antiga:', err)
            process.exit(1)
          }
          
          // Renomear nova tabela
          db.run("ALTER TABLE categories_new RENAME TO categories", (err) => {
            if (err) {
              console.error('❌ Erro ao renomear tabela:', err)
              process.exit(1)
            }
            
            console.log('✅ Migração concluída com sucesso!')
            
            // Adicionar categorias padrão de wiki
            console.log('➕ Adicionando categorias padrão para Wiki...')
            
            const wikiCategories = [
              {
                name: 'Documentação',
                slug: 'documentacao',
                description: 'Documentação técnica e procedimentos',
                color: '#8b5cf6',
                type: 'wiki'
              },
              {
                name: 'Tutoriais',
                slug: 'tutoriais',
                description: 'Guias e tutoriais passo a passo',
                color: '#ef4444',
                type: 'wiki'
              },
              {
                name: 'FAQ',
                slug: 'faq',
                description: 'Perguntas frequentes e respostas',
                color: '#f97316',
                type: 'wiki'
              },
              {
                name: 'Conhecimento Geral',
                slug: 'conhecimento-geral',
                description: 'Conhecimento geral e informações úteis',
                color: '#22c55e',
                type: 'wiki'
              }
            ]
            
            let completed = 0
            wikiCategories.forEach((category) => {
              db.run(
                'INSERT INTO categories (name, slug, description, color, type) VALUES (?, ?, ?, ?, ?)',
                [category.name, category.slug, category.description, category.color, category.type],
                function(err) {
                  if (err) {
                    console.error(`❌ Erro ao criar categoria ${category.name}:`, err)
                  } else {
                    console.log(`✅ Categoria "${category.name}" (${category.type}) criada`)
                  }
                  
                  completed++
                  if (completed === wikiCategories.length) {
                    console.log('🎉 Migração completa! Categorias de Wiki adicionadas.')
                    db.close()
                  }
                }
              )
            })
          })
        })
      })
    })
  })
})
