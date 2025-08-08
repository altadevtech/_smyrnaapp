import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { Calendar, User, ArrowLeft, Home } from 'lucide-react'

const PublicPage = () => {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPage()
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
            <Home size={18} /> Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="public-container">
      <header className="public-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={18} /> Voltar ao início
        </Link>
      </header>

      <article className="public-content">
        <header className="content-header">
          <h1>{page.title}</h1>
          <div className="content-meta">
            <span className="meta-item">
              <User size={16} />
              Por {page.author_name}
            </span>
            <span className="meta-item">
              <Calendar size={16} />
              Atualizado em {new Date(page.updated_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </header>

        <div className="content-body">
          <div 
            dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br>') }}
          />
        </div>
      </article>
    </div>
  )
}

export default PublicPage
