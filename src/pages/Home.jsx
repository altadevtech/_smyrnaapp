import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { FileText, Calendar, User, ArrowRight } from 'lucide-react'

const Home = () => {
  const [pages, setPages] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const generateSlug = (title, id) => {
    return title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + id
  }

  useEffect(() => {
    fetchPublicContent()
  }, [])

  const fetchPublicContent = async () => {
    try {
      const [pagesRes, postsRes] = await Promise.all([
        api.get('/pages/public'),
        api.get('/posts/public')
      ])
      setPages(pagesRes.data)
      setPosts(postsRes.data)
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="loading">Carregando...</div>
  }

  return (
    <div className="public-home">
      <section className="hero-section">
        <h1>Bem-vindo ao Smyrna Wiki</h1>
        <p>Sistema de wiki e gerenciamento de conhecimento simples e eficiente.</p>
        <div className="hero-actions">
          <Link to="/blog" className="btn btn-primary">
            <FileText size={18} /> Ver Blog
          </Link>
        </div>
      </section>

      <section className="content-sections">
        <div className="section-card">
          <h2><FileText size={24} /> Wiki</h2>
          {pages.length > 0 ? (
            <div className="content-list">
              {pages.slice(0, 3).map(page => (
                <div key={page.id} className="content-item">
                  <h3>
                    <Link to={`/page/${generateSlug(page.title, page.id)}`}>
                      {page.title}
                    </Link>
                  </h3>
                  <p>{page.content.substring(0, 120)}...</p>
                  <div className="item-meta">
                    <span><User size={14} /> {page.author_name}</span>
                    <span><Calendar size={14} /> {new Date(page.updated_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              ))}
              {pages.length > 3 && (
                <Link to="/pages" className="view-all">
                  Ver todo o wiki <ArrowRight size={14} />
                </Link>
              )}
            </div>
          ) : (
            <p>Nenhuma página publicada ainda.</p>
          )}
        </div>

        <div className="section-card">
          <h2><FileText size={24} /> Posts Recentes</h2>
          {posts.length > 0 ? (
            <div className="content-list">
              {posts.slice(0, 3).map(post => (
                <div key={post.id} className="content-item">
                  <h3>
                    <Link to={`/blog/${post.slug || generateSlug(post.title, post.id)}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p>{post.content.substring(0, 120)}...</p>
                  <div className="item-meta">
                    <span><User size={14} /> {post.author_name}</span>
                    <span><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              ))}
              <Link to="/blog" className="view-all">
                Ver todos os posts <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <p>Nenhum post publicado ainda.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
