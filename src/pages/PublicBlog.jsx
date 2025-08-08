import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Calendar, User, FileText, ArrowRight } from 'lucide-react'

const PublicBlog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/public')
      setPosts(response.data)
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
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
        <div className="loading">Carregando posts...</div>
      </div>
    )
  }

  return (
    <div className="public-container">
      <header className="public-header">
        <Link to="/" className="back-button">
          <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Voltar ao início
        </Link>
        <h1><FileText size={24} /> Blog</h1>
      </header>

      <main className="public-content">
        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map(post => (
              <article key={post.id} className="post-card">
                <header className="post-header">
                  <h2>
                    <Link to={`/blog/${generateSlug(post.title, post.id)}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <div className="post-meta">
                    <span className="meta-item">
                      <User size={14} />
                      {post.author_name}
                    </span>
                    <span className="meta-item">
                      <Calendar size={14} />
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </header>

                <div className="post-excerpt">
                  <p>{post.content.substring(0, 200)}...</p>
                </div>

                <footer className="post-footer">
                  <Link 
                    to={`/blog/${generateSlug(post.title, post.id)}`} 
                    className="read-more"
                  >
                    Ler mais <ArrowRight size={14} />
                  </Link>
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-content">
            <FileText size={48} />
            <h2>Nenhum post publicado ainda</h2>
            <p>Volte em breve para conferir nossos conteúdos!</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default PublicBlog
