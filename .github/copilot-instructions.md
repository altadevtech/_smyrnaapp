# Instruções do Projeto - Smyrna CMS

## Visão Geral
Este é um sistema de gerenciamento de conteúdo (CMS) desenvolvido com React no frontend e Node.js/Express no backend, utilizando SQLite como banco de dados.

## Arquitetura
- **Frontend**: React 18 com Vite, React Router, Axios, React Hook Form
- **Backend**: Node.js com Express, SQLite3, JWT para autenticação
- **Autenticação**: JWT com middleware personalizado
- **Banco de Dados**: SQLite local com tabelas para usuários, páginas e posts

## Estrutura de Permissões
- **Admin**: Pode criar, editar, excluir e gerenciar todos os conteúdos e usuários
- **Editor**: Pode criar, editar e excluir apenas seu próprio conteúdo

## Funcionalidades Principais
1. **Autenticação**: Login com JWT, middleware de proteção de rotas
2. **Gerenciamento de Usuários**: CRUD completo (apenas admins)
3. **Páginas**: CRUD com controle de status (publicado/rascunho)
4. **Posts**: CRUD com controle de status e exibição cronológica
5. **Dashboard**: Estatísticas e atividade recente

## Usuários Padrão
- **Admin**: admin@smyrna.com / admin123
- **Editor**: editor@smyrna.com / editor123

## Comandos Úteis
- `npm run dev`: Inicia o frontend (porta 3000)
- `npm run server:dev`: Inicia o backend com nodemon (porta 5000)
- `npm run build`: Build de produção
- `npm run server`: Inicia servidor de produção

## Padrões de Código
- Use React hooks funcionais
- Implementar tratamento de erros adequado
- Validar dados no frontend e backend
- Seguir padrões REST para APIs
- Manter separação clara entre responsabilidades

## Melhorias Futuras
- Editor de texto rico (WYSIWYG)
- Upload de imagens
- SEO otimização
- Cache e performance
- Temas e customização
