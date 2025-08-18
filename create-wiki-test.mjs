import Database from './server/database.js';

console.log('=== CRIANDO PÁGINAS DE TESTE ===');

async function createSamplePages() {
    try {
        await Database.init();
        console.log('✅ Database conectado');
        
        const db = Database.getDb();
        
        // Primeiro verificar se já existem páginas
        db.all("SELECT COUNT(*) as total FROM pages WHERE type = 'wiki' AND status = 'published'", (err, result) => {
            if (err) {
                console.error('Erro ao contar páginas:', err);
                return;
            }
            
            console.log(`Páginas wiki existentes: ${result[0].total}`);
            
            if (result[0].total > 0) {
                console.log('❗ Já existem páginas wiki. Não criando duplicatas.');
                return testEndpoint();
            }
            
            // Criar páginas de teste
            const insertQuery = `
                INSERT INTO pages (title, content, type, status, category_id, author_id, created_at, updated_at)
                VALUES (?, ?, 'wiki', 'published', ?, 1, datetime('now'), datetime('now'))
            `;
            
            const pages = [
                ['História da Igreja', 'História da igreja cristã primitiva...', 1],
                ['Doutrina Bíblica', 'Fundamentos da doutrina cristã...', 2], 
                ['Teologia Sistemática', 'Estudo sistemático da teologia...', 3]
            ];
            
            let completed = 0;
            pages.forEach(([title, content, categoryId]) => {
                db.run(insertQuery, [title, content, categoryId], function(err) {
                    if (err) {
                        console.error(`❌ Erro ao criar ${title}:`, err);
                    } else {
                        console.log(`✅ Página criada: ${title} (ID: ${this.lastID})`);
                    }
                    
                    completed++;
                    if (completed === pages.length) {
                        console.log(`\n=== ${completed} PÁGINAS CRIADAS ===`);
                        testEndpoint();
                    }
                });
            });
        });
        
    } catch (error) {
        console.error('Erro ao inicializar:', error);
    }
}

function testEndpoint() {
    console.log('\n=== TESTANDO ENDPOINT ===');
    console.log('Acesse: http://localhost:9000/api/categories/stats/with-pages?type=wiki');
    console.log('Para ver apenas categorias com páginas associadas');
    process.exit(0);
}

createSamplePages();
