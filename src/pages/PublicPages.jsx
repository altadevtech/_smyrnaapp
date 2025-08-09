import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Calendar, User, FileText, ArrowRight } from 'lucide-react'

const PublicPages = () => {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await api.get('/pages/public')
      setPages(response.data)
    } catch (error) {
      console.error('Erro ao carregar páginas:', error)
    }
    setLoading(false)
  }

  const generateSlug = (title, id) => {
    return title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + id
  }

  if (loading) {
    return (
      <div className="public-container">
        <div className="loading">Carregando páginas...</div>
      </div>
    )
  }

  return (
    <div className="public-container">
      <header className="public-header">
        <Link to="/" className="back-button">
          <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Voltar ao início
        </Link>
        <h1><FileText size={24} /> Todas as Páginas</h1>
      </header>

      <main className="public-content">
        {pages.length > 0 ? (
          <div className="posts-grid">
            {pages.map(page => (
              <article key={page.id} className="page-card">
                <div className="page-content">
                  <h2 className="page-title">
                    <Link to={`/page/${page.slug || generateSlug(page.title, page.id)}`}>
                      {page.title}
                    </Link>
                  </h2>
                  <p className="page-excerpt">
                    {page.content.length > 200 
                      ? page.content.substring(0, 200) + '...' 
                      : page.content}
                  </p>
                  <div className="page-meta">
                    <span><User size={14} /> {page.author_name}</span>
                    <span><Calendar size={14} /> {new Date(page.updated_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-content">
            <FileText size={64} />
            <h2>Nenhuma página encontrada</h2>
            <p>Ainda não há páginas publicadas.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default PublicPages
