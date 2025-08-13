# 🔄 FLUXO DE TRABALHO GIT - ZERO CONFLITOS

## ⚡ **PROCEDIMENTO PARA COMMITS FUTUROS**

### **ANTES DE COMEÇAR A TRABALHAR (SEMPRE)**
```bash
# 1. Puxar as últimas mudanças
git pull origin wiki

# 2. Se houver conflitos, usar SEMPRE nossa versão
git checkout --ours .
git add .
git commit -m "resolve: mantendo versão local"
```

### **FAZENDO COMMITS (ROTINA DIÁRIA)**
```bash
# 1. Verificar status
git status

# 2. Adicionar mudanças
git add .

# 3. Commit com mensagem descritiva
git commit -m "feat: descrição das mudanças"

# 4. Push SEMPRE com force-with-lease (seguro)
git push --force-with-lease origin wiki
```

### **SE DER CONFLITO (EMERGÊNCIA)**
```bash
# 1. Abortar qualquer merge em andamento
git merge --abort

# 2. Reset completo
git reset --hard HEAD

# 3. Force push definitivo
git push --force origin wiki
```

## 🛡️ **PREVENÇÃO DE CONFLITOS**

### **Regra de Ouro:**
- **NUNCA use `git pull` sem parâmetros**
- **SEMPRE use `git pull --rebase origin wiki`** 
- **Em caso de dúvida, use `--force-with-lease`**

### **Comandos Seguros:**
```bash
# Pull seguro (rebase ao invés de merge)
git pull --rebase origin wiki

# Push seguro (force com verificação)
git push --force-with-lease origin wiki

# Emergency override (quando tudo der errado)
git push --force origin wiki
```

## 📋 **WORKFLOW COMPLETO DIÁRIO**

### **1. INÍCIO DO DIA**
```bash
git pull --rebase origin wiki
```

### **2. DURANTE O TRABALHO**
```bash
# A cada mudança importante:
git add .
git commit -m "wip: descrição do progresso"
```

### **3. FIM DO DIA/FEATURE**
```bash
git add .
git commit -m "feat: funcionalidade completa"
git push --force-with-lease origin wiki
```

## 🚨 **COMANDOS DE EMERGÊNCIA**

### **Se Git Travou Completamente:**
```bash
# Reset total e força
git reset --hard HEAD
git clean -fd
git push --force origin wiki
```

### **Se Repositório Remoto Está Bagunçado:**
```bash
# Sobrescrever TUDO no remoto
git push --force origin wiki
```

## ✅ **BENEFÍCIOS DESTE FLUXO:**
- ✅ Zero conflitos de merge
- ✅ Histórico limpo
- ✅ Versão local sempre prioritária
- ✅ Deploy automático no Render.com
- ✅ Backup automático no GitHub

## 🎯 **RESUMO EXECUTIVO:**
1. **Use sempre `--force-with-lease`** para push
2. **Use sempre `--rebase`** para pull  
3. **Em caso de conflito, SEMPRE mantenha versão local**
4. **Commit frequente, push no final do dia**

**NUNCA MAIS CONFLITOS! 🚀**
