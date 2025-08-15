import Database from './database.js'

async function createExampleSubcategories() {
  console.log('📝 Criando subcategorias de exemplo...')
  
  try {
    await Database.init()
    const db = Database.getDb()
    
    // Buscar categoria SALESFORCE
    const salesforceCategory = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE name = ? AND type = ?', ['SALESFORCE', 'wiki'], (err, cat) => {
        if (err) reject(err)
        else resolve(cat)
      })
    })
    
    if (!salesforceCategory) {
      console.log('❌ Categoria SALESFORCE não encontrada')
      return
    }
    
    console.log('✅ Categoria SALESFORCE encontrada:', salesforceCategory.name)
    
    // Criar subcategorias para SALESFORCE
    const subcategories = [
      {
        name: 'OBJETOS',
        slug: 'objetos',
        description: 'Objetos personalizados e padrão do Salesforce',
        color: '#00a1e0'
      },
      {
        name: 'APEX',
        slug: 'apex',
        description: 'Desenvolvimento em Apex',
        color: '#1589ee'
      },
      {
        name: 'FLOWS',
        slug: 'flows',
        description: 'Automação com Flows',
        color: '#0176d3'
      },
      {
        name: 'LIGHTNING',
        slug: 'lightning',
        description: 'Lightning Components e Lightning Web Components',
        color: '#032e61'
      }
    ]
    
    for (const sub of subcategories) {
      // Verificar se já existe
      const existing = await new Promise((resolve, reject) => {
        db.get(
          'SELECT id FROM categories WHERE slug = ? AND type = ? AND parent_id = ?',
          [sub.slug, 'wiki', salesforceCategory.id],
          (err, cat) => {
            if (err) reject(err)
            else resolve(cat)
          }
        )
      })
      
      if (existing) {
        console.log(`⚠️  Subcategoria ${sub.name} já existe`)
        continue
      }
      
      // Criar subcategoria
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO categories (name, slug, description, color, type, parent_id) VALUES (?, ?, ?, ?, ?, ?)',
          [sub.name, sub.slug, sub.description, sub.color, 'wiki', salesforceCategory.id],
          function(err) {
            if (err) reject(err)
            else {
              console.log(`✅ Subcategoria ${sub.name} criada com ID ${this.lastID}`)
              resolve()
            }
          }
        )
      })
    }
    
    // Criar subcategorias para APP
    const appCategory = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE name = ? AND type = ?', ['APP', 'wiki'], (err, cat) => {
        if (err) reject(err)
        else resolve(cat)
      })
    })
    
    if (appCategory) {
      const appSubcategories = [
        {
          name: 'MOBILE',
          slug: 'mobile',
          description: 'Desenvolvimento mobile',
          color: '#34d399'
        },
        {
          name: 'WEB',
          slug: 'web',
          description: 'Desenvolvimento web',
          color: '#60a5fa'
        }
      ]
      
      for (const sub of appSubcategories) {
        const existing = await new Promise((resolve, reject) => {
          db.get(
            'SELECT id FROM categories WHERE slug = ? AND type = ? AND parent_id = ?',
            [sub.slug, 'wiki', appCategory.id],
            (err, cat) => {
              if (err) reject(err)
              else resolve(cat)
            }
          )
        })
        
        if (existing) {
          console.log(`⚠️  Subcategoria ${sub.name} já existe`)
          continue
        }
        
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO categories (name, slug, description, color, type, parent_id) VALUES (?, ?, ?, ?, ?, ?)',
            [sub.name, sub.slug, sub.description, sub.color, 'wiki', appCategory.id],
            function(err) {
              if (err) reject(err)
              else {
                console.log(`✅ Subcategoria ${sub.name} criada com ID ${this.lastID}`)
                resolve()
              }
            }
          )
        })
      }
    }
    
    console.log('\n🎉 Subcategorias de exemplo criadas com sucesso!')
    
    // Verificar resultado final
    const allCategories = await new Promise((resolve, reject) => {
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
    
    console.log('\n📚 Estrutura final das categorias Wiki:')
    const mainCategories = allCategories.filter(cat => !cat.parent_id)
    const subCategories = allCategories.filter(cat => cat.parent_id)
    
    mainCategories.forEach(main => {
      console.log(`📁 ${main.name}`)
      const subs = subCategories.filter(sub => sub.parent_id === main.id)
      subs.forEach(sub => {
        console.log(`  ↳ ${sub.name}`)
      })
      if (subs.length === 0) {
        console.log('  (sem subcategorias)')
      }
    })
    
  } catch (error) {
    console.error('❌ Erro ao criar subcategorias:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

createExampleSubcategories()
