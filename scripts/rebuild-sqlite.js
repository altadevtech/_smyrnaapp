/**
 * Script para rebuild do SQLite3 em ambiente de produção
 * Garante que os bindings nativos sejam compilados corretamente
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function rebuildSQLite() {
  console.log('🔧 Iniciando rebuild do SQLite3...');

  try {
    // Navegar para o diretório do projeto
    const projectDir = path.resolve(__dirname, '..');
    process.chdir(projectDir);
    
    console.log(`📁 Diretório do projeto: ${projectDir}`);
    
    // Verificar se node_modules existe
    const nodeModulesPath = path.join(projectDir, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('📦 node_modules não encontrado, executando npm install...');
      execSync('npm install', { stdio: 'inherit' });
    }
    
    // Verificar se sqlite3 está instalado
    const sqlite3Path = path.join(nodeModulesPath, 'sqlite3');
    if (!fs.existsSync(sqlite3Path)) {
      console.log('📦 SQLite3 não encontrado, instalando...');
      execSync('npm install sqlite3', { stdio: 'inherit' });
    }
    
    // Remover bindings existentes (se houver)
    const bindingsPath = path.join(sqlite3Path, 'lib', 'binding');
    if (fs.existsSync(bindingsPath)) {
      console.log('🗑️ Removendo bindings antigos...');
      execSync(`rm -rf "${bindingsPath}"`, { stdio: 'inherit' });
    }
    
    // Rebuild SQLite3 com força total
    console.log('🔨 Rebuilding SQLite3 com --build-from-source...');
    execSync('npm rebuild sqlite3 --build-from-source', { 
      stdio: 'inherit',
      env: { 
        ...process.env, 
        npm_config_build_from_source: 'true',
        npm_config_sqlite: '/usr',
        PYTHON: '/usr/bin/python3'
      }
    });
  
  console.log('✅ SQLite3 rebuilded com sucesso!');
  
  // Verificar se o rebuild funcionou
  try {
    // Para ES modules, usar import dinâmico
    const sqlite3Module = await import('sqlite3');
    const sqlite3 = sqlite3Module.default;
    console.log('✅ Verificação: SQLite3 carregado corretamente!');
  } catch (testError) {
    console.warn('⚠️ Aviso: Erro ao testar SQLite3 após rebuild:', testError.message);
  }
  
} catch (error) {
  console.error('❌ Erro durante rebuild do SQLite3:', error.message);
  
  // Fallback: tentar métodos alternativos
  console.log('🔄 Tentando métodos alternativos...');
  
  try {
    // Método 1: npm rebuild simples
    console.log('📝 Método 1: npm rebuild simples...');
    execSync('npm rebuild sqlite3', { stdio: 'inherit' });
    console.log('✅ Método 1 bem-sucedido!');
  } catch (method1Error) {
    console.error('❌ Método 1 falhou:', method1Error.message);
    
    try {
      // Método 2: Reinstalar completamente
      console.log('📝 Método 2: Reinstalação completa...');
      execSync('npm uninstall sqlite3', { stdio: 'inherit' });
      execSync('npm install sqlite3', { stdio: 'inherit' });
      console.log('✅ Método 2 bem-sucedido!');
    } catch (method2Error) {
      console.error('❌ Método 2 também falhou:', method2Error.message);
      console.error('❌ Todos os métodos de rebuild falharam!');
      process.exit(1);
    }
  }
}

// Executar a função
rebuildSQLite().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
})};
