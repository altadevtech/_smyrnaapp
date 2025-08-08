import Database from './server/database.js'

// Inicializar banco
Database.init()

const db = Database.getDb()

console.log('=== VERIFICAÇÃO DO BANCO DE DADOS ===\n')

// Verificar todas as páginas
db.all(`SELECT id, title, slug, is_home, status, created_at FROM pages ORDER BY id`, (err, pages) => {
  if (err) {
    console.error('Erro ao buscar páginas:', err)
    return
  }
  
  console.log('📄 TODAS AS PÁGINAS:')
  pages.forEach(page => {
    console.log(`ID: ${page.id} | Título: "${page.title}" | Slug: "${page.slug}" | Home: ${page.is_home} | Status: ${page.status}`)
  })
  
  console.log('\n📄 PÁGINAS PÚBLICAS (não home):')
  
  // Verificar consulta específica das páginas públicas
  db.all(`SELECT id, title, slug, is_home, status FROM pages WHERE status = 'published' AND (is_home IS NULL OR is_home = false)`, (err, publicPages) => {
    if (err) {
      console.error('Erro ao buscar páginas públicas:', err)
      return
    }
    
    publicPages.forEach(page => {
      console.log(`ID: ${page.id} | Título: "${page.title}" | Slug: "${page.slug}" | Home: ${page.is_home}`)
    })
    
    console.log('\n📄 PÁGINA HOME:')
    
    // Verificar página home
    db.get(`SELECT id, title, slug, is_home, status FROM pages WHERE is_home = true AND status = 'published'`, (err, homePage) => {
      if (err) {
        console.error('Erro ao buscar página home:', err)
        return
      }
      
      if (homePage) {
        console.log(`ID: ${homePage.id} | Título: "${homePage.title}" | Slug: "${homePage.slug}" | Home: ${homePage.is_home}`)
      } else {
        console.log('Nenhuma página home definida')
      }
      
      process.exit(0)
    })
  })
})
