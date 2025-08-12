const sqlite3 = require('sqlite3').verbose()
const path = require('path')

console.log('🔍 Verificando páginas no banco de dados...')

const dbPath = path.join(__dirname, 'server', 'smyrna.db')
const db = new sqlite3.Database(dbPath)

db.all('SELECT id, title, status, is_home FROM pages ORDER BY id', (err, rows) => {
  if (err) {
    console.error('❌ Erro:', err)
    process.exit(1)
  }
  
  console.log('\n📄 Todas as páginas no banco:')
  console.table(rows)
  
  const publicadas = rows.filter(row => row.status === 'published')
  const rascunhos = rows.filter(row => row.status === 'draft')
  
  console.log(`\n📊 Resumo:`)
  console.log(`   📗 Total de páginas: ${rows.length}`)
  console.log(`   ✅ Publicadas: ${publicadas.length}`)
  console.log(`   📝 Rascunhos: ${rascunhos.length}`)
  
  console.log('\n🔍 Páginas publicadas (visíveis no frontend):')
  publicadas.forEach(page => {
    console.log(`   - ${page.title} (ID: ${page.id}, Home: ${page.is_home ? 'Sim' : 'Não'})`)
  })
  
  if (rascunhos.length > 0) {
    console.log('\n📝 Páginas em rascunho (não visíveis no frontend):')
    rascunhos.forEach(page => {
      console.log(`   - ${page.title} (ID: ${page.id})`)
    })
  }
  
  db.close()
  process.exit(0)
})
