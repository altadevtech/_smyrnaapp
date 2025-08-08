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
        <Link to="/blog" className="back-button">
          <ArrowLeft size={18} /> Voltar ao blog
        </Link>
      </header>

      <article className="public-content">
        <header className="content-header">
          <h1>{post.title}</h1>
          <div className="content-meta">
            <span className="meta-item">
              <User size={16} />
              Por {post.author_name}
            </span>
            <span className="meta-item">
              <Calendar size={16} />
              Publicado em {new Date(post.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </header>

        <div className="content-body">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
          />
        </div>
      </article>
    </div>
  )
}

export default PublicPost
