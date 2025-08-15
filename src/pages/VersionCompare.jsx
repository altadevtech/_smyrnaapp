import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, Clock, User, Eye, Calendar, FileText, RotateCcw } from 'lucide-react'

const VersionCompare = () => {
  const navigate = useNavigate()
  const { id, versionNumber } = useParams()
  const [version, setVersion] = useState(null)
  const [currentPage, setCurrentPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState(false)

  useEffect(() => {
    fetchVersionAndPage()
  }, [id, versionNumber])

  const fetchVersionAndPage = async () => {
    try {
      // Buscar versão específica
      const versionResponse = await api.get(`/pages/${id}/versions/${versionNumber}`)
      setVersion(versionResponse.data)

      // Buscar página atual para comparação
      const pageResponse = await api.get(`/pages/${id}`)
      setCurrentPage(pageResponse.data)
    } catch (error) {
      toast.error('Erro ao carregar versão')
      navigate(`/admin/pages/${id}/versions`)
    }
    setLoading(false)
  }

  const restoreVersion = async () => {
    const changeSummary = prompt(`Descreva o motivo da restauração da versão ${versionNumber}:`)
    if (changeSummary === null) return // Usuário cancelou

    setRestoring(true)
    
    try {
      await api.post(`/pages/${id}/versions/${versionNumber}/restore`, {
        changeSummary: changeSummary || `Restaurada versão ${versionNumber}`
      })
      
      toast.success(`Versão ${versionNumber} restaurada com sucesso!`)
      navigate(`/admin/pages/${id}/edit`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao restaurar versão')
    }
    
    setRestoring(false)
  }

  if (loading) {
    return <div className="loading">Carregando versão...</div>
  }

  if (!version) {
    return <div>Versão não encontrada</div>
  }

  return (
    <div style={{ fontFamily: 'Arial, Tahoma, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <button 
          onClick={() => navigate(`/admin/pages/${id}/versions`)} 
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: '700' }}>
            <Eye size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Visualizar Versão {versionNumber}
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
            {version.title}
          </p>
        </div>
        <button
          onClick={restoreVersion}
          disabled={restoring}
          style={{
            background: restoring ? '#9ca3af' : 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            color: 'white',
            cursor: restoring ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!restoring) {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)'
              e.target.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseLeave={(e) => {
            if (!restoring) {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.transform = 'translateY(0)'
            }
          }}
        >
          {restoring ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Restaurando...
            </>
          ) : (
            <>
              <RotateCcw size={16} />
              Restaurar Esta Versão
            </>
          )}
        </button>
      </div>

      {/* Version Info */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          background: '#f8fafc',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.2rem', fontWeight: '600' }}>
            Informações da Versão
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
              <Clock size={16} />
              <span><strong>Data:</strong> {new Date(version.created_at).toLocaleString('pt-BR')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
              <User size={16} />
              <span><strong>Autor:</strong> {version.author_name || 'Usuário desconhecido'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
              <FileText size={16} />
              <span><strong>Versão:</strong> {version.version_number}</span>
            </div>
          </div>
          {version.change_summary && (
            <div style={{ marginTop: '1rem' }}>
              <strong style={{ color: '#1e293b' }}>Resumo das alterações:</strong>
              <div style={{
                marginTop: '0.5rem',
                padding: '1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#374151'
              }}>
                {version.change_summary}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem'
      }}>
        {/* Version Content */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            Conteúdo da Versão {versionNumber}
          </div>
          <div style={{ padding: '2rem' }}>
            <h2 style={{ 
              margin: '0 0 1.5rem 0', 
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '700',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '1rem'
            }}>
              {version.title}
            </h2>
            <div 
              style={{ 
                lineHeight: '1.7',
                color: '#374151',
                fontSize: '1rem'
              }}
              dangerouslySetInnerHTML={{ __html: version.content }}
            />
          </div>
        </div>

        {/* Current Page Comparison */}
        {currentPage && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem 1.5rem',
              background: '#f8fafc',
              borderBottom: '1px solid #e5e7eb',
              color: '#64748b',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Versão Atual (para comparação)
            </div>
            <div style={{ padding: '2rem' }}>
              <h2 style={{ 
                margin: '0 0 1.5rem 0', 
                color: '#1e293b',
                fontSize: '1.5rem',
                fontWeight: '700',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '1rem'
              }}>
                {currentPage.title}
              </h2>
              <div 
                style={{ 
                  lineHeight: '1.7',
                  color: '#374151',
                  fontSize: '1rem'
                }}
                dangerouslySetInnerHTML={{ __html: currentPage.content }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Warning Box */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        fontSize: '0.9rem',
        color: '#dc2626'
      }}>
        <h4 style={{
          margin: '0 0 1rem 0',
          color: '#b91c1c',
          fontSize: '1rem',
          fontWeight: '600'
        }}>
          ⚠️ Atenção
        </h4>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          Ao restaurar esta versão, o conteúdo atual da página será substituído. 
          Uma nova versão será criada automaticamente para preservar o estado atual antes da restauração.
        </p>
      </div>

      {/* Adicionar a animação de loading no CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default VersionCompare
