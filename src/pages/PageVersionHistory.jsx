import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  History, ArrowLeft, Eye, RotateCcw, GitCompare,
  Clock, User, FileText, ChevronDown, ChevronRight
} from 'lucide-react'

const PageVersionHistory = () => {
  const { id } = useParams()
  const [versions, setVersions] = useState([])
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVersions, setSelectedVersions] = useState([])
  const [expandedVersions, setExpandedVersions] = useState(new Set())

  useEffect(() => {
    fetchVersions()
    fetchPage()
  }, [id])

  const fetchVersions = async () => {
    try {
      const response = await api.get(`/page-versions/${id}/versions`)
      setVersions(response.data)
    } catch (error) {
      console.error('Erro ao carregar versões:', error)
      toast.error('Erro ao carregar histórico')
    }
    setLoading(false)
  }

  const fetchPage = async () => {
    try {
      const response = await api.get(`/pages/${id}`)
      setPage(response.data)
    } catch (error) {
      console.error('Erro ao carregar página:', error)
    }
  }

  const handleRestore = async (versionNumber) => {
    if (!window.confirm(`Tem certeza que deseja restaurar a versão ${versionNumber}?`)) {
      return
    }

    try {
      await api.post(`/page-versions/${id}/versions/${versionNumber}/restore`)
      toast.success('Versão restaurada com sucesso!')
      fetchVersions()
      fetchPage()
    } catch (error) {
      console.error('Erro ao restaurar versão:', error)
      toast.error('Erro ao restaurar versão')
    }
  }

  const handleCompare = () => {
    if (selectedVersions.length !== 2) {
      toast.error('Selecione exatamente 2 versões para comparar')
      return
    }

    const [v1, v2] = selectedVersions.sort((a, b) => b - a)
    window.open(`/admin/pages/${id}/versions/compare/${v1}/${v2}`, '_blank')
  }

  const toggleVersionSelection = (versionNumber) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionNumber)) {
        return prev.filter(v => v !== versionNumber)
      } else if (prev.length < 2) {
        return [...prev, versionNumber]
      } else {
        toast.warning('Máximo de 2 versões para comparação')
        return prev
      }
    })
  }

  const toggleVersionExpansion = (versionNumber) => {
    setExpandedVersions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(versionNumber)) {
        newSet.delete(versionNumber)
      } else {
        newSet.add(versionNumber)
      }
      return newSet
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getContentPreview = (content) => {
    const textContent = content.replace(/<[^>]*>/g, '')
    return textContent.length > 200 ? textContent.substring(0, 200) + '...' : textContent
  }

  if (loading) {
    return <div className="loading">Carregando histórico...</div>
  }

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => window.history.back()}
            className="btn"
            style={{ padding: '0.5rem' }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1>
            <History size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Histórico de Versões
          </h1>
        </div>

        {selectedVersions.length === 2 && (
          <button
            onClick={handleCompare}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem' }}
          >
            <GitCompare size={16} style={{ marginRight: '0.5rem' }} />
            Comparar Versões
          </button>
        )}
      </div>

      {/* Page Info */}
      {page && (
        <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>
            <FileText size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            {page.title}
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            <strong>Versão atual:</strong> {versions.length > 0 ? versions[0].version_number : 'N/A'} | 
            <strong> Total de versões:</strong> {versions.length}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa' }}>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          💡 <strong>Instruções:</strong> Clique nas caixas de seleção para escolher 2 versões e compará-las. 
          Use o botão de restaurar para voltar a uma versão anterior.
        </div>
      </div>

      {/* Versions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {versions.map((version, index) => {
          const isExpanded = expandedVersions.has(version.version_number)
          const isSelected = selectedVersions.includes(version.version_number)
          const isCurrent = index === 0

          return (
            <div 
              key={version.id} 
              className="card"
              style={{ 
                padding: '1.5rem',
                border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                backgroundColor: isCurrent ? '#f0f9ff' : 'white'
              }}
            >
              {/* Version Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleVersionSelection(version.version_number)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  
                  <div>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                      Versão {version.version_number}
                      {isCurrent && (
                        <span style={{ 
                          marginLeft: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          fontSize: '0.75rem',
                          borderRadius: '4px'
                        }}>
                          ATUAL
                        </span>
                      )}
                    </h4>
                    <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                      <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                      {formatDate(version.created_at)}
                      <span style={{ margin: '0 0.5rem' }}>•</span>
                      <User size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                      {version.author_name}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => toggleVersionExpansion(version.version_number)}
                    className="btn"
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {!isCurrent && (
                    <button
                      onClick={() => handleRestore(version.version_number)}
                      className="btn btn-warning"
                      style={{ padding: '0.25rem 0.5rem' }}
                      title="Restaurar esta versão"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Change Summary */}
              {version.change_summary && (
                <div style={{ 
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  <strong>Resumo das alterações:</strong> {version.change_summary}
                </div>
              )}

              {/* Expanded Content */}
              {isExpanded && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  backgroundColor: '#fafafa'
                }}>
                  <h5 style={{ margin: '0 0 0.5rem 0' }}>Título:</h5>
                  <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                    {version.title}
                  </div>
                  
                  <h5 style={{ margin: '0 0 0.5rem 0' }}>Conteúdo:</h5>
                  <div 
                    style={{ 
                      maxHeight: '200px',
                      overflowY: 'auto',
                      fontSize: '0.875rem',
                      lineHeight: '1.5'
                    }}
                    dangerouslySetInnerHTML={{ __html: version.content }}
                  />
                </div>
              )}

              {/* Content Preview (when not expanded) */}
              {!isExpanded && (
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  <strong>Preview:</strong> {getContentPreview(version.content)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {versions.length === 0 && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <History size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <h3 style={{ color: '#6b7280' }}>Nenhuma versão encontrada</h3>
          <p style={{ color: '#9ca3af' }}>
            As versões serão criadas automaticamente quando a página for editada.
          </p>
        </div>
      )}
    </div>
  )
}

export default PageVersionHistory
