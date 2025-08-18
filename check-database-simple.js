const Database = require('./server/database.js');

console.log('=== VERIFICANDO BANCO DE DADOS ===');

// Verificar páginas
Database.all("SELECT id, title, status, category_id FROM pages WHERE type = 'wiki'", (err, pages) => {
    if (err) {
        console.error('Erro ao buscar páginas:', err);
    } else {
        console.log(`\nPáginas Wiki encontradas: ${pages.length}`);
        pages.forEach(page => {
            console.log(`- ID: ${page.id}, Título: ${page.title}, Status: ${page.status}, Categoria: ${page.category_id}`);
        });
    }
    
    // Verificar categorias
    Database.all("SELECT id, name FROM categories", (err, categories) => {
        if (err) {
            console.error('Erro ao buscar categorias:', err);
        } else {
            console.log(`\nCategorias encontradas: ${categories.length}`);
            categories.forEach(cat => {
                console.log(`- ID: ${cat.id}, Nome: ${cat.name}`);
            });
        }
        
        console.log('\n=== FIM VERIFICAÇÃO ===');
        process.exit(0);
    });
});
