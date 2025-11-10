#!/bin/bash

# Script para aplicar regras de segurança do Firestore
# Execute este script após fazer login no Firebase CLI

echo "🔥 Aplicando regras de segurança do Firestore..."

# Verificar se o Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI não encontrado. Instalando..."
    npm install -g firebase-tools
fi

# Verificar se está logado
echo "🔐 Verificando autenticação..."
firebase login --no-localhost

# Aplicar as regras
echo "📋 Aplicando regras do Firestore..."
firebase deploy --only firestore:rules

echo "✅ Regras aplicadas com sucesso!"
echo ""
echo "📖 Instruções:"
echo "1. Se este é seu primeiro deploy, execute: firebase init"
echo "2. Se você já tem um projeto configurado, as regras foram aplicadas"
echo "3. Reinicie o app para testar as novas permissões"