import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurar diretório de uploads
const uploadsDir = path.join(__dirname, '../../uploads/featured-images')

// Criar diretório se não existir
async function ensureUploadsDir() {
  try {
    await fs.access(uploadsDir)
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true })
    console.log('📁 Diretório de uploads criado:', uploadsDir)
  }
}

// Inicializar diretório
ensureUploadsDir()

// Configurar multer para upload em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limite
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos'), false)
    }
  }
})

// Função para gerar nome único do arquivo
function generateUniqueFilename(originalName) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  const ext = path.extname(originalName).toLowerCase()
  return `featured-${timestamp}-${random}${ext}`
}

// Rota para upload de imagem destacada
router.post('/upload', authenticateToken, upload.single('featuredImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado' })
    }

    const filename = generateUniqueFilename(req.file.originalname)
    const filepath = path.join(uploadsDir, filename)

    // Processar a imagem com Sharp
    // Redimensionar para formato adequado para blog (1200x630 - proporção do Facebook/Twitter)
    await sharp(req.file.buffer)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 85,
        progressive: true
      })
      .toFile(filepath.replace(path.extname(filepath), '.jpg'))

    // Usar sempre extensão .jpg após processamento
    const finalFilename = filename.replace(path.extname(filename), '.jpg')
    const imageUrl = `/uploads/featured-images/${finalFilename}`

    res.json({
      success: true,
      imageUrl,
      filename: finalFilename,
      message: 'Imagem carregada e otimizada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error)
    res.status(500).json({ 
      message: 'Erro ao processar imagem',
      error: error.message 
    })
  }
})

// Rota para excluir imagem destacada
router.delete('/delete/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params
    
    // Validar nome do arquivo para segurança
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ message: 'Nome de arquivo inválido' })
    }

    const filepath = path.join(uploadsDir, filename)
    
    try {
      await fs.access(filepath)
      await fs.unlink(filepath)
      
      res.json({
        success: true,
        message: 'Imagem excluída com sucesso'
      })
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({ message: 'Arquivo não encontrado' })
      } else {
        throw error
      }
    }

  } catch (error) {
    console.error('Erro ao excluir imagem:', error)
    res.status(500).json({ 
      message: 'Erro ao excluir imagem',
      error: error.message 
    })
  }
})

// Rota para listar imagens (opcional, para administração)
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const files = await fs.readdir(uploadsDir)
    const images = files.filter(file => 
      ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(path.extname(file).toLowerCase())
    ).map(filename => ({
      filename,
      url: `/uploads/featured-images/${filename}`,
      uploadDate: filename.split('-')[1] // Extrair timestamp do nome
    }))

    res.json({ images })
  } catch (error) {
    console.error('Erro ao listar imagens:', error)
    res.status(500).json({ 
      message: 'Erro ao listar imagens',
      error: error.message 
    })
  }
})

export default router
