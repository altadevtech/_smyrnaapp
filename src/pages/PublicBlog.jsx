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
                <div className="post-content">
                  <h2 className="post-title">
                    <Link to={`/blog/${generateSlug(post.title, post.id)}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="post-excerpt">
                    {post.content.length > 200 
                      ? post.content.substring(0, 200) + '...' 
                      : post.content}
                  </p>
                  <div className="post-meta">
                    <span><User size={14} /> {post.author_name}</span>
                    <span><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-content">
            <FileText size={64} />
            <h2>Nenhum post encontrado</h2>
            <p>Ainda não há posts publicados no blog.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default PublicBlog
