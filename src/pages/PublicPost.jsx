import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { Calendar, User, ArrowLeft, Home } from 'lucide-react'

const PublicPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/public/${slug}`)
      setPost(response.data)
    } catch (error) {
      setError('Post não encontrado')
      console.error('Erro ao carregar post:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="public-container">
        <div className="loading">Carregando post...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="public-container">
        <div className="error-page">
          <h1>404 - Post não encontrado</h1>
          <p>{error}</p>
          <Link to="/blog" className="btn btn-primary">
            <ArrowLeft size={18} /> Voltar ao blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="public-container">
      <header className="public-header">
        <nav className="breadcrumb-nav">
          <Link to="/" className="back-button">
            <Home size={18} /> Início
          </Link>
          <span className="breadcrumb-separator">•</span>
          <Link to="/blog" className="back-button">
            Blog
          </Link>
          <span className="breadcrumb-separator">•</span>
          <span className="current-page">{post.title}</span>
        </nav>
      </header>

      <article className="post-article">
        <header className="article-header">
          {post.category_name && (
            <div className="article-category" style={{ marginBottom: '1rem' }}>
              <span 
                className="category-tag" 
                style={{ 
                  backgroundColor: post.category_color || '#6366f1',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {post.category_name}
              </span>
            </div>
          )}
          <h1 className="article-title">{post.title}</h1>
          <div className="article-meta">
            <span className="meta-item">
              <User size={16} />
              Por {post.author_name}
            </span>
            <span className="meta-item">
              <Calendar size={16} />
              {new Date(post.created_at).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </header>

        <div className="article-content">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>')
                .replace(/^(.*)$/, '<p>$1</p>')
            }}
          />
        </div>

        <footer className="article-footer">
          <Link to="/blog" className="back-to-blog">
            <ArrowLeft size={18} /> Voltar ao blog
          </Link>
        </footer>
      </article>
    </div>
  )
}

export default PublicPost
