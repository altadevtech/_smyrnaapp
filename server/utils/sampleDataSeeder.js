// Script para popular dados de exemplo automaticamente
import Database from '../database.js'

class SampleDataSeeder {
  static async seedSampleData() {
    console.log('🌱 Verificando se é necessário popular dados de exemplo...')
    
    try {
      const db = Database.getDb()
      
      // Verificar se já existem dados
      const pageCount = await this.getPageCount()
      const categoryCount = await this.getCategoryCount()
      
      if (pageCount > 0) {
        console.log(`📊 Já existem ${pageCount} páginas. Não populando dados de exemplo.`)
        return
      }
      
      console.log('📝 Populando dados de exemplo para demonstração...')
      
      // 1. Garantir categorias existem
      await this.ensureCategories()
      
      // 2. Criar páginas de exemplo
      await this.createSamplePages()
      
      // 3. Criar posts de exemplo
      await this.createSamplePosts()
      
      console.log('✅ Dados de exemplo populados com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro ao popular dados de exemplo:', error)
    }
  }
  
  static getPageCount() {
    return new Promise((resolve, reject) => {
      const db = Database.getDb()
      
      // Primeiro verificar se a coluna 'type' existe
      db.get("PRAGMA table_info(pages)", (err, tableInfo) => {
        if (err) {
          reject(err)
          return
        }
        
        // Verificar todas as colunas da tabela
        db.all("PRAGMA table_info(pages)", (err, columns) => {
          if (err) {
            reject(err)
            return
          }
          
          const hasTypeColumn = columns.some(col => col.name === 'type')
          
          let query
          if (hasTypeColumn) {
            // Se tem coluna type, usar filtro completo
            query = "SELECT COUNT(*) as count FROM pages WHERE type = 'wiki' AND status = 'published'"
          } else {
            // Se não tem coluna type, assumir que todas as pages são wiki
            query = "SELECT COUNT(*) as count FROM pages WHERE status = 'published'"
          }
          
          db.get(query, (err, result) => {
            if (err) reject(err)
            else resolve(result.count)
          })
        })
      })
    })
  }
  
  static getCategoryCount() {
    return new Promise((resolve, reject) => {
      const db = Database.getDb()
      
      // Verificar se a coluna 'type' existe na tabela categories
      db.all("PRAGMA table_info(categories)", (err, columns) => {
        if (err) {
          reject(err)
          return
        }
        
        const hasTypeColumn = columns.some(col => col.name === 'type')
        
        let query
        if (hasTypeColumn) {
          query = "SELECT COUNT(*) as count FROM categories WHERE type = 'wiki'"
        } else {
          query = "SELECT COUNT(*) as count FROM categories"
        }
        
        db.get(query, (err, result) => {
          if (err) reject(err)
          else resolve(result.count)
        })
      })
    })
  }
  
  static ensureCategories() {
    return new Promise((resolve, reject) => {
      const db = Database.getDb()
      
      // Verificar estrutura da tabela categories primeiro
      db.all("PRAGMA table_info(categories)", (err, columns) => {
        if (err) {
          reject(err)
          return
        }
        
        const hasTypeColumn = columns.some(col => col.name === 'type')
        const hasColorColumn = columns.some(col => col.name === 'color')
        
        const categories = [
          { name: 'Processos Operacionais', slug: 'processos-operacionais', color: '#3B82F6' },
          { name: 'Políticas Internas', slug: 'politicas-internas', color: '#EF4444' },
          { name: 'Recursos Humanos', slug: 'recursos-humanos', color: '#10B981' },
          { name: 'Tecnologia', slug: 'tecnologia', color: '#8B5CF6' },
          { name: 'Financeiro', slug: 'financeiro', color: '#F59E0B' }
        ]
        
        let completed = 0
        
        categories.forEach(category => {
          // Construir query dinamicamente baseada nas colunas existentes
          let insertQuery = "INSERT OR IGNORE INTO categories (name, slug"
          let values = [category.name, category.slug]
          let placeholders = "?, ?"
          
          if (hasTypeColumn) {
            insertQuery += ", type"
            values.push('wiki')
            placeholders += ", ?"
          }
          
          if (hasColorColumn) {
            insertQuery += ", color"
            values.push(category.color)
            placeholders += ", ?"
          }
          
          insertQuery += ", created_at, updated_at) VALUES (" + placeholders + ", datetime('now'), datetime('now'))"
          
          db.run(insertQuery, values, function(err) {
            if (err) {
              console.error(`Erro ao criar categoria ${category.name}:`, err)
            }
            completed++
            if (completed === categories.length) {
              resolve()
            }
          })
        })
      })
    })
  }
  
