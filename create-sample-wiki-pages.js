const Database = require('./server/database.js');

console.log('=== CRIANDO PÁGINAS DE TESTE ===');

// Criar páginas wiki de exemplo
const samplePages = [
    {
        title: 'História da Igreja',
        content: 'História da igreja cristã primitiva...',
        type: 'wiki',
        status: 'published',
        category_id: 1,
        author_id: 1
    },
    {
        title: 'Doutrina Bíblica',
        content: 'Fundamentos da doutrina cristã...',
        type: 'wiki',
        status: 'published',
        category_id: 2,
        author_id: 1
    },
    {
        title: 'Teologia Sistemática',
        content: 'Estudo sistemático da teologia...',
        type: 'wiki',
        status: 'published',
        category_id: 3,
        author_id: 1
    }
];

let createdCount = 0;

samplePages.forEach((page, index) => {
    const stmt = Database.prepare(`
        INSERT INTO pages (title, content, type, status, category_id, author_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    stmt.run(
        page.title,
        page.content,
        page.type,
        page.status,
        page.category_id,
        page.author_id,
        (err) => {
            if (err) {
                console.error(`Erro ao criar página ${page.title}:`, err);
            } else {
                console.log(`✅ Página criada: ${page.title}`);
                createdCount++;
            }
            
            if (index === samplePages.length - 1) {
                console.log(`\n=== CRIADAS ${createdCount} PÁGINAS ===`);
                
                // Verificar resultado
                Database.all("SELECT COUNT(*) as total FROM pages WHERE type = 'wiki' AND status = 'published'", (err, result) => {
                    if (err) {
                        console.error('Erro ao contar páginas:', err);
                    } else {
                        console.log(`Total de páginas wiki publicadas: ${result[0].total}`);
                    }
                    process.exit(0);
                });
            }
        }
    );
    
    stmt.finalize();
});

console.log('Aguardando criação das páginas...');
