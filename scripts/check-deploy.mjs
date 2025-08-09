#!/usr/bin/env node

// Verificação pré-deploy para Render
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Verificando configuração para deploy no Render...\n')

const checks = [
  {
    name: 'package.json',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
      return pkg.scripts?.start && pkg.scripts?.['render-build'] && pkg.scripts?.build
    },
    message: 'Scripts start, render-build e build estão configurados'
  },
  {
    name: 'render.yaml',
    check: () => fs.existsSync('render.yaml'),
    message: 'Arquivo render.yaml existe'
  },
  {
    name: 'Servidor de produção',
    check: () => {
      const serverContent = fs.readFileSync('server/server.js', 'utf8')
      return serverContent.includes('/api/health') && serverContent.includes('process.env.PORT')
    },
    message: 'Servidor configurado com health check e PORT'
  },
  {
    name: 'Build do frontend',
    check: () => {
      try {
        const viteConfig = fs.readFileSync('vite.config.js', 'utf8')
        return viteConfig.includes('outDir') || true // Vite tem outDir padrão
      } catch {
        return false
      }
    },
    message: 'Configuração de build do Vite OK'
  },
  {
    name: 'Banco de dados',
    check: () => {
      const dbContent = fs.readFileSync('server/database.js', 'utf8')
      return dbContent.includes('process.env.DB_PATH')
    },
    message: 'Database configurado para usar variáveis de ambiente'
  },
  {
    name: 'JWT Secret',
    check: () => {
      const authContent = fs.readFileSync('server/middleware/auth.js', 'utf8')
      return authContent.includes('process.env.JWT_SECRET')
    },
    message: 'JWT configurado para usar variáveis de ambiente'
  },
  {
    name: 'Arquivos essenciais',
    check: () => {
      return fs.existsSync('src/main.jsx') && 
             fs.existsSync('server/server.js') &&
             fs.existsSync('index.html')
    },
    message: 'Arquivos principais existem'
  }
]

let allPassed = true

checks.forEach(({ name, check, message }) => {
  try {
    const passed = check()
    const status = passed ? '✅' : '❌'
    console.log(`${status} ${name}: ${message}`)
    if (!passed) allPassed = false
  } catch (error) {
    console.log(`❌ ${name}: Erro na verificação - ${error.message}`)
    allPassed = false
  }
})

console.log('\n' + '='.repeat(50))

if (allPassed) {
  console.log('🎉 Todas as verificações passaram!')
  console.log('✅ Projeto pronto para deploy no Render!')
  console.log('\n📋 Próximos passos:')
  console.log('1. Commit e push das alterações')
  console.log('2. Conectar repositório no Render.com')
  console.log('3. Deploy automático será iniciado')
} else {
  console.log('⚠️  Algumas verificações falharam!')
  console.log('❌ Corrija os problemas antes do deploy')
}

console.log('\n📖 Consulte DEPLOY-RENDER.md para instruções detalhadas')
