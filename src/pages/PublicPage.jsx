import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import ContentRenderer from '../components/ContentRenderer'
import { Calendar, User, ArrowLeft, Home, Clock, Tag, BookOpen } from 'lucide-react'

// Componente para exibir páginas públicas da Wiki

const PublicPage = () => {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    fetchPage()
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [slug])

  const fetchPage = async () => {
    try {
      const response = await api.get(`/pages/public/${slug}`)
      setPage(response.data)
    } catch (error) {
      setError('Página não encontrada')
      console.error('Erro ao carregar página:', error)
    }
    setLoading(false)
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
            Carregando página...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          padding: '3rem 2rem',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            opacity: 0.3
          }}>
            📄
          </div>
          <h1 style={{
            margin: '0 0 1rem 0',
            color: '#374151',
            fontSize: '2rem',
            fontWeight: '700'
          }}>
            404 - Página não encontrada
          </h1>
          <p style={{
            margin: '0 0 2rem 0',
            color: '#6b7280',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}>
            {error}. A página que você está procurando pode ter sido removida ou não existe.
          </p>
          <Link 
            to="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 4px 15px rgba(102, 234, 205, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            <Home size={18} />
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '1rem' : '2rem 1rem',
      fontFamily: 'Arial, Tahoma, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Header com navegação */}
      <header style={{
        marginBottom: '2rem'
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          color: '#6b7280',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <Link 
            to="/" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgb(102, 234, 205)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              background: 'rgba(102, 234, 205, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(102, 234, 205, 0.2)'
              e.target.style.transform = 'translateX(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(102, 234, 205, 0.1)'
              e.target.style.transform = 'translateX(0)'
            }}
          >
            <Home size={18} />
            Início
          </Link>
          <span style={{ color: '#d1d5db' }}>•</span>
          <Link 
            to="/pages" 
            style={{
              color: 'rgb(102, 234, 205)',
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(102, 234, 205, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
            }}
          >
            Wiki
          </Link>
          <span style={{ color: '#d1d5db' }}>•</span>
          <span style={{ color: '#9ca3af' }}>
            {page.title}
          </span>
        </nav>
      </header>

      {/* Artigo principal */}
      <article style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        
        {/* Header do artigo */}
        <header style={{
          background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
          padding: isMobile ? '2rem 1.5rem' : '3rem 2rem',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '30%',
            height: '160%',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'rotate(15deg)'
          }}></div>
          
          {/* Badge de categoria */}
          <div style={{
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1
          }}>
            <span style={{
              backgroundColor: '#6366f1',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Tag size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Wiki
            </span>
          </div>
          
          <h1 style={{
            margin: '0 0 1.5rem 0',
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontWeight: '700',
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            zIndex: 1
          }}>
            {page.title}
          </h1>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            fontSize: '0.9rem',
            opacity: 0.9,
            position: 'relative',
            zIndex: 1
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px'
            }}>
              <User size={16} />
              Por {page.author_name}
            </span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px'
            }}>
              <Calendar size={16} />
              {new Date(page.updated_at).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px'
            }}>
              <BookOpen size={16} />
              Página Wiki
            </span>
          </div>
        </header>

        {/* Conteúdo do artigo */}
        <div style={{
          padding: isMobile ? '2rem 1.5rem' : '3rem 2rem',
          fontSize: '1.1rem',
          lineHeight: 1.7,
          color: '#374151'
        }}>
          <ContentRenderer content={page.content} />
        </div>
        
        {/* Footer do artigo */}
        <footer style={{
          borderTop: '1px solid #f1f5f9',
          padding: '1.5rem 2rem',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6b7280',
            fontSize: '0.9rem'
          }}>
            <Clock size={16} />
            Última atualização: {new Date(page.updated_at).toLocaleDateString('pt-BR')}
          </div>
          
          <Link 
            to="/pages"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgb(102, 234, 205)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: 'rgba(102, 234, 205, 0.1)',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(102, 234, 205, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(102, 234, 205, 0.1)'
            }}
          >
            <BookOpen size={16} />
            Ver todas as páginas
          </Link>
        </footer>
      </article>
    </div>
  )
}

export default PublicPage
