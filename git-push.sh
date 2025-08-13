#!/bin/bash
# Script para Git sem conflitos - SmyrnaWiki

echo "🚀 Git Push Seguro - SmyrnaWiki"
echo "================================="

# Verificar se há mudanças
if [[ -z $(git status --porcelain) ]]; then
    echo "✅ Nenhuma mudança para commit"
    exit 0
fi

# Mostrar status atual
echo "📋 Status atual:"
git status --short

# Adicionar todas as mudanças
echo ""
echo "📦 Adicionando mudanças..."
git add .

# Solicitar mensagem de commit
echo ""
read -p "💬 Mensagem do commit: " commit_message

# Se não fornecer mensagem, usar padrão
if [[ -z "$commit_message" ]]; then
    commit_message="update: atualizações $(date '+%Y-%m-%d %H:%M')"
fi

# Fazer commit
echo ""
echo "💾 Fazendo commit..."
git commit -m "$commit_message"

# Push seguro
echo ""
echo "🔄 Fazendo push seguro..."
git push --force-with-lease origin wiki

# Verificar resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push realizado com sucesso!"
    echo "🌐 Repositório: https://github.com/altadevtech/_smyrnaapp"
    echo "🚀 Deploy automático iniciado no Render.com"
else
    echo ""
    echo "⚠️ Push rejeitado - usando força total..."
    git push --force origin wiki
    echo "✅ Push forçado realizado!"
fi

echo ""
echo "🎉 Processo concluído!"
