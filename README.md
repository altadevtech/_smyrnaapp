# Smyrna CMS

Sistema de gerenciamento de conteúdo (CMS) simples e eficiente desenvolvido com React e Node.js, utilizando SQLite como banco de dados local. O sistema já nasce com a ambição de ser a opção a ser adotada por aqueles que precisam de um sistema flexível, robusto, performático e leve. Desenvolvido com as tecnologias mais eficientes e consolidadas da atualidade e boas práticas de segurança e programação, nosso sistema ainda está em constante evolução. Sugestões serão muito bem vindas.

## 🚀 Características

- **Frontend moderno**: React 18 com Vite para desenvolvimento rápido
- **Backend robusto**: Node.js com Express e SQLite
- **Autenticação segura**: JWT com middleware de proteção
- **Controle de permissões**: Níveis Admin e Editor
- **Interface intuitiva**: Design responsivo e fácil de usar
- **Banco local**: SQLite para simplicidade e portabilidade
- **🆕 Templates dinâmicos**: Páginas configuráveis com layouts personalizados
- **🆕 Sistema de widgets**: 7 tipos de widgets configuráveis
- **🆕 Home dinâmica**: Página inicial configurável via admin

## 📋 Funcionalidades

### 🎯 Sistema de Páginas Dinâmicas
- Criação de páginas via Admin (incluindo Home)
- Sistema de slugs para URLs amigáveis
- Definição de página Home via checkbox
- Status de publicação (draft/published)

### 🎨 Sistema de Templates
- **Template 1**: Layout Básico (cabeçalho + conteúdo + rodapé)
- **Template 2**: Layout com Banner (banner + conteúdo + widgets laterais)
- **Template 3**: Layout Completo (seções flexíveis com widgets)
- Edição de templates existentes
- Criação de novos templates
- Configuração de cabeçalho/rodapé por template

### 🧩 Sistema de Widgets (7 tipos)
1. **Banner**: Imagem com texto e link
2. **News**: Feed de notícias/posts
3. **Login**: Formulário de login
4. **Contact**: Formulário de contato
5. **Image**: Galeria de imagens
6. **Video**: Player de vídeo
7. **Content**: Conteúdo HTML livre

### 🛠️ Área Admin
- Gerenciamento de páginas dinâmicas
- Editor de templates com preview
- Configuração de widgets por página
- Definição de layout via drag-and-drop

### Autenticação
- Login seguro com JWT
- Controle de sessão e tokens
- Proteção de rotas

### Gerenciamento de Conteúdo
- **Páginas**: Criação e edição de páginas estáticas e dinâmicas
- **Posts**: Sistema de blog com posts cronológicos
- **Status**: Controle de publicação (Rascunho/Publicado)
- **🆕 Templates**: Sistema de templates com blocos configuráveis
- **🆕 Widgets**: 7 tipos de widgets (Banner, Notícias, Login, Contato, Imagem, Vídeo, Conteúdo)
- **🆕 Slugs**: URLs amigáveis para SEO

### Administração
- **Dashboard**: Estatísticas e atividade recente
- **Usuários**: Gerenciamento completo (apenas admins)
- **Permissões**: Controle granular de acesso
- **🆕 Templates**: Criação e edição de templates (apenas admins)
- **🆕 Editor visual**: Interface drag-and-drop para widgets

### 🆕 Sistema de Templates e Widgets

#### Templates Disponíveis:
1. **Layout Básico** - Template simples com bloco de conteúdo
2. **Layout com Banner** - Banner principal + conteúdo
3. **Layout Completo** - Banner + notícias + conteúdo + contato

#### Widgets Configuráveis:
1. **🖼️ Widget Banner** - Imagens ou HTML customizado
2. **📰 Widget Notícias** - Lista automática de posts do blog
3. **🔐 Widget Login** - Formulário de acesso à área restrita
4. **📧 Widget Contato** - Formulário de contato completo
5. **🖼️ Widget Imagem** - Upload de imagens individuais com parâmetros configuráveis
6. **🎥 Widget Vídeo** - Vídeos do YouTube ou locais
7. **📝 Widget Conteúdo** - Editor HTML livre

