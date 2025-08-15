import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, Clock, User, RotateCcw, Eye, Calendar, FileText } from 'lucide-react'

const PageVersionHistory = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [versions, setVersions] = useState([])
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState(null)

  useEffect(() => {
    fetchPageAndVersions()
  }, [id])

  const fetchPageAndVersions = async () => {
    try {
      // Buscar informações da página
      const pageResponse = await api.get(`/pages/${id}`)
      setPage(pageResponse.data)

      // Buscar versões
      const versionsResponse = await api.get(`/pages/${id}/versions`)
      setVersions(versionsResponse.data)
    } catch (error) {
      toast.error('Erro ao carregar histórico de versões')
      navigate('/admin/pages')
    }
    setLoading(false)
  }

  const restoreVersion = async (versionNumber) => {
    const changeSummary = prompt(`Descreva o motivo da restauração da versão ${versionNumber}:`)
    if (changeSummary === null) return // Usuário cancelou

    setRestoring(versionNumber)
    
    try {
      await api.post(`/pages/${id}/versions/${versionNumber}/restore`, {
        changeSummary: changeSummary || `Restaurada versão ${versionNumber}`
      })
      
      toast.success(`Versão ${versionNumber} restaurada com sucesso!`)
      fetchPageAndVersions() // Recarregar para mostrar nova versão
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao restaurar versão')
    }
    
    setRestoring(null)
  }

  const viewVersion = (versionNumber) => {
    navigate(`/admin/pages/${id}/versions/${versionNumber}`)
  }

  if (loading) {
    return <div className="loading">Carregando histórico...</div>
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
          onClick={() => navigate(`/admin/pages/${id}/edit`)} 
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
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: '700' }}>
            <Clock size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Histórico de Versões
          </h1>
          {page && (
            <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
              Página: <strong>{page.title}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Versions List */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {versions.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
              Nenhuma versão encontrada
            </h3>
            <p style={{ margin: 0 }}>
              As versões serão criadas automaticamente quando a página for editada.
            </p>
          </div>
        ) : (
          <div>
            {/* Header da tabela */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 150px 200px 150px',
              gap: '1rem',
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div>Versão</div>
              <div>Resumo das Alterações</div>
              <div>Autor</div>
              <div>Data</div>
              <div>Ações</div>
            </div>

            {/* Lista de versões */}
            {versions.map((version, index) => (
              <div 
                key={version.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr 150px 200px 150px',
                  gap: '1rem',
                  padding: '1rem 1.5rem',
                  borderBottom: index < versions.length - 1 ? '1px solid #e5e7eb' : 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                }}
              >
                {/* Versão */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    background: index === 0 
                      ? 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)'
                      : '#e5e7eb',
                    color: index === 0 ? 'white' : '#374151',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    v{version.version_number}
                  </span>
                  {index === 0 && (
                    <span style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      Atual
                    </span>
                  )}
                </div>

                {/* Resumo */}
                <div style={{
                  color: '#374151',
                  lineHeight: '1.4'
                }}>
                  {version.change_summary || (
                    <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>
                      Sem resumo de alterações
                    </span>
                  )}
                </div>

                {/* Autor */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#64748b'
                }}>
                  <User size={14} />
                  {version.author_name || 'Usuário desconhecido'}
                </div>

                {/* Data */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#64748b'
                }}>
                  <Calendar size={14} />
                  {new Date(version.created_at).toLocaleString('pt-BR')}
                </div>

                {/* Ações */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <button
                    onClick={() => viewVersion(version.version_number)}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      color: '#374151'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#e5e7eb'
                      e.target.style.borderColor = '#9ca3af'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f3f4f6'
                      e.target.style.borderColor = '#d1d5db'
                    }}
                    title="Visualizar versão"
                  >
                    <Eye size={14} />
                  </button>

                  {index !== 0 && (
                    <button
                      onClick={() => restoreVersion(version.version_number)}
                      disabled={restoring === version.version_number}
                      style={{
                        background: restoring === version.version_number 
                          ? '#9ca3af' 
                          : 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        cursor: restoring === version.version_number ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => {
                        if (restoring !== version.version_number) {
                          e.target.style.transform = 'translateY(-2px)'
                          e.target.style.boxShadow = '0 4px 8px rgba(102, 234, 205, 0.3)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (restoring !== version.version_number) {
                          e.target.style.transform = 'translateY(0)'
                          e.target.style.boxShadow = 'none'
                        }
                      }}
                      title="Restaurar esta versão"
                    >
                      {restoring === version.version_number ? (
                        <div style={{
                          width: '14px',
                          height: '14px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                      ) : (
                        <RotateCcw size={14} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'rgba(102, 234, 205, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(102, 234, 205, 0.3)',
        fontSize: '0.9rem',
        color: '#374151'
      }}>
        <h4 style={{
          margin: '0 0 1rem 0',
          color: '#1e293b',
          fontSize: '1rem',
          fontWeight: '600'
        }}>
          💡 Sobre o Sistema de Versões
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: 1.6 }}>
          <li>Uma nova versão é criada automaticamente sempre que você edita uma página</li>
          <li>O resumo de alterações ajuda a identificar o que foi modificado</li>
          <li>Você pode restaurar qualquer versão anterior quando necessário</li>
          <li>A versão atual é sempre destacada e não pode ser restaurada</li>
          <li>Todas as ações ficam registradas no histórico com data, hora e autor</li>
        </ul>
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

export default PageVersionHistory