  static createSamplePages() {
    return new Promise(async (resolve, reject) => {
      const db = Database.getDb()
      
      // Buscar IDs das categorias
      db.all("PRAGMA table_info(categories)", (err, columns) => {
        if (err) {
          reject(err)
          return
        }
        
        const hasTypeColumn = columns.some(col => col.name === 'type')
        
        let query
        if (hasTypeColumn) {
          query = "SELECT id, slug FROM categories WHERE type = 'wiki'"
        } else {
          query = "SELECT id, slug FROM categories"
        }
        
        db.all(query, (err, categories) => {
          if (err) {
            reject(err)
            return
          }
        
        const catMap = {}
        categories.forEach(cat => {
          catMap[cat.slug] = cat.id
        })
        
        const samplePages = [
          {
            title: 'Manual de Integração de Novos Funcionários',
            content: `# Manual de Integração

## Visão Geral
Este manual descreve o processo completo de integração de novos funcionários na empresa.

## Etapas do Processo

### 1. Preparação Pré-Chegada
- Preparar estação de trabalho
- Configurar contas e acessos
- Preparar documentação

### 2. Primeiro Dia
- Apresentação da equipe
- Tour pelas instalações
- Entrega de materiais

### 3. Primeira Semana
- Treinamentos básicos
- Definição de objetivos
- Acompanhamento inicial

## Documentos Necessários
- Contrato de trabalho
- Termo de confidencialidade
- Manual do funcionário`,
            category: 'processos-operacionais'
          },
          {
            title: 'Política de Home Office',
            content: `# Política de Trabalho Remoto

## Objetivos
Estabelecer diretrizes claras para o trabalho remoto, garantindo produtividade e bem-estar.

## Elegibilidade
- Funcionários com mais de 6 meses na empresa
- Aprovação do gestor direto
- Função compatível com trabalho remoto

## Requisitos Técnicos
- Conexão de internet estável (mínimo 50 Mbps)
- Equipamento adequado
- Ambiente de trabalho apropriado

## Horários e Disponibilidade
- Manter horário padrão de trabalho
- Estar disponível durante reuniões
- Comunicar ausências previamente

## Ferramentas Obrigatórias
- Microsoft Teams
- Sistema de gestão de projetos
- VPN corporativa`,
            category: 'politicas-internas'
          },
          {
            title: 'Processo de Recrutamento e Seleção',
            content: `# Processo de R&S

## Etapas do Processo

### 1. Identificação da Necessidade
- Análise da vaga
- Aprovação orçamentária
- Definição do perfil

### 2. Divulgação
- Publicação em portais
- Acionamento de headhunters
- Indicações internas

### 3. Triagem
- Análise de currículos
- Testes online
- Primeira entrevista (RH)

### 4. Entrevistas
- Entrevista técnica
- Entrevista comportamental
- Entrevista com gestor

### 5. Finalização
- Verificação de referências
- Negociação da proposta
- Contratação

## Métricas Importantes
- Time to hire: 30 dias
- Taxa de aprovação em experiência: 95%
- Satisfação dos candidatos: 4.5/5`,
            category: 'recursos-humanos'
          },
          {
            title: 'Guia de Segurança da Informação',
            content: `# Segurança da Informação

## Políticas de Senha
- Mínimo 12 caracteres
- Combinação de letras, números e símbolos
- Alteração a cada 90 dias
- Não reutilizar últimas 12 senhas

## Acesso a Sistemas
- Princípio do menor privilégio
- Autenticação de dois fatores obrigatória
- Revisão trimestral de acessos
- Bloqueio automático após inatividade

## Proteção de Dados
- Classificação de informações
- Criptografia para dados sensíveis
- Backup diário automático
- Política de retenção de dados

## Incidentes de Segurança
- Notificação imediata ao TI
- Isolamento do sistema afetado
- Investigação e documentação
- Plano de recuperação

## Treinamentos
- Conscientização anual obrigatória
- Simulações de phishing mensais
- Atualizações sobre novas ameaças`,
            category: 'tecnologia'
          },
          {
            title: 'Manual de Reembolso de Despesas',
            content: `# Reembolso de Despesas

## Despesas Elegíveis
- Viagens a trabalho
- Hospedagem e alimentação
- Transporte
- Material de escritório
- Cursos e treinamentos

## Limites e Aprovações
- Até R$ 500: Aprovação do gestor
- R$ 500 - R$ 2.000: Aprovação da diretoria
- Acima R$ 2.000: Aprovação do CEO

## Documentação Necessária
- Nota fiscal original
- Comprovante de pagamento
- Justificativa detalhada
- Formulário de reembolso preenchido

## Prazos
- Solicitação: até 30 dias após a despesa
- Análise: até 5 dias úteis
- Pagamento: até 15 dias úteis após aprovação

## Despesas Não Cobertas
- Multas de trânsito
- Despesas pessoais
- Gorjetas excessivas
- Bebidas alcoólicas`,
            category: 'financeiro'
          }
        ]
        
        let completed = 0
        
        samplePages.forEach(page => {
          const categoryId = catMap[page.category]
          if (!categoryId) {
            console.error(`Categoria não encontrada: ${page.category}`)
            completed++
            return
          }
          
          const slug = page.title.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-')
          
          db.run(
            `INSERT INTO pages (title, content, slug, type, status, category_id, author_id, created_at, updated_at)
             VALUES (?, ?, ?, 'wiki', 'published', ?, 1, datetime('now'), datetime('now'))`,
            [page.title, page.content, slug, categoryId],
            function(err) {
              if (err) {
                console.error(`Erro ao criar página ${page.title}:`, err)
              } else {
                console.log(`✅ Página criada: ${page.title}`)
              }
              completed++
              if (completed === samplePages.length) {
                resolve()
              }
            }
          )
        })
      })
    })
  }
  
  static createSamplePosts() {
    return new Promise((resolve) => {
      const db = Database.getDb()
      
      const samplePosts = [
        {
          title: 'Bem-vindos ao Sistema Wiki da Empresa',
          content: `Estamos felizes em anunciar o lançamento do nosso novo sistema de wiki corporativo! 

Este sistema permitirá que todos os colaboradores acessem informações importantes sobre processos, políticas e procedimentos da empresa.

**Principais funcionalidades:**
- Busca avançada por categorias
- Interface intuitiva e responsiva
- Controle de versões
- Sistema de comentários

Esperamos que esta ferramenta facilite o acesso à informação e melhore nossa produtividade!`,
          summary: 'Anúncio do lançamento do novo sistema de wiki corporativo com suas principais funcionalidades.'
        },
        {
          title: 'Novas Políticas de Segurança Implementadas',
          content: `Para garantir a segurança dos dados da empresa, implementamos novas políticas de segurança que entrarão em vigor a partir do próximo mês.

**Principais mudanças:**
- Autenticação de dois fatores obrigatória
- Novos requisitos de senha
- Treinamento de conscientização em segurança
- Revisão trimestral de acessos

Todos os funcionários receberão treinamento específico sobre as novas políticas. Para dúvidas, entre em contato com o setor de TI.`,
          summary: 'Implementação de novas políticas de segurança da informação e principais mudanças.'
        }
      ]
      
      let completed = 0
      
      samplePosts.forEach(post => {
        const slug = post.title.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-')
        
        db.run(
          `INSERT INTO posts (title, content, slug, summary, type, status, author_id, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'blog', 'published', 1, datetime('now'), datetime('now'))`,
          [post.title, post.content, slug, post.summary],
          function(err) {
            if (err) {
              console.error(`Erro ao criar post ${post.title}:`, err)
            } else {
              console.log(`✅ Post criado: ${post.title}`)
            }
            completed++
            if (completed === samplePosts.length) {
              resolve()
            }
          }
        )
      })
    })
  }
}

export default SampleDataSeeder