#### 🆕 Shortcodes com Parâmetros:
Os widgets podem ser chamados com parâmetros personalizados:

**Widget de Imagem:**
```
[widget:image url="https://exemplo.com/imagem.jpg" title="Minha Imagem" alt="Descrição" caption="Legenda da imagem" borderRadius="8px"]
```

**Parâmetros disponíveis para Widget Imagem:**
- `url` ou `src`: URL da imagem
- `title`: Título exibido acima da imagem
- `alt`: Texto alternativo para acessibilidade
- `caption`: Legenda exibida abaixo da imagem
- `borderRadius`: Bordas arredondadas (ex: "8px", "50%")

## 🛠️ Tecnologias

### Frontend
- React 18
- React Router DOM
- Axios
- React Hook Form
- React Hot Toast
- Lucide React (ícones)
- Vite

### Backend
- Node.js
- Express
- SQLite3
- bcryptjs
- jsonwebtoken
- cors

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone ou navegue até o diretório do projeto**
```bash
cd smyrnaapp
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor backend**
```bash
npm run server:dev
```

4. **Em outro terminal, inicie o frontend**
```bash
npm run dev
```

5. **Acesse o sistema**
- Frontend: http://localhost:3000
- API Backend: http://localhost:5000/api

## 👥 Usuários Padrão

O sistema vem com dois usuários pré-configurados:

### Admin
- **Email**: admin@smyrna.com
- **Senha**: admin123
- **Permissões**: Acesso total ao sistema

### Editor
- **Email**: editor@smyrna.com
- **Senha**: editor123
- **Permissões**: Criação e edição de conteúdo próprio

## 🗄️ Estrutura do Banco de Dados

### Tabela: users
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT UNIQUE)
- password (TEXT)
- role (TEXT: 'admin' | 'editor')
- status (TEXT: 'active' | 'inactive')
- created_at, updated_at (DATETIME)

### Tabela: pages
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- content (TEXT)
- status (TEXT: 'draft' | 'published')
- author_id (INTEGER FK)
- **🆕 template_id** (INTEGER FK)
- **🆕 widget_data** (JSON)
- **🆕 slug** (TEXT UNIQUE)
- **🆕 is_home** (BOOLEAN)
- created_at, updated_at (DATETIME)

### 🆕 Tabela: templates
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- description (TEXT)
- layout (JSON)
- is_default (BOOLEAN)
- show_header (BOOLEAN)
- show_footer (BOOLEAN)
- created_at, updated_at (DATETIME)

### 🆕 Tabela: widgets
- id (INTEGER PRIMARY KEY)
- type (TEXT)
- name (TEXT)
- config (JSON)
- created_at, updated_at (DATETIME)

### Tabela: posts
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- content (TEXT)
- status (TEXT: 'draft' | 'published')
- author_id (INTEGER FK)
- created_at, updated_at (DATETIME)

## 🔐 Sistema de Permissões

### Admin
- Criar, editar, excluir qualquer conteúdo
- Gerenciar usuários (criar, editar, desativar)
- Acesso a todas as estatísticas
- Controle total do sistema

### Editor
- Criar, editar, excluir apenas seu próprio conteúdo
- Visualizar estatísticas básicas
- Acesso limitado ao dashboard

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia frontend (Vite)
npm run server:dev   # Inicia backend com nodemon

# Produção
npm run build        # Build do frontend
npm run server       # Inicia servidor de produção
npm run preview      # Preview do build

# Lint
npm run lint         # Executa ESLint
```

## 🌐 API Endpoints

