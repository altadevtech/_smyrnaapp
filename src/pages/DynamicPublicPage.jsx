import React, { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import api from '../services/api'
import ContentRenderer from '../components/ContentRenderer'
import WikiLayout from '../components/WikiLayout'
import { ArrowLeft, User, Calendar } from 'lucide-react'

const DynamicPublicPage = () => {
  const { slug } = useParams()
  const location = useLocation()
  const [page, setPage] = useState(null)
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Verificar se é rota Wiki
  const isWikiRoute = location.pathname.startsWith('/wiki/') || 
                     (page && !location.pathname.startsWith('/page/'))

  useEffect(() => {
    fetchPage()
  }, [slug])

  const fetchPage = async () => {
    try {
      // Buscar página por slug
      const pageResponse = await api.get(`/pages/public/${slug}`)
      setPage(pageResponse.data)
      
      // Buscar categoria se a página tiver uma
      if (pageResponse.data.category_id) {
        try {
          const categoryResponse = await api.get(`/categories/${pageResponse.data.category_id}`)
          setCategory(categoryResponse.data)
        } catch (categoryError) {
          console.error('Erro ao carregar categoria:', categoryError)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar página:', error)
      setError(error.response?.data?.message || 'Página não encontrada')
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="public-container">
        <div className="loading">Carregando página...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="public-container">
        <div className="error-page">
          <h1>404 - Página não encontrada</h1>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={18} /> Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  // Renderização simples da página com suporte a shortcodes
  const renderContent = () => (
    <article className="page-article">
      <header className="article-header">
        <h1 className="article-title">{page.title}</h1>
        <div className="article-meta">
          <span className="meta-item">
            <User size={16} />
            Por {page.author_name}
          </span>
          <span className="meta-item">
            <Calendar size={16} />
            Atualizado em {new Date(page.updated_at).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </header>

      <div className="article-content">
        <ContentRenderer 
          content={page.content} 
          className="content-text"
        />
      </div>
    </article>
  )

  // Se for rota Wiki, usar WikiLayout
  if (isWikiRoute) {
    return (
      <WikiLayout category={category} page={page}>
        {renderContent()}
      </WikiLayout>
    )
  }

  // Renderização tradicional para outras rotas
  return (
    <div className="public-container">
      <header className="public-header">
        <nav className="breadcrumb-nav">
          <Link to="/" className="back-button">
            <ArrowLeft size={18} /> Voltar ao início
          </Link>
          <span className="breadcrumb-separator">•</span>
          <span className="current-page">{page.title}</span>
        </nav>
      </header>

      {renderContent()}
    </div>
  )
}

export default DynamicPublicPage
