# 🚀 Deploy no Render.com - Smyrna Wiki

## ✅ Correções Implementadas

### Problemas Resolvidos:
1. **ES Module Error**: Scripts convertidos para usar `import/export` ao invés de `require`
2. **Port Configuration**: Porta alterada de 5000 para 10000 (padrão Render)
3. **SQLite Rebuild**: Script otimizado para ambiente de produção
4. **API URLs**: Configuração automática para produção
5. **Rollup Linux Error**: Dependências nativas corrigidas para ambiente Linux ✅

### Erro Rollup Corrigido:
```
Cannot find module @rollup/rollup-linux-x64-gnu
```
**✅ SOLUÇÃO:** Script automático de correção de dependências + configuração específica

## Pré-requisitos
- Conta no [Render.com](https://render.com)
- Código no GitHub/GitLab
- Projeto configurado localmente

## Passos para Deploy

### 1. Preparar o Repositório
Certifique-se que os seguintes arquivos estão commitados:
- `render.yaml` - Configuração do Render ✅
- `package.json` - Com scripts `start` e `render-build` ✅
- `.env.example` - Exemplo de variáveis de ambiente ✅
- `scripts/rebuild-sqlite.js` - Script ES Module ✅

### 2. Conectar no Render
1. Acesse [render.com](https://render.com) e faça login
2. Clique em "New +" > "Web Service"
3. Conecte seu repositório GitHub/GitLab
4. Selecione o repositório `smyrnaapp`

### 3. Configuração do Serviço
O Render irá detectar automaticamente o arquivo `render.yaml` com estas configurações:

- **Name**: smyrna-wiki
- **Environment**: Node
- **Region**: Oregon
- **Plan**: Free (pode ser alterado depois)
- **Build Command**: `npm run render-build`
- **Start Command**: `npm run server`

### 4. Variáveis de Ambiente
As seguintes variáveis serão configuradas automaticamente:
- `NODE_ENV=production`
- `PORT=10000` ✅ (corrigido)
- `JWT_SECRET=` (gerado automaticamente)
- `DB_PATH=./server/smyrna.db`
- `npm_config_build_from_source=true` ✅
- `npm_config_sqlite=/usr` ✅
- `PYTHON=/usr/bin/python3` ✅

### 5. Deploy
1. Clique em "Create Web Service"
2. O Render irá:
   - Instalar dependências (`npm install`)
   - Rebuildar SQLite3 (`npm run rebuild-sqlite`) ✅
   - Fazer build do frontend (`npm run build`)
   - Iniciar o servidor (`npm run server`)

### 6. Verificar Deploy
- Health check: `https://seu-app.onrender.com/api/health`
- Login admin: `admin@smyrna.com` / `admin123`
- Login editor: `editor@smyrna.com` / `editor123`

## Configurações Importantes

### Build Command
```bash
npm install && npm run build
```
Executa: `npm install` e depois `vite build` com esbuild

### Start Command
```bash
npm run server
```
Executa: `node server/server.js`

### Health Check
O endpoint `/api/health` retorna:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Banco de Dados
- SQLite persistente através do disco montado
- Backup automático via snapshot do Render
- Criação automática de usuários padrão

## Domínio Personalizado
1. No dashboard do Render, vá em "Settings"
2. Clique em "Custom Domains"
3. Adicione seu domínio
4. Configure DNS: `CNAME` apontando para `seu-app.onrender.com`

## Monitoramento
- **Logs**: Dashboard do Render > "Logs"
- **Metrics**: Dashboard do Render > "Metrics"
- **Events**: Dashboard do Render > "Events"

## Troubleshooting

### ❌ Build Falha
- Verifique logs de build no dashboard
- Certifique-se que `package.json` tem script `render-build`

### ❌ App Não Inicia
- Verifique logs de runtime
- Confirme que porta está configurada como `process.env.PORT`

### ❌ Erro SQLite3 "invalid ELF header"
**✅ Solução**: Este erro é corrigido automaticamente pelo script `render-postbuild` que recompila o SQLite3 para a arquitetura do Render:
```bash
npm rebuild sqlite3 --build-from-source
```

### ❌ Banco de Dados
- Verifique se o caminho DB_PATH está correto
- Confirme se o SQLite3 foi recompilado corretamente

## Build Command Detalhado
```bash
npm ci && npm run render-postbuild && npm run build
```
- `npm ci`: Instalação limpa das dependências
- `npm run render-postbuild`: Recompila SQLite3 para arquitetura do Render
- `npm run build`: Build do frontend com Vite

## Custos
- **Free Plan**: Incluso, com limitações
- **Starter Plan**: $7/mês para melhor performance
- **Disco Persistente**: $1/GB/mês

## Support
- [Documentação Render](https://render.com/docs)
- [Community Forum](https://community.render.com)
- Dashboard > "Help" para support tickets

---

✅ **Após o deploy bem-sucedido, seu CMS estará disponível em**: `https://seu-app.onrender.com`
