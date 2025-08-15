import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { 
  Image, 
  FileText, 
  Video, 
  LogIn, 
  Mail, 
  MonitorSpeaker,
  Calendar,
  User,
  ExternalLink,
  Play
} from 'lucide-react'

const Widget = ({ type, data, config = {} }) => {
  const [loading, setLoading] = useState(false)
  const [news, setNews] = useState([])
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })

  // Carregar notícias se for widget de news
  useEffect(() => {
    if (type === 'news') {
      loadNews()
    }
  }, [type, config.count])

  const loadNews = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/widgets/news/posts?limit=${config.count || 6}`)
      setNews(response.data)
    } catch (error) {
      console.error('Erro ao carregar notícias:', error)
    }
    setLoading(false)
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    // Implementar envio de formulário
    console.log('Formulário de contato:', contactForm)
    alert('Mensagem enviada com sucesso! (simulado)')
    setContactForm({ name: '', email: '', message: '' })
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

  const renderWidget = () => {
    switch (type) {
      case 'banner':
        return (
          <div className="widget-banner" style={{ height: config.height || '300px' }}>
            {config.imageUrl ? (
              <img 
                src={config.imageUrl} 
                alt={config.title || 'Banner'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : config.htmlContent ? (
              <div 
                dangerouslySetInnerHTML={{ __html: config.htmlContent }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div className="banner-placeholder" style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <MonitorSpeaker size={48} />
                  <p>{config.title || 'Banner'}</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'news':
        return (
          <div className="widget-news">
            <h3>{config.title || 'Últimas Notícias'}</h3>
            {loading ? (
              <div>Carregando notícias...</div>
            ) : news.length > 0 ? (
              <div className="news-grid">
                {news.map(post => (
                  <article key={post.id} className="news-item">
                    <h4>
                      <a href={`/blog/${post.slug || generateSlug(post.title, post.id)}`}>
                        {post.title}
                      </a>
                    </h4>
                    <p>{post.content.substring(0, 100)}...</p>
                    <div className="news-meta">
                      <span><User size={14} /> {post.author_name}</span>
                      <span><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p>Nenhuma notícia encontrada.</p>
            )}
          </div>
        )

      case 'login':
        return (
          <div className="widget-login">
            <h3>{config.title || 'Área Restrita'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/admin/login'; }}>
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Digite seu email"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Senha:</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Digite sua senha"
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <LogIn size={16} /> Entrar
              </button>
            </form>
          </div>
        )

      case 'contact':
        return (
          <div className="widget-contact">
            <h3>{config.title || 'Fale Conosco'}</h3>
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label>Nome:</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="email" 
                  className="form-control"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Mensagem:</label>
                <textarea 
                  className="form-control"
                  rows="4"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                <Mail size={16} /> Enviar Mensagem
              </button>
            </form>
          </div>
        )

      case 'image':
        return (
          <div className="widget-image">
            {config.title && <h3>{config.title}</h3>}
            {(config.imageUrl || config.url) ? (
              <img 
                src={config.imageUrl || config.url} 
                alt={config.alt || config.title || 'Imagem'} 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  borderRadius: config.borderRadius || '0px'
                }}
              />
            ) : (
              <div className="image-placeholder" style={{ 
                padding: '60px 20px',
                backgroundColor: '#f8f9fa',
                textAlign: 'center',
                border: '2px dashed #dee2e6',
                borderRadius: '8px'
              }}>
                <Image size={48} style={{ color: '#6c757d' }} />
                <p style={{ color: '#6c757d', marginTop: '16px' }}>Imagem não definida</p>
              </div>
            )}
            {config.caption && (
              <p className="image-caption" style={{ 
                fontSize: '14px', 
                color: '#666',
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                {config.caption}
              </p>
            )}
          </div>
        )

      case 'video':
        return (
          <div className="widget-video">
            {config.title && <h3>{config.title}</h3>}
            {config.videoUrl ? (
              <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                {config.videoUrl.includes('youtube.com') || config.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={config.videoUrl.replace('watch?v=', 'embed/')}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    frameBorder="0"
                    allowFullScreen
                    title={config.title || 'Vídeo'}
                  ></iframe>
                ) : (
                  <video 
                    controls 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  >
                    <source src={config.videoUrl} type="video/mp4" />
                    Seu navegador não suporta vídeo.
                  </video>
                )}
              </div>
            ) : (
              <div className="video-placeholder" style={{ 
                padding: '60px 20px',
                backgroundColor: '#000',
                textAlign: 'center',
                borderRadius: '8px',
                color: '#fff',
                aspectRatio: '16/9'
              }}>
                <Play size={48} />
                <p style={{ marginTop: '16px' }}>Vídeo não definido</p>
              </div>
            )}
          </div>
        )

      case 'content':
        return (
          <div className="widget-content">
            {config.title && <h3>{config.title}</h3>}
            {config.htmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: config.htmlContent }} />
            ) : config.textContent ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {config.textContent}
              </div>
            ) : (
              <div className="content-placeholder" style={{ 
                padding: '40px 20px',
                backgroundColor: '#f8f9fa',
                textAlign: 'center',
                border: '1px dashed #dee2e6',
                borderRadius: '8px'
              }}>
                <FileText size={32} style={{ color: '#6c757d' }} />
                <p style={{ color: '#6c757d', marginTop: '12px' }}>Conteúdo não definido</p>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="widget-unknown">
            <p>Widget tipo "{type}" não reconhecido</p>
          </div>
        )
    }
  }

  return (
    <div className={`widget widget-${type}`} style={{ marginBottom: '2rem' }}>
      {renderWidget()}
    </div>
  )
}

export default Widget
