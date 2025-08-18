const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('📝 Criando dados de exemplo para demonstração do Blog...\n');

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
  criarBlogDemo();
});

function criarBlogDemo() {
  console.log('📋 Criando categorias do Blog...');
  
  // Categorias específicas para Blog
  const categoriasBlog = [
    ['Novidades da Empresa', 'novidades-empresa', 'Atualizações e novidades internas', '#3b82f6', 'blog'],
    ['Dicas e Tutoriais', 'dicas-tutoriais', 'Conteúdo educativo e dicas práticas', '#10b981', 'blog'],
    ['Eventos Corporativos', 'eventos-corporativos', 'Cobertura de eventos e atividades da empresa', '#f59e0b', 'blog'],
    ['Tendências do Mercado', 'tendencias-mercado', 'Análises e tendências do setor', '#ef4444', 'blog'],
    ['Cultura Organizacional', 'cultura-organizacional', 'Valores, cultura e pessoas da empresa', '#8b5cf6', 'blog']
  ];

  let categoriasCompletas = 0;
  
  categoriasBlog.forEach((cat, index) => {
    db.run(`INSERT OR REPLACE INTO categories (id, name, slug, description, color, type, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [200 + index, ...cat], function(err) {
        if (err) {
          console.error(`❌ Erro categoria ${cat[0]}:`, err);
        } else {
          console.log(`✅ Categoria Blog "${cat[0]}" criada`);
        }
        
        categoriasCompletas++;
        if (categoriasCompletas === categoriasBlog.length) {
          setTimeout(criarPostsBlog, 1000);
        }
      });
  });
}

function criarPostsBlog() {
  console.log('\n📰 Criando posts de exemplo...');
  
  const posts = [
    // Novidades da Empresa (2 posts)
    {
      id: 201,
      title: 'Nova Sede: Expansão para Atender Crescimento da Equipe',
      slug: 'nova-sede-expansao-crescimento-equipe',
      content: `<h2>🏢 Nova Sede: Um Marco na Nossa História</h2>
                <p>É com grande alegria que anunciamos a mudança para nossa nova sede! Após meses de planejamento, finalmente temos um espaço que reflete o crescimento da nossa equipe e nossos valores organizacionais.</p>
                <h3>🎯 Principais Melhorias</h3>
                <ul><li><strong>Mais Espaço:</strong> 40% mais área para acomodar novos talentos</li><li><strong>Salas de Reunião Modernas:</strong> 8 salas equipadas com tecnologia de ponta</li><li><strong>Área de Descanso:</strong> Espaço dedicado ao bem-estar da equipe</li><li><strong>Estacionamento:</strong> 50 vagas exclusivas para funcionários</li></ul>
                <h3>📍 Nova Localização</h3>
                <p>Nossa nova sede fica na <strong>Av. Paulista, 1234 - Bela Vista, São Paulo</strong>, facilitando o acesso via transporte público e oferecendo melhor infraestrutura para nossos colaboradores e clientes.</p>
                <h3>📅 Cronograma de Mudança</h3>
                <ul><li><strong>15/08:</strong> Mudança do departamento de TI</li><li><strong>18/08:</strong> Mudança administrativa e RH</li><li><strong>20/08:</strong> Mudança comercial e marketing</li><li><strong>22/08:</strong> Inauguração oficial</li></ul>
                <p style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-top: 20px;"><strong>🎉 Festa de Inauguração:</strong> Dia 22/08 às 18h. Toda a equipe está convidada para celebrar este novo capítulo!</p>`,
      categoryId: 200,
      summary: 'Conheça nossa nova sede e todas as melhorias que preparamos para oferecer um ambiente de trabalho ainda melhor para nossa equipe.',
      featuredImage: '/images/nova-sede.jpg'
    },
    {
      id: 202,
      title: 'Certificação ISO 9001: Conquistamos o Selo de Qualidade',
      slug: 'certificacao-iso-9001-selo-qualidade',
      content: `<h2>🏆 ISO 9001: Reconhecimento da Nossa Qualidade</h2>
                <p>Após 18 meses de dedicação e melhoria contínua, conquistamos a certificação <strong>ISO 9001:2015</strong>! Este selo representa nosso compromisso com a excelência em todos os processos.</p>
                <h3>🎯 O Que Significa Esta Conquista</h3>
                <ul><li><strong>Processos Padronizados:</strong> Maior consistência na entrega</li><li><strong>Melhoria Contínua:</strong> Cultura de aperfeiçoamento constante</li><li><strong>Satisfação do Cliente:</strong> Foco total na experiência do cliente</li><li><strong>Competitividade:</strong> Diferencial no mercado</li></ul>
                <h3>📊 Números da Certificação</h3>
                <ul><li><strong>18 meses</strong> de preparação</li><li><strong>156 processos</strong> mapeados e otimizados</li><li><strong>45 colaboradores</strong> treinados</li><li><strong>3 auditorias</strong> realizadas</li></ul>
                <h3>👥 Agradecimentos</h3>
                <p>Esta conquista só foi possível graças ao <strong>empenho de toda a equipe</strong>. Cada departamento contribuiu com dedicação e profissionalismo para alcançarmos este objetivo.</p>
                <blockquote style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; font-style: italic;">
                "A ISO 9001 não é apenas um certificado na parede, é a garantia de que nossos processos estão alinhados com os mais altos padrões de qualidade mundial." - CEO
                </blockquote>
                <p style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;"><strong>🔄 Próximos Passos:</strong> Agora focamos na manutenção dos padrões e na preparação para a auditoria de recertificação em 2027.</p>`,
      categoryId: 200,
      summary: 'Celebramos a conquista da certificação ISO 9001, um marco importante que representa nosso compromisso com a qualidade e excelência.',
      featuredImage: '/images/iso-9001.jpg'
    },

    // Dicas e Tutoriais (2 posts)
    {
      id: 203,
      title: 'Como Organizar seu Home Office para Máxima Produtividade',
      slug: 'como-organizar-home-office-produtividade',
      content: `<h2>🏠 Home Office Produtivo: Guia Completo</h2>
                <p>O trabalho remoto veio para ficar! Para te ajudar a criar um ambiente produtivo em casa, preparamos este guia com dicas práticas testadas pela nossa equipe.</p>
                <h3>🪑 Ergonomia em Primeiro Lugar</h3>
                <h4>Cadeira e Mesa</h4>
                <ul><li><strong>Altura da mesa:</strong> Cotovelos em 90° ao digitar</li><li><strong>Cadeira ajustável:</strong> Pés apoiados no chão, costas retas</li><li><strong>Monitor na altura dos olhos:</strong> Evita dor no pescoço</li></ul>
                <h4>Iluminação</h4>
                <ul><li><strong>Luz natural:</strong> Posicione a mesa próxima à janela</li><li><strong>Evite reflexos:</strong> Monitor perpendicular à janela</li><li><strong>Iluminação auxiliar:</strong> Luminária de mesa para tarefas específicas</li></ul>
                <h3>🎯 Organização do Espaço</h3>
                <h4>Método 5S Adaptado</h4>
                <ol><li><strong>Seiri (Senso de Utilização):</strong> Mantenha apenas o essencial na mesa</li><li><strong>Seiton (Senso de Ordenação):</strong> Cada coisa em seu lugar</li><li><strong>Seiso (Senso de Limpeza):</strong> 5 minutos de organização ao final do dia</li><li><strong>Seiketsu (Senso de Padronização):</strong> Rotina de organização</li><li><strong>Shitsuke (Senso de Disciplina):</strong> Manter os hábitos</li></ol>
                <h3>⏰ Gestão do Tempo</h3>
                <ul><li><strong>Pomodoro:</strong> 25min foco + 5min pausa</li><li><strong>Time blocking:</strong> Blocos específicos para cada atividade</li><li><strong>Lista de prioridades:</strong> Matix de Eisenhower</li></ul>
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <strong>💡 Dica Extra:</strong> Use plantas no ambiente! Elas melhoram a qualidade do ar e reduzem o stress. Sugestões: Pothos, Espada-de-São-Jorge, Zamioculca.
                </div>`,
      categoryId: 201,
      summary: 'Dicas práticas para organizar seu espaço de trabalho em casa e aumentar sua produtividade no home office.',
      featuredImage: '/images/home-office.jpg'
    },
    {
      id: 204,
      title: 'Excel Avançado: 5 Fórmulas que Todo Profissional Deveria Conhecer',
      slug: 'excel-avancado-5-formulas-essenciais',
      content: `<h2>📊 Excel Avançado: Fórmulas Que Fazem a Diferença</h2>
                <p>Dominar Excel é fundamental no ambiente corporativo. Separamos 5 fórmulas avançadas que vão transformar sua produtividade!</p>
                <h3>1️⃣ PROCV (VLOOKUP) - A Base de Tudo</h3>
                <p><strong>Sintaxe:</strong> <code>=PROCV(valor_procurado; matriz_tabela; núm_índice_coluna; [procurar_intervalo])</code></p>
                <p><strong>Exemplo Prático:</strong> Buscar salário de funcionário por ID</p>
                <pre style="background: #f8fafc; padding: 10px; border-radius: 4px;">=PROCV(A2;Funcionarios!A:C;3;FALSO)</pre>
                <p><strong>Dica:</strong> Sempre use FALSO para correspondência exata!</p>
                
                <h3>2️⃣ SE.ERRO (IFERROR) - Tratamento de Erros</h3>
                <p><strong>Sintaxe:</strong> <code>=SE.ERRO(valor; valor_se_erro)</code></p>
                <p><strong>Exemplo:</strong> Evitar #N/D em PROCV</p>
                <pre style="background: #f8fafc; padding: 10px; border-radius: 4px;">=SE.ERRO(PROCV(A2;Dados!A:B;2;0);"Não encontrado")</pre>
                
                <h3>3️⃣ SOMASE (SUMIF) - Soma Condicional</h3>
                <p><strong>Sintaxe:</strong> <code>=SOMASE(intervalo; critérios; [intervalo_soma])</code></p>
                <p><strong>Exemplo:</strong> Somar vendas por região</p>
                <pre style="background: #f8fafc; padding: 10px; border-radius: 4px;">=SOMASE(B:B;"São Paulo";C:C)</pre>
                
                <h3>4️⃣ CONT.SE (COUNTIF) - Contagem Condicional</h3>
                <p><strong>Sintaxe:</strong> <code>=CONT.SE(intervalo; critérios)</code></p>
                <p><strong>Exemplo:</strong> Contar quantos funcionários por departamento</p>
                <pre style="background: #f8fafc; padding: 10px; border-radius: 4px;">=CONT.SE(D:D;"Vendas")</pre>
                
                <h3>5️⃣ ÍNDICE + CORRESP - Substituto Poderoso do PROCV</h3>
                <p><strong>Vantagem:</strong> Busca em qualquer direção (esquerda/direita)</p>
                <p><strong>Exemplo:</strong> Buscar à esquerda</p>
                <pre style="background: #f8fafc; padding: 10px; border-radius: 4px;">=ÍNDICE(A:A;CORRESP(D2;B:B;0))</pre>
                
                <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <strong>🎯 Exercício Prático:</strong><br>
                Crie uma planilha de controle de vendas e pratique essas fórmulas. Nossa equipe de TI disponibilizou templates na pasta compartilhada!
                </div>`,
      categoryId: 201,
      summary: 'Aprenda 5 fórmulas avançadas do Excel que vão revolucionar sua produtividade no trabalho. Com exemplos práticos e dicas profissionais.',
      featuredImage: '/images/excel-formulas.jpg'
    },

    // Eventos Corporativos (2 posts)
    {
      id: 205,
      title: 'Workshop de Inovação: Criando Soluções Disruptivas',
      slug: 'workshop-inovacao-solucoes-disruptivas',
      content: `<h2>💡 Workshop de Inovação: Transformando Ideias em Realidade</h2>
                <p>Na última sexta-feira, nossa equipe participou de um workshop intensivo sobre <strong>Design Thinking e Inovação</strong>. O evento, conduzido pelo especialista Dr. Carlos Innovation, trouxe metodologias práticas para resolver problemas complexos.</p>
                <h3>🎯 Metodologia Aplicada</h3>
                <h4>Design Thinking em 5 Etapas</h4>
                <ol><li><strong>Empatizar:</strong> Entender profundamente o usuário</li><li><strong>Definir:</strong> Cristalizar o problema real</li><li><strong>Idear:</strong> Brainstorming sem limites</li><li><strong>Prototipar:</strong> Materializar ideias rapidamente</li><li><strong>Testar:</strong> Validar com usuários reais</li></ol>
                <h3>🚀 Projetos Desenvolvidos</h3>
                <h4>Equipe Alpha - App de Comunicação Interna</h4>
                <ul><li><strong>Problema:</strong> Comunicação fragmentada entre departamentos</li><li><strong>Solução:</strong> Plataforma unificada com gamificação</li><li><strong>Impacto esperado:</strong> 40% mais agilidade na comunicação</li></ul>
                <h4>Equipe Beta - Sistema de Feedback 360°</h4>
                <ul><li><strong>Problema:</strong> Feedback limitado a avaliações anuais</li><li><strong>Solução:</strong> Ferramenta de feedback contínuo</li><li><strong>Impacto esperado:</strong> Melhoria de 60% no desenvolvimento pessoal</li></ul>
                <h4>Equipe Gamma - Portal de Conhecimento IA</h4>
                <ul><li><strong>Problema:</strong> Conhecimento disperso na organização</li><li><strong>Solução:</strong> IA que centraliza e sugere conteúdo</li><li><strong>Impacto esperado:</strong> 70% redução no tempo de busca por informações</li></ul>
                <h3>📈 Resultados do Workshop</h3>
                <ul><li><strong>Participantes:</strong> 32 colaboradores</li><li><strong>Projetos criados:</strong> 6 protótipos</li><li><strong>Satisfação:</strong> 9.2/10</li><li><strong>Ideias para implementar:</strong> 3 aprovadas</li></ul>
                <blockquote style="background: #f8fafc; border-left: 4px solid #8b5cf6; padding: 15px; margin: 20px 0; font-style: italic;">
                "O workshop mostrou que inovação não é sobre ter ideias geniais, mas sobre processo, método e colaboração." - Participante Anônimo
                </blockquote>
                <p style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;"><strong>🔄 Próximos Passos:</strong> As equipes têm 30 dias para desenvolver MVPs dos protótipos aprovados. Acompanhe os resultados!</p>`,
      categoryId: 202,
      summary: 'Cobertura completa do Workshop de Inovação, com metodologias aplicadas, projetos desenvolvidos e resultados alcançados pela equipe.',
      featuredImage: '/images/workshop-inovacao.jpg'
    },
    {
      id: 206,
      title: 'Confraternização de Final de Ano: Celebrando Conquistas',
      slug: 'confraternizacao-final-ano-celebrando-conquistas',
      content: `<h2>🎉 Confraternização 2024: Uma Noite Inesquecível</h2>
                <p>Nossa confraternização de final de ano foi um sucesso absoluto! No dia 15 de dezembro, no elegante Salão Crystal, celebramos não apenas o fim de mais um ano, mas todas as conquistas e momentos especiais que vivemos juntos.</p>
                <h3>🏆 Premiações da Noite</h3>
                <h4>Funcionário do Ano</h4>
                <p><strong>Marina Silva (Comercial)</strong> - Por excepcional performance de vendas e liderança inspiradora</p>
                <h4>Inovação do Ano</h4>
                <p><strong>Equipe de TI</strong> - Implementação do sistema de automação que aumentou produtividade em 35%</p>
                <h4>Espírito de Equipe</h4>
                <p><strong>Departamento de RH</strong> - Por promover cultura organizacional e bem-estar</p>
                <h4>Revelação do Ano</h4>
                <p><strong>João Santos (Trainee)</strong> - Desenvolvimento excepcional e contribuições significativas</p>
                <h3>📊 Conquistas de 2024</h3>
                <ul><li><strong>Crescimento:</strong> 28% aumento no faturamento</li><li><strong>Equipe:</strong> 15 novos talentos contratados</li><li><strong>Clientes:</strong> 42 novos parceiros conquistados</li><li><strong>Projetos:</strong> 87% entregues no prazo</li><li><strong>Satisfação:</strong> NPS de 8.9 dos colaboradores</li></ul>
                <h3>🎭 Momentos Especiais</h3>
                <h4>Show de Talentos Internos</h4>
                <ul><li><strong>Banda "The Developers":</strong> Rock clássico com a galera de TI</li><li><strong>Coral de RH:</strong> Apresentação emocionante de MPB</li><li><strong>Stand-up:</strong> Carlos do Financeiro arrancou gargalhadas</li></ul>
                <h4>Sorteios</h4>
                <ul><li><strong>1º Prêmio:</strong> Notebook Dell - Ana Costa (Design)</li><li><strong>2º Prêmio:</strong> Smart TV 55" - Roberto Lima (Logística)</li><li><strong>3º Prêmio:</strong> Air Fryer - Carla Santos (Administrativo)</li></ul>
                <h3>🍽️ Gastronomia de Alto Nível</h3>
                <p>Buffet completo com pratos da culinária brasileira e internacional, estação de drinks autorais e uma mesa de sobremesas que foi sucesso absoluto!</p>
                <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <strong>📸 Galeria de Fotos:</strong><br>
                Todas as fotos da confraternização já estão disponíveis na intranet. Acesse a seção "Galeria de Eventos" e reviva os melhores momentos!
                </div>
                <p style="text-align: center; font-size: 18px; margin-top: 30px; color: #8b5cf6;"><strong>Obrigado a todos que fizeram parte desta celebração! Que 2025 seja ainda mais incrível! 🚀</strong></p>`,
      categoryId: 202,
      summary: 'Relembre os melhores momentos da nossa confraternização de final de ano, com premiações, apresentações e muita celebração.',
      featuredImage: '/images/confraternizacao.jpg'
    },

    // Tendências do Mercado (1 post)
    {
      id: 207,
      title: 'Inteligência Artificial no Trabalho: Oportunidade ou Ameaça?',
      slug: 'inteligencia-artificial-trabalho-oportunidade-ameaca',
      content: `<h2>🤖 IA no Trabalho: Navegando na Transformação Digital</h2>
                <p>A Inteligência Artificial está revolucionando o mundo do trabalho. Mas será que devemos ter medo ou abraçar essa transformação? Nossa análise mostra que a resposta está em como nos adaptamos.</p>
                <h3>📈 Dados do Mercado</h3>
                <ul><li><strong>85 milhões</strong> de empregos podem ser substituídos por IA até 2025</li><li><strong>97 milhões</strong> de novos empregos serão criados pela revolução tecnológica</li><li><strong>50%</strong> dos trabalhadores precisarão de requalificação</li><li><strong>40%</strong> das empresas já usam IA em algum processo</li></ul>
                <h3>💼 Impactos por Setor</h3>
                <h4>Setores Mais Afetados</h4>
                <ul><li><strong>Manufatura:</strong> Automação de linhas de produção</li><li><strong>Atendimento:</strong> Chatbots e assistentes virtuais</li><li><strong>Financeiro:</strong> Análise de risco automatizada</li><li><strong>Logística:</strong> Otimização de rotas e estoques</li></ul>
                <h4>Setores com Novas Oportunidades</h4>
                <ul><li><strong>Data Science:</strong> Análise e interpretação de dados</li><li><strong>UX/UI:</strong> Design centrado no usuário para IA</li><li><strong>Ética em IA:</strong> Desenvolvimento responsável</li><li><strong>Treinamento:</strong> Capacitação em tecnologias</li></ul>
                <h3>🎯 Como Nossa Empresa Está Se Preparando</h3>
                <h4>Investimentos em Tecnologia</h4>
                <ul><li><strong>R$ 2.5M</strong> em ferramentas de IA para 2025</li><li><strong>Parcerias estratégicas</strong> com startups de tecnologia</li><li><strong>Centro de Inovação</strong> interno criado</li></ul>
                <h4>Capacitação da Equipe</h4>
                <ul><li><strong>40 horas</strong> de treinamento em IA para líderes</li><li><strong>Certificações</strong> em ferramentas de automação</li><li><strong>Programa de mentoria</strong> tech para não-técnicos</li></ul>
                <h3>🚀 Habilidades do Futuro</h3>
                <h4>Hard Skills</h4>
                <ul><li>Análise de dados e estatística</li><li>Programação básica (Python, R)</li><li>Machine Learning fundamentals</li><li>Visualização de dados</li></ul>
                <h4>Soft Skills</h4>
                <ul><li><strong>Criatividade:</strong> IA não substitui originalidade</li><li><strong>Pensamento crítico:</strong> Questionar resultados da IA</li><li><strong>Inteligência emocional:</strong> Relacionamento humano</li><li><strong>Adaptabilidade:</strong> Mudanças constantes</li></ul>
                <blockquote style="background: #f8fafc; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; font-style: italic;">
                "A IA não vai substituir humanos. Humanos que usam IA vão substituir humanos que não usam IA." - Especialista em Transformação Digital
                </blockquote>
                <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <strong>🔄 Próximas Ações:</strong><br>
                • Workshop "IA para Não-Técnicos" em setembro<br>
                • Implementação piloto de ChatGPT empresarial<br>
                • Criação do Comitê de Ética em IA<br>
                • Programa de requalificação interna
                </div>`,
      categoryId: 203,
      summary: 'Análise completa sobre o impacto da Inteligência Artificial no mercado de trabalho e como nossa empresa está se preparando para essa transformação.',
      featuredImage: '/images/ia-trabalho.jpg'
    },

    // Cultura Organizacional (1 post)
    {
      id: 208,
      title: 'Valores em Ação: Como Vivemos Nossa Cultura no Dia a Dia',
      slug: 'valores-acao-cultura-organizacional-dia-dia',
      content: `<h2>🌟 Nossa Cultura em Ação: Mais que Palavras na Parede</h2>
                <p>Cultura organizacional não é apenas um conceito abstrato. É como agimos, decidimos e nos relacionamos todos os dias. Vamos mostrar como nossos valores se traduzem em ações concretas.</p>
                <h3>🎯 Nossos 5 Valores Fundamentais</h3>
                <h4>1. Excelência 🏆</h4>
                <p><strong>Na prática:</strong></p>
                <ul><li>Zero defeitos em 98.5% das entregas</li><li>Revisão por pares em todos os projetos</li><li>Investimento de 3% do faturamento em melhorias</li><li>Certificações técnicas incentivadas (R$ 5.000/ano por funcionário)</li></ul>
                <h4>2. Colaboração 🤝</h4>
                <p><strong>Na prática:</strong></p>
                <ul><li>Projetos cross-funcionais em 70% das iniciativas</li><li>Programa de mentoria com 80% de adesão</li><li>Reuniões semanais de alinhamento por equipe</li><li>Ferramentas colaborativas (Slack, Notion, Figma)</li></ul>
                <h4>3. Inovação 💡</h4>
                <p><strong>Na prática:</strong></p>
                <ul><li>20% do tempo para projetos pessoais (Sexta da Inovação)</li><li>Hackathons trimestrais com premiações</li><li>R$ 500.000 anuais em P&D</li><li>Parcerias com 3 universidades</li></ul>
                <h4>4. Transparência 🔍</h4>
                <p><strong>Na prática:</strong></p>
                <ul><li>Resultados financeiros compartilhados mensalmente</li><li>Feedbacks 360° semestrais</li><li>Política de portas abertas com liderança</li><li>OKRs públicos para todos os colaboradores</li></ul>
                <h4>5. Sustentabilidade 🌱</h4>
                <p><strong>Na prática:</strong></p>
                <ul><li>Escritório 100% movido a energia solar</li><li>Política paperless (90% redução)</li><li>Programa de reciclagem premiado</li><li>Compensação de carbono de 120% das emissões</li></ul>
                <h3>📊 Cultura em Números</h3>
                <ul><li><strong>Engajamento:</strong> 87% (benchmark mercado: 65%)</li><li><strong>Turnover:</strong> 8% (mercado: 23%)</li><li><strong>Recomendação NPS:</strong> 8.9/10</li><li><strong>Diversidade:</strong> 52% mulheres em liderança</li><li><strong>Satisfação:</strong> 91% recomendam a empresa</li></ul>
                <h3>🗣️ Vozes da Equipe</h3>
                <blockquote style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                <p><em>"Aqui não é só trabalho, é propósito. Cada projeto faz diferença na vida dos clientes e na nossa também."</em></p>
                <strong>- Marina, Product Manager</strong>
                </blockquote>
                <blockquote style="background: #f8fafc; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
                <p><em>"A transparência aqui é real. Sei exatamente como contribuo para os resultados da empresa."</em></p>
                <strong>- Carlos, Desenvolvedor Senior</strong>
                </blockquote>
                <blockquote style="background: #f8fafc; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p><em>"Nunca vi uma empresa que investe tanto no crescimento pessoal dos funcionários."</em></p>
                <strong>- Ana, UX Designer</strong>
                </blockquote>
                <h3>🚀 Iniciativas 2025</h3>
                <ul><li><strong>Programa de Well-being:</strong> Yoga, meditação e psicólogo corporativo</li><li><strong>Flexibilidade Total:</strong> Trabalho híbrido personalizado</li><li><strong>Universidade Corporativa:</strong> MBA interno em parceria com FGV</li><li><strong>Impacto Social:</strong> 1% do lucro para projetos sociais</li></ul>
                <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <strong>💬 Sua Opinião Importa:</strong><br>
                Participe da nossa pesquisa anual de cultura organizacional. Sua voz constrói nosso futuro juntos!
                <br><br>
                <strong>Como participar:</strong> Acesse o link enviado por email ou procure o RH.
                </div>`,
      categoryId: 204,
      summary: 'Conheça como nossa cultura organizacional se traduz em ações concretas no dia a dia, com exemplos práticos e números que comprovam nossos valores.',
      featuredImage: '/images/cultura-organizacional.jpg'
    }
  ];

  let postsCompletos = 0;
  
  posts.forEach((post) => {
    db.run(`INSERT OR REPLACE INTO posts (id, title, slug, content, summary, featured_image, status, author_id, category_id, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [post.id, post.title, post.slug, post.content, post.summary, post.featuredImage, 'published', 1, post.categoryId],
      function(err) {
        if (err) {
          console.error(`❌ Erro post ${post.title}:`, err);
        } else {
          console.log(`✅ Post "${post.title}" criado`);
        }
        
        postsCompletos++;
        if (postsCompletos === posts.length) {
          console.log('\n🎉 Conteúdo de demonstração do Blog criado com sucesso!');
          console.log('📊 Resumo:');
          console.log('   • 5 categorias do blog criadas');
          console.log(`   • ${postsCompletos} posts de exemplo criados`);
          console.log('   • Conteúdo variado e profissional');
          console.log('');
          console.log('🌐 Para visualizar:');
          console.log('   • Inicie os servidores: npm run server:dev e npm run dev');
          console.log('   • Acesse: http://localhost:3000/blog');
          console.log('   • Login: admin@smyrna.com / admin123');
          
          db.close((err) => {
            if (err) console.error('Erro ao fechar banco:', err);
            process.exit(0);
          });
        }
      });
  });
}
