import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  GitCompare, ArrowLeft, Clock, User, 
  ChevronLeft, ChevronRight
} from 'lucide-react'

const VersionCompare = () => {
  const { id, version1, version2 } = useParams()
  const [versions, setVersions] = useState({ version1: null, version2: null })
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('side-by-side') // side-by-side, unified

  useEffect(() => {
    fetchVersions()
  }, [id, version1, version2])

  const fetchVersions = async () => {
    try {
      const response = await api.get(`/page-versions/${id}/versions/${version1}/compare/${version2}`)
      setVersions(response.data)
    } catch (error) {
      console.error('Erro ao carregar versões:', error)
      toast.error('Erro ao carregar comparação')
    }
    setLoading(false)
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

  const renderSideBySide = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      {/* Versão 1 */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ 
          borderBottom: '2px solid #ef4444', 
          paddingBottom: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <h3 style={{ margin: 0, color: '#ef4444' }}>
            Versão {versions.version1.version_number} (Anterior)
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
            {formatDate(versions.version1.created_at)}
            <span style={{ margin: '0 0.5rem' }}>•</span>
            <User size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
            {versions.version1.author_name}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Título:</h4>
          <div style={{ 
            padding: '0.75rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            {versions.version1.title}
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Conteúdo:</h4>
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            maxHeight: '400px',
            overflowY: 'auto',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}>
            <div dangerouslySetInnerHTML={{ __html: versions.version1.content }} />
          </div>
        </div>
      </div>

      {/* Versão 2 */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ 
          borderBottom: '2px solid #10b981', 
          paddingBottom: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <h3 style={{ margin: 0, color: '#10b981' }}>
            Versão {versions.version2.version_number} (Posterior)
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
            {formatDate(versions.version2.created_at)}
            <span style={{ margin: '0 0.5rem' }}>•</span>
            <User size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
            {versions.version2.author_name}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Título:</h4>
          <div style={{ 
            padding: '0.75rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            {versions.version2.title}
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Conteúdo:</h4>
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '4px',
            maxHeight: '400px',
            overflowY: 'auto',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}>
            <div dangerouslySetInnerHTML={{ __html: versions.version2.content }} />
          </div>
        </div>
      </div>
    </div>
  )

  const renderUnified = () => (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Comparação Unificada</h3>
        
        {/* Title Comparison */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>Título:</h4>
          
          {versions.version1.title !== versions.version2.title ? (
            <div>
              <div style={{ 
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                position: 'relative'
              }}>
                <span style={{ 
                  position: 'absolute',
                  top: '-8px',
                  left: '8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  borderRadius: '4px'
                }}>
                  - V{versions.version1.version_number}
                </span>
                {versions.version1.title}
              </div>
              
              <div style={{ 
                padding: '0.75rem',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '4px',
                position: 'relative'
              }}>
                <span style={{ 
                  position: 'absolute',
                  top: '-8px',
                  left: '8px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  borderRadius: '4px'
                }}>
                  + V{versions.version2.version_number}
                </span>
                {versions.version2.title}
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: '0.75rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              color: '#666'
            }}>
              Sem alterações no título
            </div>
          )}
        </div>

        {/* Content Comparison */}
        <div>
          <h4 style={{ margin: '0 0 1rem 0' }}>Conteúdo:</h4>
          
          {versions.version1.content !== versions.version2.content ? (
            <div>
              <div style={{ 
                padding: '1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                marginBottom: '1rem',
                position: 'relative',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <span style={{ 
                  position: 'absolute',
                  top: '-8px',
                  left: '8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  borderRadius: '4px'
                }}>
                  - Versão {versions.version1.version_number}
                </span>
                <div 
                  style={{ fontSize: '0.875rem', lineHeight: '1.5', marginTop: '1rem' }}
                  dangerouslySetInnerHTML={{ __html: versions.version1.content }} 
                />
              </div>
              
              <div style={{ 
                padding: '1rem',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '4px',
                position: 'relative',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <span style={{ 
                  position: 'absolute',
                  top: '-8px',
                  left: '8px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  borderRadius: '4px'
                }}>
                  + Versão {versions.version2.version_number}
                </span>
                <div 
                  style={{ fontSize: '0.875rem', lineHeight: '1.5', marginTop: '1rem' }}
                  dangerouslySetInnerHTML={{ __html: versions.version2.content }} 
                />
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              color: '#666',
              textAlign: 'center'
            }}>
              Sem alterações no conteúdo
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return <div className="loading">Carregando comparação...</div>
  }

  if (!versions.version1 || !versions.version2) {
    return (
      <div className="error-page">
        <h1>Erro</h1>
        <p>Não foi possível carregar as versões para comparação.</p>
        <button onClick={() => window.history.back()} className="btn btn-primary">
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>
    )
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
            <GitCompare size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Comparar Versões
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`btn ${viewMode === 'side-by-side' ? 'btn-primary' : ''}`}
            style={{ padding: '0.5rem 1rem' }}
          >
            <ChevronLeft size={16} style={{ marginRight: '0.25rem' }} />
            <ChevronRight size={16} style={{ marginRight: '0.5rem' }} />
            Lado a Lado
          </button>
          <button
            onClick={() => setViewMode('unified')}
            className={`btn ${viewMode === 'unified' ? 'btn-primary' : ''}`}
            style={{ padding: '0.5rem 1rem' }}
          >
            Unificado
          </button>
        </div>
      </div>

      {/* Comparison Info */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>
              Versão {versions.version1.version_number} ↔ Versão {versions.version2.version_number}
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
              Comparando alterações entre as versões selecionadas
            </div>
          </div>
          
          <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#666' }}>
            <div>Diferença de tempo: {
              Math.abs(new Date(versions.version2.created_at) - new Date(versions.version1.created_at)) / (1000 * 60 * 60 * 24) < 1 
                ? 'Menos de 1 dia'
                : `${Math.ceil(Math.abs(new Date(versions.version2.created_at) - new Date(versions.version1.created_at)) / (1000 * 60 * 60 * 24))} dias`
            }</div>
          </div>
        </div>
      </div>

      {/* Comparison Content */}
      {viewMode === 'side-by-side' ? renderSideBySide() : renderUnified()}
    </div>
  )
}

export default VersionCompare