### 🆕 Templates
- `GET /api/templates` - Lista todos os templates
- `GET /api/templates/:id` - Busca template específico
- `POST /api/templates` - Cria novo template
- `PUT /api/templates/:id` - Atualiza template
- `DELETE /api/templates/:id` - Remove template

### 🆕 Widgets
- `GET /api/widgets` - Lista todos os widgets
- `GET /api/widgets/:id` - Busca widget específico
- `POST /api/widgets` - Cria novo widget
- `PUT /api/widgets/:id` - Atualiza widget
- `DELETE /api/widgets/:id` - Remove widget

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `GET /api/auth/me` - Verificar autenticação

### Usuários (Admin only)
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Excluir usuário
- `PATCH /api/users/:id/status` - Alterar status

### Páginas 🆕 (Dinâmicas)
- `GET /api/pages/public` - Páginas públicas
- `GET /api/pages/home` - Página home atual
- `GET /api/pages/:slug` - Página por slug
- `GET /api/pages` - Listar páginas (auth)
- `GET /api/pages/:id` - Buscar página
- `POST /api/pages` - Criar página
- `PUT /api/pages/:id` - Atualizar página
- `DELETE /api/pages/:id` - Excluir página
- `PATCH /api/pages/:id/status` - Alterar status

### Posts
- `GET /api/posts/public` - Posts públicos
- `GET /api/posts` - Listar posts (auth)
- `GET /api/posts/:id` - Buscar post
- `POST /api/posts` - Criar post
- `PUT /api/posts/:id` - Atualizar post
- `DELETE /api/posts/:id` - Excluir post
- `PATCH /api/posts/:id/status` - Alterar status

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas

## 🚧 Melhorias Futuras

- [ ] Editor de texto rico (WYSIWYG)
- [ ] Upload e gerenciamento de imagens
- [ ] Sistema de tags e categorias
- [ ] SEO otimização
- [ ] Cache e performance
- [ ] Temas personalizáveis
- [ ] Backup automatizado
- [ ] Logs de auditoria
- [ ] API documentation (Swagger)
- [ ] Testes automatizados

## � Componentes Principais

### 🆕 Widget.jsx
Componente universal que renderiza todos os 7 tipos de widgets:
- **Banner**: Exibe imagem, título, descrição e link
- **News**: Feed dinâmico de posts/notícias
- **Login**: Formulário de autenticação
- **Contact**: Formulário de contato
- **Image**: Galeria de imagens
- **Video**: Player de vídeo embarcado
- **Content**: Conteúdo HTML livre

### 🆕 TemplateRenderer.jsx
Renderiza páginas dinamicamente com base no template selecionado:
- Carrega layout do template em JSON
- Posiciona widgets nas seções definidas
- Aplica configurações de cabeçalho/rodapé

### 🆕 Templates Padrão
**Template 1 - Layout Básico:**
```json
{
  "sections": [
    {"id": "header", "widgets": []},
    {"id": "content", "widgets": []},
    {"id": "footer", "widgets": []}
  ]
}
```

**Template 2 - Layout com Banner:**
```json
{
  "sections": [
    {"id": "banner", "widgets": []},
    {"id": "main", "widgets": []},
    {"id": "sidebar", "widgets": []}
  ]
}
```

**Template 3 - Layout Completo:**
```json
{
  "sections": [
    {"id": "header", "widgets": []},
    {"id": "hero", "widgets": []},
    {"id": "content", "widgets": []},
    {"id": "widgets", "widgets": []},
    {"id": "footer", "widgets": []}
  ]
}
```

## �📝 Licença
Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuições
Contribuições são bem-vindas! 

Por favor:
1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das suas mudanças
4. Faça push para a branch
5. Abra um Pull Request

## 📞 Suporte
Para suporte ou dúvidas, entre em contato comigo pelo e-mail contato@smyrnacore.com.br ou através do sistema de issues do projeto.

---

**Desenvolvido com ❤️ por Flávio Rodrigues em 08/2025 e em evolução constante**
