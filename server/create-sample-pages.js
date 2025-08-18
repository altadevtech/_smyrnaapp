const Database = require('./database.js');

console.log('🔍 Verificando estrutura do banco...');

const db = Database.getDb();

// Verificar categorias Wiki
db.all("SELECT * FROM categories WHERE type = 'wiki' ORDER BY name", (err, categories) => {
  if (err) {
    console.error('Erro ao buscar categorias:', err);
    return;
  }
  
  console.log(`\n🏷️ Categorias Wiki encontradas: ${categories.length}`);
  categories.forEach(cat => {
    console.log(`  - ID: ${cat.id}, Nome: ${cat.name}, Slug: ${cat.slug}, Parent: ${cat.parent_id || 'null'}`);
  });

  // Criar algumas páginas de exemplo se não existirem
  db.get("SELECT COUNT(*) as count FROM pages WHERE status = 'published'", (err, result) => {
    if (err) {
      console.error('Erro ao contar páginas:', err);
      return;
    }
    
    console.log(`\n📄 Páginas publicadas existentes: ${result.count}`);
    
    if (result.count === 0 && categories.length > 0) {
      console.log('\n➕ Criando páginas de exemplo...');
      
      const samplePages = [
        {
          title: 'Introdução ao Sistema',
          content: '<p>Esta é uma página de exemplo que explica como usar o sistema Wiki.</p><h2>Recursos Principais</h2><ul><li>Organização por categorias</li><li>Busca avançada</li><li>Interface responsiva</li></ul>',
          summary: 'Página introdutória ao sistema Wiki com explicações básicas.',
          category_id: categories[0].id,
          slug: 'introducao-ao-sistema'
        },
        {
          title: 'Guia de Configuração',
          content: '<p>Este guia mostra como configurar adequadamente o sistema.</p><h2>Passos Iniciais</h2><ol><li>Acesse o painel administrativo</li><li>Configure as categorias</li><li>Crie seu primeiro artigo</li></ol>',
          summary: 'Guia completo para configuração inicial do sistema.',
          category_id: categories[0].id,
          slug: 'guia-de-configuracao'
        }
      ];
      
      if (categories.length > 1) {
        samplePages.push({
          title: 'FAQ - Perguntas Frequentes',
          content: '<p>Respostas para as dúvidas mais comuns.</p><h3>Como criar um artigo?</h3><p>Acesse o painel administrativo e clique em "Nova Página".</p><h3>Como organizar categorias?</h3><p>Use a seção de categorias para criar uma hierarquia lógica.</p>',
          summary: 'Perguntas e respostas frequentes sobre o sistema.',
          category_id: categories[1].id,
          slug: 'faq-perguntas-frequentes'
        });
      }
      
      let created = 0;
      samplePages.forEach((page, index) => {
        db.run(`
          INSERT INTO pages (title, content, summary, slug, status, category_id, author_id, created_at, updated_at)
          VALUES (?, ?, ?, ?, 'published', ?, 1, datetime('now'), datetime('now'))
        `, [page.title, page.content, page.summary, page.slug, page.category_id], (err) => {
          if (err) {
            console.error(`Erro ao criar página "${page.title}":`, err);
          } else {
            created++;
            console.log(`✅ Página criada: ${page.title}`);
          }
          
          if (created === samplePages.length) {
            console.log(`\n🎉 ${created} páginas de exemplo criadas com sucesso!`);
            process.exit();
          }
        });
      });
    } else {
      process.exit();
    }
  });
});
