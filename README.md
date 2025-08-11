# Sistema WIKI leve, flexível e eficiente com React e Node.js

Este projeto nasceu como um CMS simples e robusto, desenvolvido com React no frontend e Node.js no backend, utilizando SQLite como banco de dados local. Agora, evolui com uma nova proposta: tornar-se uma plataforma WIKI moderna, ideal para equipes, comunidades ou projetos que precisam documentar e compartilhar conhecimento de forma estruturada, colaborativa e segura.

Construído com tecnologias consolidadas e boas práticas de desenvolvimento, o sistema mantém seu compromisso com performance, leveza e segurança, enquanto incorpora recursos essenciais para uma WIKI funcional e escalável.

### Principais funcionalidades planejadas:
✅ Editor de conteúdo com suporte a Markdown e rich text  
✅ Sistema de versionamento de páginas  
✅ Histórico de edições com comparação de versões  
✅ Pesquisa inteligente com destaque de termos  
✅ Organização hierárquica por categorias e tags  
✅ Controle de acesso e permissões por usuário  
✅ Sistema de comentários e discussões por página  
✅ Dashboard com estatísticas de uso e contribuições  
✅ Modo offline com sincronização local  
✅ Exportação de conteúdo em formatos como PDF e HTML  

O projeto está em constante evolução e aberto a sugestões da comunidade. Se você busca uma solução WIKI leve, moderna e personalizável, este sistema pode ser o ponto de partida ideal.

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
- **🆕 Sistema de menus hierárquicos**: Navegação moderna com dropdown e submenus

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

### 🧭 Sistema de Menus Hierárquicos
- **Menus multinível**: Suporte a submenus e páginas filhas
- **Navegação moderna**: Dropdown com hover/click responsivo
- **Links opcionais**: Itens pai podem ter ou não links para páginas
- **Design responsivo**: Menu hamburger para dispositivos móveis
- **Animações suaves**: Transições CSS modernas
- **Controle granular**: Admin completo via interface administrativa

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
- **🆕 Menus**: Sistema hierárquico com dropdown e submenus responsivos

### Administração
- **Dashboard**: Estatísticas e atividade recente
- **Usuários**: Gerenciamento completo (apenas admins)
- **Permissões**: Controle granular de acesso
- **🆕 Templates**: Criação e edição de templates (apenas admins)
- **🆕 Editor visual**: Interface drag-and-drop para widgets
- **🆕 Menus**: Gerenciamento completo de menus hierárquicos

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

### 🆕 Sistema de Menus Hierárquicos Avançado

#### Funcionalidades Principais:
- **🌳 Estrutura hierárquica**: Menus pais e filhos com múltiplos níveis
- **🔗 Links opcionais**: Itens pai podem funcionar como links OU apenas organizadores
- **📱 Design responsivo**: Dropdown desktop + menu hamburger mobile
- **🎨 Animações modernas**: Transições CSS suaves e feedback visual
- **⚡ Performance otimizada**: Carregamento dinâmico da estrutura de menus

#### Comportamentos por Dispositivo:

**💻 Desktop (Menu Horizontal):**
- Hover no item pai → abre dropdown automaticamente
- Itens com página vinculada → clicáveis + dropdown
- Itens organizadores → apenas dropdown (sem link)
- Click fora → fecha dropdown
- Animações de rotação nos ícones

**📱 Mobile (Menu Vertical):**
- Menu hamburger com slide suave
- Toque no item pai com link → navega para página
- Botão toggle separado → abre/fecha submenu
- Expansão/contração animada dos submenus
- Navegação por níveis com ícones indicativos

#### Configurações Administrativas:
- **Título**: Nome exibido no menu
- **URL Externa**: Link direto para URL externa
- **Página Vinculada**: Associação com páginas do sistema
- **Ícone**: Classe CSS para ícones (ex: FontAwesome)
- **Target**: `_blank`, `_self`, etc.
- **CSS Class**: Classes customizadas
- **Ordem**: Posicionamento via drag-and-drop
- **Status**: Ativo/Inativo
- **Menu Pai**: Definição da hierarquia

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

### 🆕 Tabela: menus
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- url (TEXT)
- page_slug (TEXT)
- target (TEXT)
- icon (TEXT)
- css_class (TEXT)
- parent_id (INTEGER FK)
- sort_order (INTEGER)
- status (TEXT: 'active' | 'inactive')
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

### 🆕 Menus
- `GET /api/menus` - Lista todos os menus
- `GET /api/menus/hierarchy` - Estrutura hierárquica dos menus
- `GET /api/menus/:id` - Busca menu específico
- `POST /api/menus` - Cria novo menu
- `PUT /api/menus/:id` - Atualiza menu
- `DELETE /api/menus/:id` - Remove menu
- `PATCH /api/menus/:id/order` - Reordena menus

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

### 🆕 MainMenu.jsx
Componente de navegação hierárquica moderno:
- **Dropdown inteligente**: Hover/click responsivo
- **Links opcionais**: Itens pai podem ter ou não links
- **Design responsivo**: Menu hamburger para mobile
- **Animações**: Transições CSS suaves
- **Acessibilidade**: ARIA labels e navegação por teclado

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

## 🚧 Melhorias Futuras
- [ ] Substituição do Editor de texto rico (WYSIWYG) por uma ferramenta de edição via blocos
- [x] **Sistema de Menu Hierárquico** ✅ (CONCLUÍDO - os menus agora são hierarquizados com dropdown moderno e responsivo)
- [ ] Implantação de templates com estrutura de blocos (ideia inspirada no Elementor, para facilitar a edição do layout por parte dos usuários sem conhecimento de HTML. A proposta será o usuário poder estruturar um layout apenas arrastando componentes e interindo o conteúdo)
- [ ] Aprimoramento do chaveanto dos temas BLACK e WHITE, abrangendo todos os elementos HTML
- [ ] Ajuste responsivo das tabelas na área administrativa
- [ ] Upload e gerenciamento de imagens
- [ ] Galeria de Imagens
- [ ] Sistema de tags e categorias
- [ ] SEO otimização
- [ ] Cache e performance
- [ ] Temas personalizáveis
- [ ] Backup automatizado
- [ ] Logs de auditoria
- [ ] API documentation (Swagger)
- [ ] Testes automatizados

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
