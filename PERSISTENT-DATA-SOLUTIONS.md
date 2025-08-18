# 🔄 Soluções de Persistência de Dados no Render.com

## ❌ Problema Identificado

O **plano gratuito do Render.com** tem limitações importantes de persistência:

1. **Sistema de arquivos efêmero** - dados salvos localmente são perdidos a cada restart/deploy
2. **Sleep mode** - aplicações dormem após 15 minutos de inatividade
3. **Restarts automáticos** - acontecem regularmente e apagam dados locais
4. **SQLite local não persiste** - arquivo `smyrna.db` é perdido

## ✅ Soluções Implementadas

### 1. **Dados de Exemplo Automáticos** 

**Arquivo**: `server/utils/sampleDataSeeder.js`

- ✅ Popula automaticamente dados de exemplo quando o banco está vazio
- ✅ Ativado apenas em produção (`NODE_ENV=production` ou `RENDER=true`)
- ✅ Inclui:
  - 5 categorias de exemplo (Processos, Políticas, RH, TI, Financeiro)
  - 5 páginas wiki completas com conteúdo real
  - 2 posts de blog de demonstração

**Como funciona**:
```javascript
// Verifica se banco está vazio
const pageCount = await this.getPageCount()
if (pageCount === 0) {
  // Popula dados de exemplo automaticamente
  await this.seedSampleData()
}
```

### 2. **Suporte a PostgreSQL** (Recomendado)

**Dependência adicionada**: `pg: "^8.11.3"`

**Configuração no Render.com**:
1. Criar um PostgreSQL Database (gratuito)
2. Conectar à aplicação via variável de ambiente `DATABASE_URL`
3. Os dados serão persistentes permanentemente

### 3. **Alternativas Externas**

**Opções gratuitas para banco de dados**:
- **Supabase** (PostgreSQL - 500MB free)
- **PlanetScale** (MySQL - 10GB free) 
- **Neon** (PostgreSQL - 10GB free)
- **Railway** (PostgreSQL/MySQL - $5 credit free)

## 🚀 Implementação no Render.com

### Opção 1: PostgreSQL Nativo do Render (Recomendado)
```yaml
# render.yaml
services:
  - type: web
    # ... configurações da aplicação

  - type: pgsql
    name: smyrna-wiki-db
    databaseName: smyrna
    user: smyrna_user
```

### Opção 2: Banco Externo
```yaml
# render.yaml - variáveis de ambiente
envVars:
  - key: DATABASE_URL
    value: postgresql://user:pass@host:port/database
  - key: NODE_ENV
    value: production
```

## 📊 Benefícios das Soluções

### ✅ Dados de Exemplo Automáticos:
- Wiki sempre tem conteúdo para demonstração
- Visitantes veem funcionalidades reais
- Não requer configuração extra
- Funciona com SQLite temporário

### ✅ PostgreSQL:
- **Persistência real** - dados nunca são perdidos
- **Performance superior** para múltiplos usuários
- **Escalabilidade** - suporta crescimento
- **Recursos avançados** - indexação, queries complexas

## 🔧 Estado Atual

- ✅ **Seeder implementado** e integrado ao `database.js`
- ✅ **PostgreSQL dependency** adicionada
- ✅ **Documentação completa** criada
- 🔄 **Próximo**: Commit e deploy para teste

## 💡 Recomendação

Para **demonstração/MVP**: Use a solução de dados automáticos (já implementada)
Para **produção real**: Migre para PostgreSQL do Render ou banco externo

Os dados de exemplo incluem conteúdo real e relevante que demonstra todas as funcionalidades do sistema wiki.
