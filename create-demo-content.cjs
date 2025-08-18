const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🎯 Criando dados de exemplo para demonstração da Wiki...\n');

// Caminho do banco de dados
const dbPath = path.join(__dirname, 'server', 'smyrna.db');
console.log('🗄️ Conectando ao banco:', dbPath);

// Conectar ao banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err);
    process.exit(1);
  }
  console.log('✅ Conectado ao banco SQLite\n');
  
  // Iniciar processo de criação
  criarDemonstration();
});

function criarDemonstration() {
  console.log('📋 Criando categorias de exemplo...');
  
  // Categorias de exemplo
  const categorias = [
    ['Processos Operacionais', 'processos-operacionais', 'Documentação de processos e procedimentos operacionais', '#3b82f6', 'wiki'],
    ['Tecnologia e Sistemas', 'tecnologia-sistemas', 'Manuais técnicos e documentação de sistemas', '#10b981', 'wiki'],
    ['Recursos Humanos', 'recursos-humanos', 'Políticas de RH e procedimentos administrativos', '#f59e0b', 'wiki'],
    ['Qualidade e Compliance', 'qualidade-compliance', 'Normas de qualidade e compliance', '#ef4444', 'wiki'],
    ['Treinamentos', 'treinamentos', 'Material de treinamento e desenvolvimento', '#8b5cf6', 'wiki']
  ];

  let categoriasCompletas = 0;
  
  categorias.forEach((cat, index) => {
    db.run(`INSERT OR REPLACE INTO categories (id, name, slug, description, color, type, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [100 + index, ...cat], function(err) {
        if (err) {
          console.error(`❌ Erro categoria ${cat[0]}:`, err);
        } else {
          console.log(`✅ Categoria "${cat[0]}" criada`);
        }
        
        categoriasCompletas++;
        if (categoriasCompletas === categorias.length) {
          setTimeout(criarPaginas, 1000);
        }
      });
  });
}

function criarPaginas() {
  console.log('\n📄 Criando páginas de exemplo...');
  
  const paginas = [
    {
      id: 101,
      title: 'Processo de Onboarding de Novos Funcionários',
      slug: 'processo-onboarding-funcionarios',
      content: `<h2>Processo de Onboarding - Novos Funcionários</h2>
                <h3>1. Preparação Pré-Chegada</h3>
                <ul><li>Preparar estação de trabalho e equipamentos</li><li>Configurar acessos aos sistemas</li><li>Definir buddy/mentor para acompanhamento</li><li>Agendar reuniões de apresentação com equipe</li></ul>
                <h3>2. Primeiro Dia</h3>
                <ul><li>Recepção e boas-vindas</li><li>Tour pelas instalações</li><li>Apresentação da equipe e cultura organizacional</li><li>Entrega de materiais e documentos</li><li>Configuração inicial de sistemas</li></ul>
                <h3>3. Primeira Semana</h3>
                <ul><li>Treinamentos obrigatórios de segurança</li><li>Apresentação detalhada das responsabilidades</li><li>Reuniões com stakeholders principais</li><li>Definição de metas e objetivos iniciais</li></ul>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;"><strong>📋 Checklist do RH:</strong><br>☐ Documentos assinados<br>☐ Acessos configurados<br>☐ Treinamentos concluídos<br>☐ Avaliação 30 dias realizada</div>`,
      categoryId: 100
    },
    {
      id: 102,
      title: 'Manual de Configuração do Sistema ERP',
      slug: 'manual-configuracao-sistema-erp',
      content: `<h2>Manual de Configuração - Sistema ERP</h2>
                <h3>🔧 Configurações Iniciais</h3>
                <h4>1. Acesso ao Sistema</h4>
                <ul><li><strong>URL:</strong> https://erp.empresa.com</li><li><strong>Usuário padrão:</strong> Solicitar ao TI</li><li><strong>Senha:</strong> Definida no primeiro acesso</li></ul>
                <h4>2. Configuração do Perfil</h4>
                <ol><li>Acesse Menu → Configurações → Perfil do Usuário</li><li>Preencha informações pessoais e departamento</li><li>Configure preferências de idioma e timezone</li><li>Defina método de autenticação (2FA recomendado)</li></ol>
                <h3>📊 Módulos Principais</h3>
                <ul><li><strong>Financeiro:</strong> Contas a Pagar e Receber, Fluxo de Caixa</li><li><strong>Vendas:</strong> Cadastro de Clientes, Gestão de Propostas</li><li><strong>Estoque:</strong> Controle de Entrada e Saída, Inventário</li></ul>
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;"><strong>⚠️ Importante:</strong> Sempre faça backup antes de configurações críticas. Em caso de dúvidas, consulte a equipe de TI.</div>`,
      categoryId: 101
    },
    {
      id: 103,
      title: 'Política de Benefícios e Vantagens',
      slug: 'politica-beneficios-vantagens',
      content: `<h2>Política de Benefícios e Vantagens</h2>
                <h3>💰 Benefícios Obrigatórios</h3>
                <h4>Vale Transporte</h4>
                <ul><li>Fornecido para deslocamento casa-trabalho-casa</li><li>Desconto de 6% sobre salário base</li><li>Solicitação via portal do RH até dia 25</li></ul>
                <h4>Vale Refeição</h4>
                <ul><li>R$ 25,00 por dia útil trabalhado</li><li>Cartão magnético com validade mensal</li><li>Rede credenciada disponível no portal</li></ul>
                <h3>🏥 Plano de Saúde</h3>
                <ul><li><strong>Plano básico:</strong> 100% custeado pela empresa</li><li><strong>Dependentes:</strong> co-participação conforme tabela</li><li><strong>Carência:</strong> 30 dias para novos funcionários</li></ul>
                <h3>🎯 Benefícios Flexíveis</h3>
                <ul><li><strong>PPL:</strong> Participação nos Lucros anual</li><li><strong>Auxílio Educação:</strong> até 70% de graduação, 80% pós</li><li><strong>Day Off Aniversário:</strong> folga no dia do aniversário</li></ul>
                <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;"><strong>📋 Como Solicitar:</strong><br>1. Acesse o Portal do RH<br>2. Menu "Meus Benefícios"<br>3. Preencha formulário<br>4. Aguarde aprovação (até 5 dias úteis)</div>`,
      categoryId: 102
    },
    {
      id: 104,
      title: 'Procedimento de Auditoria Interna',
      slug: 'procedimento-auditoria-interna',
      content: `<h2>Procedimento de Auditoria Interna</h2>
                <h3>🎯 Objetivo</h3>
                <p>Estabelecer metodologia para realização de auditorias internas, garantindo conformidade com normas ISO 9001, LGPD e regulamentações setoriais.</p>
                <h3>📋 Planejamento da Auditoria</h3>
                <ul><li><strong>Cronograma:</strong> Auditorias trimestrais por setor</li><li><strong>Equipe:</strong> Auditor Líder + Auditores internos</li><li><strong>Comunicação:</strong> 15 dias de antecedência</li></ul>
                <h3>🔍 Execução</h3>
                <ol><li>Reunião de abertura</li><li>Execução do plano conforme cronograma</li><li>Coleta de evidências objetivas</li><li>Identificação de não-conformidades</li><li>Reunião de encerramento</li></ol>
                <h3>📊 Critérios de Avaliação</h3>
                <ul><li>✅ <strong>Conforme:</strong> Atende totalmente aos requisitos</li><li>⚠️ <strong>Observação:</strong> Oportunidade de melhoria</li><li>❌ <strong>Não-conformidade:</strong> Desvio identificado</li></ul>
                <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-top: 20px;"><strong>🚨 Não-Conformidades Críticas:</strong><br>Devem ser tratadas imediatamente e comunicadas à alta direção em até 24h.</div>`,
      categoryId: 103
    },
    {
      id: 105,
      title: 'Programa de Desenvolvimento de Liderança',
      slug: 'programa-desenvolvimento-lideranca',
      content: `<h2>Programa de Desenvolvimento de Liderança</h2>
                <h3>🎯 Público-Alvo</h3>
                <ul><li>Gestores atuais (todos os níveis)</li><li>Coordenadores e supervisores</li><li>High potentials identificados</li><li>Sucessores mapeados</li></ul>
                <h3>📚 Módulos do Programa (128h total)</h3>
                <h4>Módulo 1: Fundamentos da Liderança (40h)</h4>
                <ul><li>Autoconhecimento e Estilos de Liderança</li><li>Comunicação Eficaz e Feedback</li><li>Inteligência Emocional</li></ul>
                <h4>Módulo 2: Gestão de Equipes (32h)</h4>
                <ul><li>Motivação e Engajamento</li><li>Delegação e Empowerment</li><li>Gestão de Conflitos</li></ul>
                <h4>Módulo 3: Resultados e Performance (24h)</h4>
                <ul><li>Definição de Metas e KPIs</li><li>Avaliação de Desempenho</li><li>Coaching e Mentoring</li></ul>
                <h4>Módulo 4: Liderança Estratégica (32h)</h4>
                <ul><li>Pensamento Estratégico</li><li>Gestão da Mudança</li><li>Inovação e Transformação Digital</li></ul>
                <h3>💰 Investimento</h3>
                <ul><li><strong>Custo:</strong> R$ 8.500 por participante</li><li><strong>Parcelamento:</strong> 4x sem juros</li><li><strong>Desconto:</strong> 20% para inscrições antecipadas</li></ul>
                <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-top: 20px;"><strong>🎯 ROI Esperado:</strong><br>• 25% melhoria nos indicadores de engajamento<br>• 30% redução no turnover de talentos<br>• 20% aumento na produtividade das equipes</div>`,
      categoryId: 104
    }
  ];

  let paginasCompletas = 0;
  
  paginas.forEach((pagina) => {
    db.run(`INSERT OR REPLACE INTO pages (id, title, slug, content, status, author_id, category_id, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [pagina.id, pagina.title, pagina.slug, pagina.content, 'published', 1, pagina.categoryId],
      function(err) {
        if (err) {
          console.error(`❌ Erro página ${pagina.title}:`, err);
        } else {
          console.log(`✅ Página "${pagina.title}" criada`);
        }
        
        paginasCompletas++;
        if (paginasCompletas === paginas.length) {
          console.log('\n🎉 Conteúdo de demonstração criado com sucesso!');
          console.log('📊 Resumo:');
          console.log(`   • 5 categorias criadas`);
          console.log(`   • ${paginasCompletas} páginas de exemplo criadas`);
          console.log('   • Conteúdo pronto para apresentação aos líderes!');
          console.log('');
          console.log('🌐 Para visualizar:');
          console.log('   • Inicie os servidores: npm run server:dev e npm run dev');
          console.log('   • Acesse: http://localhost:3000/wiki');
          console.log('   • Login: admin@smyrna.com / admin123');
          
          db.close((err) => {
            if (err) console.error('Erro ao fechar banco:', err);
            process.exit(0);
          });
        }
      });
  });
}
