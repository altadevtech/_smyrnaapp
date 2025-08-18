import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader, CheckCircle, AlertTriangle } from 'lucide-react'
import api from '../services/api'
import { toast } from 'react-hot-toast'

const FeaturedImageUpload = ({ value, onChange, onImageDelete }) => {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (files) => {
    const file = files[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 10MB.')
      return
    }

    uploadImage(file)
  }

  const uploadImage = async (file) => {
    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('featuredImage', file)

      const response = await api.post('/featured-images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        onChange(response.data.imageUrl)
        toast.success('Imagem carregada com sucesso!')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error(error.response?.data?.message || 'Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!value) return

    try {
      const filename = value.split('/').pop()
      await api.delete(`/featured-images/delete/${filename}`)
      
      onChange('')
      if (onImageDelete) onImageDelete()
      toast.success('Imagem removida com sucesso!')
    } catch (error) {
      console.error('Erro ao remover imagem:', error)
      toast.error('Erro ao remover imagem')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFileSelect(files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files)
    handleFileSelect(files)
  }

  return (
    <div className="featured-image-upload">
      <style jsx>{`
        .featured-image-upload {
          width: 100%;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f9fafb;
          position: relative;
        }

        .upload-area:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .upload-area.drag-active {
          border-color: #3b82f6;
          background: #eff6ff;
          transform: scale(1.02);
        }

        .upload-area.uploading {
          pointer-events: none;
          opacity: 0.7;
        }

        .upload-icon {
          margin: 0 auto 1rem;
          color: #6b7280;
        }

        .upload-text {
          color: #374151;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .upload-help {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .file-input {
          display: none;
        }

        .image-preview {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          background: white;
        }

        .preview-image {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
          display: block;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-preview:hover .image-overlay {
          opacity: 1;
        }

        .overlay-button {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #374151;
        }

        .overlay-button:hover {
          background: white;
          transform: scale(1.1);
        }

        .overlay-button.danger:hover {
          background: #ef4444;
          color: white;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .image-info {
          padding: 1rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .format-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: #dcfce7;
          color: #166534;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
      `}</style>

      {value ? (
        <div className="image-preview">
          <img 
            src={value} 
            alt="Imagem destacada" 
            className="preview-image"
            onError={(e) => {
              console.error('Erro ao carregar imagem:', value)
              e.target.style.display = 'none'
            }}
          />
          <div className="image-overlay">
            <button
              type="button"
              className="overlay-button"
              onClick={handleClick}
              title="Trocar imagem"
            >
              <Upload size={20} />
            </button>
            <button
              type="button"
              className="overlay-button danger"
              onClick={handleRemoveImage}
              title="Remover imagem"
            >
              <X size={20} />
            </button>
          </div>
          <div className="image-info">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Imagem destacada carregada</span>
              <span className="format-badge">
                <CheckCircle size={12} />
                Otimizada (1200x630)
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {uploading ? (
            <>
              <Loader size={48} className="upload-icon loading-spinner" />
              <p className="upload-text">Processando imagem...</p>
              <p className="upload-help">Otimizando para melhor performance</p>
            </>
          ) : (
            <>
              <ImageIcon size={48} className="upload-icon" />
              <p className="upload-text">Clique ou arraste uma imagem aqui</p>
              <p className="upload-help">
                Formatos aceitos: JPG, PNG, GIF, WebP<br />
                Tamanho máximo: 10MB<br />
                <span className="format-badge" style={{ marginTop: '0.5rem' }}>
                  <AlertTriangle size={12} />
                  Será redimensionada para 1200x630px
                </span>
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="file-input"
        accept="image/*"
        onChange={handleFileInputChange}
      />
    </div>
  )
}

export default FeaturedImageUpload
