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
        <h1><FileText size={24} /> Páginas</h1>
      </header>

      <main className="public-content">
        {pages.length > 0 ? (
          <div className="pages-grid">
            {pages.map(page => (
              <article key={page.id} className="page-card">
                <header className="page-header">
                  <h2>
                    <Link to={`/page/${page.slug || generateSlug(page.title, page.id)}`}>
                      {page.title}
                    </Link>
                  </h2>
                  <div className="page-meta">
                    <span className="meta-item">
                      <User size={14} />
                      {page.author_name}
                    </span>
                    <span className="meta-item">
                      <Calendar size={14} />
                      Atualizado em {new Date(page.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </header>

                <div className="page-excerpt">
                  <p>{page.content.substring(0, 250)}...</p>
                </div>

                <footer className="page-footer">
                  <Link 
                    to={`/page/${page.slug || generateSlug(page.title, page.id)}`} 
                    className="read-more"
                  >
                    Ler página <ArrowRight size={14} />
                  </Link>
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-content">
            <FileText size={48} />
            <h2>Nenhuma página publicada ainda</h2>
            <p>Volte em breve para conferir nossos conteúdos!</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default PublicPages
