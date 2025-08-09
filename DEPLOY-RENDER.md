# 🚀 Deploy no Render.com - Smyrna CMS

## Pré-requisitos
- Conta no [Render.com](https://render.com)
- Código no GitHub/GitLab
- Projeto configurado localmente

## Passos para Deploy

### 1. Preparar o Repositório
Certifique-se que os seguintes arquivos estão commitados:
- `render.yaml` - Configuração do Render
- `package.json` - Com scripts `start` e `render-build`
- `.env.example` - Exemplo de variáveis de ambiente

### 2. Conectar no Render
1. Acesse [render.com](https://render.com) e faça login
2. Clique em "New +" > "Web Service"
3. Conecte seu repositório GitHub/GitLab
4. Selecione o repositório `smyrnaapp`

### 3. Configuração do Serviço
O Render irá detectar automaticamente o arquivo `render.yaml` com estas configurações:

- **Name**: smyrna-cms
- **Environment**: Node
- **Region**: Oregon
- **Plan**: Free (pode ser alterado depois)
- **Build Command**: `npm run render-build`
- **Start Command**: `npm run server`

### 4. Variáveis de Ambiente
As seguintes variáveis serão configuradas automaticamente:
- `NODE_ENV=production`
- `PORT=10000`
- `JWT_SECRET=` (gerado automaticamente)
- `DB_PATH=./server/smyrna.db`

### 5. Deploy
1. Clique em "Create Web Service"
2. O Render irá:
   - Instalar dependências (`npm install`)
   - Fazer build do frontend (`npm run build`)
   - Iniciar o servidor (`npm run server`)

### 6. Verificar Deploy
- Health check: `https://seu-app.onrender.com/api/health`
- Login admin: `admin@smyrna.com` / `admin123`
- Login editor: `editor@smyrna.com` / `editor123`

## Configurações Importantes

### Build Command
```bash
npm run render-build
```
Executa: `npm install && npm run build`

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

### Build Falha
- Verifique logs de build no dashboard
- Certifique-se que `package.json` tem script `render-build`

### App Não Inicia
- Verifique logs de runtime
- Confirme que porta está configurada como `process.env.PORT`

### Banco de Dados
- Verifique se o disco persistente está montado
- Confirme permissões de escrita na pasta `server`

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
