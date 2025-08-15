#!/usr/bin/env node

/**
 * Script para corrigir dependências do esbuild no Render.com
 * Este script força a instalação das dependências binárias necessárias
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

console.log('🔧 Corrigindo dependências do esbuild...');

try {
  // Verificar se estamos em ambiente de produção
  const isProduction = process.env.NODE_ENV === 'production';
  const isRender = process.env.RENDER === 'true';
  
  console.log(`Ambiente: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
  console.log(`Render: ${isRender ? 'SIM' : 'NÃO'}`);

  // Forçar reinstalação do esbuild com todas as dependências
  console.log('📦 Reinstalando esbuild...');
  execSync('npm uninstall esbuild @esbuild/linux-x64', { stdio: 'inherit' });
  
  console.log('📦 Instalando esbuild com dependências opcionais...');
  execSync('npm install esbuild --save-exact --include=optional', { stdio: 'inherit' });
  
  // Instalar dependências específicas do Linux se necessário
  if (process.platform === 'linux' || isRender) {
    console.log('🐧 Instalando dependências específicas do Linux...');
    execSync('npm install @esbuild/linux-x64 --save-optional', { stdio: 'inherit' });
  }

  // Verificar se o esbuild está funcionando
  console.log('✅ Testando esbuild...');
  try {
    execSync('npx esbuild --version', { stdio: 'inherit' });
    console.log('✅ Esbuild funcionando corretamente!');
  } catch (error) {
    console.error('❌ Erro ao testar esbuild:', error.message);
    process.exit(1);
  }

  console.log('🎉 Dependências do esbuild corrigidas com sucesso!');

} catch (error) {
  console.error('❌ Erro ao corrigir dependências do esbuild:', error.message);
  process.exit(1);
}
