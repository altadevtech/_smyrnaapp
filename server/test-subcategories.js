import Database from './database.js'

async function testSubcategories() {
  console.log('🧪 Testando funcionalidades de subcategorias...')
  
  try {
    await Database.init()
    const db = Database.getDb()
    
    // Verificar se a coluna parent_id existe
    const tableInfo = await new Promise((resolve, reject) => {
      db.all("PRAGMA table_info(categories)", (err, columns) => {
        if (err) reject(err)
        else resolve(columns)
      })
    })
    
    const hasParentId = tableInfo.some(col => col.name === 'parent_id')
    console.log('✅ Coluna parent_id existe:', hasParentId)
    
    // Buscar categorias wiki para testar estrutura hierárquica
    const categories = await new Promise((resolve, reject) => {
      db.all(
        `SELECT c.*, p.name as parent_name 
         FROM categories c 
         LEFT JOIN categories p ON c.parent_id = p.id 
         WHERE c.type = 'wiki' 
         ORDER BY c.parent_id, c.name`,
        (err, cats) => {
          if (err) reject(err)
          else resolve(cats)
        }
      )
    })
    
    console.log('\n📚 Categorias Wiki existentes:')
    categories.forEach(cat => {
      if (cat.parent_name) {
        console.log(`  ↳ ${cat.name} (subcategoria de ${cat.parent_name})`)
      } else {
        console.log(`  📁 ${cat.name} (categoria principal)`)
      }
    })
    
    // Testar API hierárquica
    console.log('\n🔍 Testando busca hierárquica...')
    
    // Simular chamada para buscar estrutura hierárquica
    const hierarchicalCategories = await new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, p.name as parent_name, p.slug as parent_slug, p.color as parent_color
        FROM categories c
        LEFT JOIN categories p ON c.parent_id = p.id
        WHERE c.type = 'wiki'
        ORDER BY c.parent_id, c.name
      `
      
      db.all(query, (err, cats) => {
        if (err) {
          reject(err)
        } else {
          // Organizar em estrutura de árvore
          const categoriesMap = new Map()
          const rootCategories = []
          
          // Primeiro, criar mapa de todas as categorias
          cats.forEach(cat => {
            categoriesMap.set(cat.id, { ...cat, subcategories: [] })
          })
          
          // Depois, organizar hierarquia
          cats.forEach(cat => {
            if (cat.parent_id) {
              const parent = categoriesMap.get(cat.parent_id)
              if (parent) {
                parent.subcategories.push(categoriesMap.get(cat.id))
              }
            } else {
              rootCategories.push(categoriesMap.get(cat.id))
            }
          })
          
          resolve(rootCategories)
        }
      })
    })
    
    console.log('✅ Estrutura hierárquica criada com sucesso!')
    console.log('📊 Categorias principais encontradas:', hierarchicalCategories.length)
    
    hierarchicalCategories.forEach(cat => {
      console.log(`\n📁 ${cat.name}`)
      if (cat.subcategories && cat.subcategories.length > 0) {
        cat.subcategories.forEach(sub => {
          console.log(`  ↳ ${sub.name}`)
        })
      } else {
        console.log('  (sem subcategorias)')
      }
    })
    
    console.log('\n🎉 Teste de subcategorias concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

testSubcategories()
