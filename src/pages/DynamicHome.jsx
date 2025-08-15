import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import ContentRenderer from '../components/ContentRenderer'
import { BookOpen, FileText, Calendar, ArrowRight, Settings } from 'lucide-react'

function DynamicHome() {
  const { isAuthenticated } = useAuth()
  const [homepageData, setHomepageData] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [recentPages, setRecentPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    fetchHomepageContent()
    fetchRecentContent()
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchHomepageContent = async () => {
    try {
      const response = await api.get('/settings/homepage')
      if (response.data) {
        setHomepageData(response.data)
      } else {
        // Dados padrão se não houver configuração
        setHomepageData({
          title: 'Bem-vindo à Smyrna Wiki',
          content: '<h2>Sistema de Wiki e Gerenciamento de Conhecimento</h2><p>Este é um sistema completo para organização e compartilhamento de conhecimento.</p>',
          isEnabled: true
        })
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo da página inicial:', error)
      // Usar dados padrão em caso de erro
      setHomepageData({
        title: 'Bem-vindo à Smyrna Wiki',
        content: '<h2>Sistema de Wiki e Gerenciamento de Conhecimento</h2><p>Este é um sistema completo para organização e compartilhamento de conhecimento.</p>',
        isEnabled: true
      })
    }
  }

  const fetchRecentContent = async () => {
    try {
      // Buscar últimas 4 páginas da wiki
      const pagesResponse = await api.get('/pages/recent?limit=4')
      setRecentPages(pagesResponse.data || [])

      // Buscar últimos 4 posts do blog
      const postsResponse = await api.get('/posts/recent?limit=4')
      setRecentPosts(postsResponse.data || [])

    } catch (error) {
      console.error('Erro ao carregar conteúdo recente:', error)
      setError('Erro ao carregar conteúdo recente')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1.1rem',
        color: '#64748b'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '2rem',
          background: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid rgb(102, 234, 205)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#64748b', margin: '0', fontWeight: '500' }}>
            Carregando página inicial...
          </p>
        </div>
      </div>
    )
  }

  // Verificar se há conteúdo personalizado (não padrão)
  const hasCustomContent = homepageData && 
    homepageData.title && 
    homepageData.content && 
    homepageData.title.trim() !== '' && 
    homepageData.content.trim() !== '' &&
    !(homepageData.title === 'Bem-vindo ao Smyrna Wiki' && 
      homepageData.content.includes('Sistema de Wiki e Gerenciamento de Conhecimento'))

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '1rem' : '2rem 1rem',
      fontFamily: 'Arial, Tahoma, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Header com gradiente igual ao da Wiki */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
        padding: '4rem 2rem',
        borderRadius: '20px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '40%',
          height: '200%',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'rotate(15deg)'
        }}></div>
        
        <h1 style={{
          margin: '0 0 1rem 0',
          fontSize: isMobile ? '2.5rem' : '3.5rem',
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1
        }}>
          <BookOpen 
            size={isMobile ? 40 : 56} 
            style={{ 
              marginRight: '1rem', 
              verticalAlign: 'middle',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
            }} 
          />
          Wiki Nova Fibra
        </h1>
        
        <p style={{
          margin: 0,
          fontSize: isMobile ? '1rem' : '1.25rem',
          opacity: 0.9,
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6,
          position: 'relative',
          zIndex: 1
        }}>
          {hasCustomContent ? 'Página inicial personalizada' : 'Sistema de gerenciamento de conhecimento colaborativo'}
        </p>
        
        {isAuthenticated && (
          <a 
            href="/admin/profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'white',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              marginTop: '1.5rem',
              position: 'relative',
              zIndex: 1
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <Settings size={18} />
            Configurar Página Inicial
          </a>
        )}
      </div>

      {/* Layout de conteúdo 70/30 */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '70% 30%',
          gap: '2rem',
          width: '100%',
          alignItems: 'start'
        }}
      >
      {/* Coluna Principal (70%) */}
      <div 
        style={{
          gridColumn: isMobile ? '1' : '1',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          minHeight: '400px',
          padding: '2rem'
        }}
      >
        {hasCustomContent ? (
          <>
            <div className="homepage-content">
              <ContentRenderer content={homepageData.content} />
            </div>
          </>
        ) : (
          <>
            <h1 className="homepage-title">Bem-vindo à Smyrna Wiki</h1>
            <div className="homepage-content">
              <h2>Sistema de Wiki e Gerenciamento de Conhecimento</h2>
              <p>Este é um sistema completo para organização e compartilhamento de conhecimento.</p>
              <h3>Funcionalidades:</h3>
              <ul>
                <li>📄 Páginas Wiki organizadas</li>
                <li>📝 Blog integrado</li>
                <li>👥 Gerenciamento de usuários</li>
                <li>🎨 Interface responsiva</li>
              </ul>
              {isAuthenticated && (
                <p style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
                  💡 <strong>Administrador:</strong> <a href="/admin/profile">Configure o conteúdo da página inicial</a> no seu perfil.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Sidebar (30%) */}
      {!isMobile && (
        <div 
          style={{
            gridColumn: '2',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {/* Seção de Páginas Recentes */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
              color: 'white',
              padding: '1rem 1.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FileText size={18} />
              Páginas Recentes
            </div>
            <div style={{ padding: '1.5rem' }}>
              {recentPages.length > 0 ? (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    {recentPages.map((page) => (
                      <div key={page.id} style={{
                        padding: '0.75rem 0',
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'all 0.2s ease'
                      }}>
                        <h4 style={{
                          margin: '0 0 0.25rem 0',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          <a 
                            href={`/page/${page.slug}`}
                            style={{
                              color: '#374151',
                              textDecoration: 'none',
                              transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'rgb(102, 234, 205)'}
                            onMouseLeave={(e) => e.target.style.color = '#374151'}
                          >
                            {page.title}
                          </a>
                        </h4>
                        <p style={{
                          margin: 0,
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          Atualizada em {formatDate(page.updated_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <a 
                      href="/pages" 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: '#f8fafc',
                        color: '#374151',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        border: '1px solid #e2e8f0'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgb(102, 234, 205)'
                        e.target.style.color = 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#f8fafc'
                        e.target.style.color = '#374151'
                      }}
                    >
                      <ArrowRight size={14} />
                      Ver Todas as Páginas
                    </a>
                  </div>
                </>
              ) : (
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                  Nenhuma página encontrada.
                </p>
              )}
            </div>
          </div>

        {/* Seção de Posts Recentes */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
            color: 'white',
            padding: '1rem 1.5rem',
            fontWeight: '600',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Calendar size={18} />
            Posts Recentes
          </div>
          <div style={{ padding: '1.5rem' }}>
            {recentPosts.length > 0 ? (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  {recentPosts.map((post) => (
                    <div key={post.id} style={{
                      padding: '0.75rem 0',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'all 0.2s ease'
                    }}>
                      <h4 style={{
                        margin: '0 0 0.25rem 0',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        <a 
                          href={`/post/${post.id}`}
                          style={{
                            color: '#374151',
                            textDecoration: 'none',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = 'rgb(102, 234, 205)'}
                          onMouseLeave={(e) => e.target.style.color = '#374151'}
                        >
                          {post.title}
                        </a>
                      </h4>
                      <p style={{
                        margin: 0,
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        Publicado em {formatDate(post.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <a 
                    href="/blog" 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: '#f8fafc',
                      color: '#374151',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      border: '1px solid #e2e8f0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgb(102, 234, 205)'
                      e.target.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f8fafc'
                      e.target.style.color = '#374151'
                    }}
                  >
                    <ArrowRight size={14} />
                    Ver Todos os Posts
                  </a>
                </div>
              </>
            ) : (
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                Nenhum post encontrado.
              </p>
            )}
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #fecaca'
          }}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}
        </div>
      )}
    </div>
    </div>
  )
}

export default DynamicHome
