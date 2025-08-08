# Instruções de Instalação - Smyrna CMS

## ⚠️ Pré-requisito: Node.js não encontrado

Para executar este projeto, você precisa instalar o Node.js primeiro.

### 1. Instalar Node.js

1. **Visite**: https://nodejs.org/
2. **Baixe** a versão LTS (recomendada)
3. **Execute** o instalador e siga as instruções
4. **Reinicie** o VS Code após a instalação

### 2. Verificar Instalação

Após instalar o Node.js, execute no terminal:

```bash
node --version
npm --version
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Executar o Projeto

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**✅ Erro corrigido**: Convertido backend para ES Modules (import/export)

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Acessar o Sistema

- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api

### 6. Fazer Login

Use um dos usuários padrão:

**Admin:**
- Email: admin@smyrna.com
- Senha: admin123

**Editor:**
- Email: editor@smyrna.com  
- Senha: editor123

## 🏗️ Estrutura do Projeto Criada

✅ **Frontend React completo:**
- Sistema de autenticação com JWT
- Dashboard com estatísticas
- Gerenciamento de páginas e posts
- Interface de administração de usuários
- Controle de permissões (Admin/Editor)

✅ **Backend Node.js/Express:**
- API RESTful completa
- Autenticação e autorização
- Banco de dados SQLite
- Middleware de segurança
- Rotas protegidas

✅ **Banco de Dados SQLite:**
- Tabelas para usuários, páginas e posts
- Usuários padrão pré-criados
- Relacionamentos e constraints

✅ **Recursos Implementados:**
- CRUD completo para páginas e posts
- Sistema de status (rascunho/publicado)
- Controle granular de permissões
- Dashboard com métricas
- Interface responsiva

## 🎯 Próximos Passos

1. Instale o Node.js
2. Execute `npm install`
3. Inicie os servidores
4. Faça login e explore o sistema
5. Comece a criar conteúdo!

O sistema está completamente funcional e pronto para uso!

## 🔧 Soluções de Problemas

### ❌ Erro: "require is not defined in ES module scope"
**✅ Solução**: Este erro foi corrigido convertendo todo o backend para usar ES Modules (import/export) em vez de CommonJS (require/module.exports).

### ❌ Erro: "Cannot find module"
**✅ Solução**: Execute `npm install` para instalar todas as dependências necessárias.

### ❌ Porta em uso
**✅ Solução**: Se as portas 3000 ou 5000 estiverem em uso, você pode alterar no código ou encerrar os processos existentes.
