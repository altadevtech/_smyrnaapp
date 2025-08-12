# Smyrna Wiki - Instruções de Instalação 

## ✅ Projeto em fase de desenvolvimento
Para implementação futura:
1. Sistema de Menu Recursivo (os menus poderão ser hierarquizados e será possível criar novas páginas filhas e submenus)
2. Implantação de templates com estrutura de blocos (ideia inspirada no Elementor, para facilitar a edição do layout por parte dos usuários sem conhecimento de HTML. A proposta será o usuário poder estruturar um layout apenas arrastando componentes e interindo o conteúdo)
3. Aprimoramento do chaveanto dos temas BLACK e WHITE, abrangendo todos os elementos HTML
4. Ajuste responsivo das tabelas na área administrativa

## Instruções de Instalação 
### 1. Verificar Node.js

Certifique-se que o Node.js está instalado:

```bash
node --version
npm --version
```

Se não estiver instalado:
1. **Visite**: https://nodejs.org/
2. **Baixe** a versão LTS (recomendada)
3. **Execute** o instalador e siga as instruções
4. **Reinicie** o VS Code após a instalação

### 2. Instalar Dependências

```bash
npm install
```

### 3. Executar o Projeto

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Acessar o Sistema
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api

### 5. Fazer Login
Use um dos usuários padrão:

**Admin:**
- Email: admin@smyrna.com
- Senha: admin123

**Editor:**
- Email: editor@smyrna.com  
- Senha: editor123

## 🏗️ Arquitetura do Projeto

✅ **Frontend React v18:**
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

## 🎯 Para rodar local
1. Instale o Node.js
2. Execute `npm install`
3. Inicie os servidores
4. Faça login e explore o sistema
5. Comece a criar conteúdo!


## 🔧 Problemas Identificados
1. Erro ao trocar o tema Dark e Light (parte dos elementos HTML não são afetados)
2. Falta de recursividade no menu

### ❓ Porta em uso
**Solução**: Se as portas 3000 ou 5000 estiverem em uso, você pode alterar no código ou encerrar os processos existentes.
