import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import ContentRenderer from '../components/ContentRenderer'
import { ArrowLeft, User, Calendar } from 'lucide-react'

const DynamicPublicPage = () => {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPage()
  }, [slug])

  const fetchPage = async () => {
    try {
      // Buscar página por slug
      const pageResponse = await api.get(`/pages/public/${slug}`)
      setPage(pageResponse.data)
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
    </div>
  )
}

export default DynamicPublicPage
