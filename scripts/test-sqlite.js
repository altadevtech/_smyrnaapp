/**
 * Script para testar se o SQLite3 está funcionando corretamente
 * Útil para debug de problemas de bindings
 */

import sqlite3 from 'sqlite3';

console.log('🧪 Testando SQLite3...');

try {
  console.log('📦 sqlite3 importado com sucesso!');
  const sqlite3Verbose = sqlite3.verbose();
  
  // Testar criação de banco em memória
  console.log('🗄️ Testando criação de banco em memória...');
  const db = new sqlite3Verbose.Database(':memory:', (err) => {
    if (err) {
      console.error('❌ Erro ao criar banco em memória:', err.message);
      process.exit(1);
    } else {
      console.log('✅ Banco em memória criado com sucesso!');
      
      // Testar criação de tabela
      console.log('📋 Testando criação de tabela...');
      db.run('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)', (err) => {
        if (err) {
          console.error('❌ Erro ao criar tabela:', err.message);
          process.exit(1);
        } else {
          console.log('✅ Tabela criada com sucesso!');
          
          // Testar inserção
          console.log('📝 Testando inserção de dados...');
          db.run('INSERT INTO test (name) VALUES (?)', ['Teste'], function(err) {
            if (err) {
              console.error('❌ Erro ao inserir dados:', err.message);
              process.exit(1);
            } else {
              console.log('✅ Dados inseridos com sucesso! ID:', this.lastID);
              
              // Testar consulta
              console.log('🔍 Testando consulta...');
              db.get('SELECT * FROM test WHERE id = ?', [this.lastID], (err, row) => {
                if (err) {
                  console.error('❌ Erro ao consultar dados:', err.message);
                  process.exit(1);
                } else {
                  console.log('✅ Consulta bem-sucedida!');
                  console.log('📊 Resultado:', row);
                  
                  // Fechar banco
                  db.close((err) => {
                    if (err) {
                      console.error('❌ Erro ao fechar banco:', err.message);
                      process.exit(1);
                    } else {
                      console.log('✅ Banco fechado com sucesso!');
                      console.log('🎉 Todos os testes passaram! SQLite3 está funcionando corretamente.');
                      process.exit(0);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
  
} catch (error) {
  console.error('❌ Erro crítico ao importar sqlite3:', error.message);
  
  if (error.message.includes('bindings')) {
    console.log('🔧 Erro de bindings detectado!');
    console.log('💡 Possíveis soluções:');
    console.log('1. npm rebuild sqlite3');
    console.log('2. npm rebuild sqlite3 --build-from-source');
    console.log('3. npm uninstall sqlite3 && npm install sqlite3');
    console.log('4. rm -rf node_modules && npm install');
  }
  
  process.exit(1);
}
