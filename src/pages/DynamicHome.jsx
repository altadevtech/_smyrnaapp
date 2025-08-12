import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ContentRenderer from '../components/ContentRenderer'
import { FileText, ArrowRight, Calendar, User } from 'lucide-react'

const DynamicHome = () => {
  const [homePage, setHomePage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomePage()
  }, [])

  const fetchHomePage = async () => {
    try {
      console.log('🏠 Tentando carregar página home...')
      
      // Tentar buscar página definida como home
      const homeResponse = await api.get('/pages/home')
      if (homeResponse.data) {
        console.log('✅ Página home encontrada:', homeResponse.data.title)
        setHomePage(homeResponse.data)
      } else {
        console.log('ℹ️ Nenhuma página home definida')
      }
    } catch (error) {
      console.log('ℹ️ Nenhuma página home definida ou erro ao carregar:', error.response?.status)
      setHomePage(null)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="public-container">
        <div className="loading">Carregando página inicial...</div>
      </div>
    )
  }

  // Se há uma página home definida, renderizar conteúdo com shortcodes
  if (homePage) {
    console.log('🎨 Renderizando página home dinâmica')
    
    return (
      <div className="public-container">
        <div className="dynamic-home">
          <header className="public-header">
            <h1>{homePage.title}</h1>
          </header>
          <div className="dynamic-content">
            <ContentRenderer content={homePage.content} />
          </div>
        </div>
      </div>
    )
  }

  // Fallback para home estática se não há página dinâmica definida
  console.log('🏠 Renderizando home estática (fallback)')
  return <StaticHome />
}

// Componente de fallback (home estática original)
const StaticHome = () => {
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
    <div className="public-container">
      <div className="public-home">
        <section className="hero-section">
          <h1>Bem-vindo ao Smyrna Wiki</h1>
          <p>Sistema de wiki e gerenciamento de conhecimento simples e eficiente para criar bases de conhecimento modernas e responsivas.</p>
          <div className="hero-actions">
            <Link to="/blog" className="btn btn-primary">
              <FileText size={18} /> Ver Blog
            </Link>
            <Link to="/admin/login" className="btn btn-secondary">
              Área Administrativa
            </Link>
          </div>
        </section>

        <section className="content-sections">
          <div className="section-card">
            <h2><FileText size={24} /> Artigos Recentes do Wiki</h2>
            {pages.length > 0 ? (
              <div className="content-list">
                {pages.slice(0, 3).map(page => (
                  <div key={page.id} className="content-item">
                    <h3>
                      <Link to={`/page/${page.slug || generateSlug(page.title, page.id)}`}>
                        {page.title}
                      </Link>
                    </h3>
                    <p className="page-excerpt">
                      {page.content.length > 150 
                        ? page.content.substring(0, 150) + '...' 
                        : page.content}
                    </p>
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
              <div className="no-content">
                <FileText size={48} />
                <p>Nenhuma página publicada ainda.</p>
              </div>
            )}
          </div>

          <div className="section-card">
            <h2><FileText size={24} /> Posts Recentes</h2>
            {posts.length > 0 ? (
              <div className="content-list">
                {posts.slice(0, 3).map(post => (
                  <div key={post.id} className="content-item">
                    <h3>
                      <Link to={`/blog/${generateSlug(post.title, post.id)}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="post-excerpt">
                      {post.content.length > 150 
                        ? post.content.substring(0, 150) + '...' 
                        : post.content}
                    </p>
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
              <div className="no-content">
                <FileText size={48} />
                <p>Nenhum post publicado ainda.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default DynamicHome
