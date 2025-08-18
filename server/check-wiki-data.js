const Database = require('./database.js');

console.log('🔍 Verificando páginas publicadas...');

const db = Database.getDb();

// Verificar páginas publicadas
db.all(`
  SELECT p.id, p.title, p.status, c.name as category_name 
  FROM pages p 
  LEFT JOIN categories c ON p.category_id = c.id 
  WHERE p.status = 'published'
`, (err, pages) => {
  if (err) {
    console.error('Erro:', err);
  } else {
    console.log('📄 Páginas publicadas encontradas:', pages.length);
    pages.forEach(page => {
      console.log(`  - ${page.title} (Categoria: ${page.category_name || 'Sem categoria'})`);
    });
  }
  
  // Verificar categorias com páginas
  db.all(`
    SELECT 
      c.id, c.name, c.type, 
      COUNT(p.id) as page_count
    FROM categories c
    LEFT JOIN pages p ON c.id = p.category_id AND p.status = 'published'
    WHERE c.type = 'wiki'
    GROUP BY c.id, c.name, c.type
    HAVING COUNT(p.id) > 0
    ORDER BY c.name
  `, (err, categories) => {
    if (err) {
      console.error('Erro:', err);
    } else {
      console.log('\n🏷️ Categorias Wiki com páginas:', categories.length);
      categories.forEach(cat => {
        console.log(`  - ${cat.name}: ${cat.page_count} página(s)`);
      });
    }
    process.exit();
  });
});
