#!/usr/bin/env node
/**
 * Script para corrigir problemas de dependências do Rollup no Render.com
 * Resolve o problema: Cannot find module @rollup/rollup-linux-x64-gnu
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Corrigindo dependências para Render.com...');

try {
  // 1. Limpar cache npm
  console.log('🧹 Limpando cache npm...');
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️ Erro ao limpar cache (pode ser ignorado):', error.message);
  }

  // 2. Remover node_modules e package-lock.json se existirem
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  const packageLockPath = path.join(__dirname, '..', 'package-lock.json');

  if (fs.existsSync(nodeModulesPath)) {
    console.log('🗑️ Removendo node_modules...');
    execSync('rm -rf node_modules', { stdio: 'inherit' });
  }

  if (fs.existsSync(packageLockPath)) {
    console.log('🗑️ Removendo package-lock.json...');
    execSync('rm -f package-lock.json', { stdio: 'inherit' });
  }

  // 3. Instalar dependências com força
  console.log('📦 Instalando dependências com --force...');
  execSync('npm install --force --no-optional', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_optional: 'false',
      npm_config_fund: 'false',
      npm_config_audit: 'false'
    }
  });

  // 4. Instalar especificamente o rollup para Linux
  console.log('🎯 Instalando rollup específico para Linux...');
  try {
    execSync('npm install @rollup/rollup-linux-x64-gnu --save-optional --force', { 
      stdio: 'inherit' 
    });
  } catch (error) {
    console.warn('⚠️ Erro ao instalar rollup Linux (tentativa alternativa):', error.message);
    
    // Tentativa alternativa
    try {
      execSync('npm install rollup@latest --force', { stdio: 'inherit' });
      console.log('✅ Rollup instalado via método alternativo');
    } catch (altError) {
      console.error('❌ Falha em ambos os métodos de instalação do rollup');
    }
  }

  // 5. Rebuild completo
  console.log('🔨 Fazendo rebuild completo...');
  execSync('npm rebuild', { stdio: 'inherit' });

  console.log('✅ Correção de dependências concluída!');

} catch (error) {
  console.error('❌ Erro durante correção de dependências:', error.message);
  
  // Fallback: instalação básica
  console.log('🔄 Tentando instalação básica como fallback...');
  try {
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    console.log('✅ Fallback bem-sucedido!');
  } catch (fallbackError) {
    console.error('❌ Fallback também falhou:', fallbackError.message);
    process.exit(1);
  }
}
