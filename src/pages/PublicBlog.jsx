import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Calendar, User, Tag, BookOpen, ArrowRight, FileText } from 'lucide-react'
import BlogSidebar from '../components/BlogSidebar'
import { getDisplaySummary, formatDate, formatRelativeDate } from '../utils/textUtils'

const PublicBlog = () => {
  const [posts, setPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 980)
  
  const { categorySlug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
    fetchCategories()
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 980)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (allPosts.length > 0 && categories.length > 0) {
      handleCategoryFromUrl()
    }
  }, [allPosts, categories, categorySlug])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/public')
      setAllPosts(response.data)
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    }
    setLoading(false)
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/stats/with-posts?type=blog')
      setCategories(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const handleCategoryFromUrl = () => {
    if (categorySlug) {
      // Encontrar a categoria pelo slug na URL
      const category = categories.find(cat => cat.slug === categorySlug)
      if (category) {
        filterByCategory(category.slug, category.name, false) // false = não navegar
      } else {
        // Se categoria não encontrada, redirecionar para todas
        navigate('/blog')
      }
    } else {
      // Se não há slug, mostrar todos os posts
      setPosts(allPosts)
      setSelectedCategory(null)
    }
  }

  const filterByCategory = (categorySlug, categoryName, shouldNavigate = true) => {
    if (categorySlug === null) {
      // Mostrar todos os posts
      setPosts(allPosts)
      setSelectedCategory(null)
      if (shouldNavigate) {
        navigate('/blog')
      }
    } else {
      // Filtrar posts pela categoria usando category_slug
      const filteredPosts = allPosts.filter(post => post.category_slug === categorySlug)
      setPosts(filteredPosts)
      setSelectedCategory({ slug: categorySlug, name: categoryName })
      
      if (shouldNavigate) {
        navigate(`/blog/categoria/${categorySlug}`)
      }
    }
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
      <div 
        className="public-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}
      >
        <div 
          className="loading"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '2rem',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}
        >
          <div 
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e2e8f0',
              borderTop: '3px solid rgb(102, 234, 205)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          ></div>
          <p style={{ color: '#64748b', margin: '0', fontWeight: '500' }}>
            Carregando posts...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="public-container">
      <header 
        className="public-header"
        style={{
          background: '#f8fafc',
          padding: '2rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Link 
          to="/" 
          className="back-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'rgb(75, 129, 162)',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            background: 'white',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgb(102, 234, 205)'
            e.target.style.color = 'white'
            e.target.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white'
            e.target.style.color = 'rgb(75, 129, 162)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Voltar ao início
        </Link>
        <h1 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '0',
            fontSize: '1.75rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          <FileText size={28} style={{ color: 'rgb(102, 234, 205)' }} /> Blog
        </h1>
      </header>

      {selectedCategory && (
        <div 
          className="filter-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem 2rem',
            marginTop: '1rem',
            marginBottom: '1rem',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1rem' : '0'
          }}
        >
          <div 
            className="filter-info"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#1e293b',
              fontWeight: '500'
            }}
          >
            <Tag size={18} style={{ color: 'rgb(102, 234, 205)' }} />
            <span>
              Postagens em: <strong style={{ color: 'rgb(75, 129, 162)' }}>{selectedCategory.name}</strong>
            </span>
          </div>
          <button 
            onClick={() => filterByCategory(null)}
            className="clear-filter-btn"
            style={{
              background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            Ver todas as postagens
          </button>
        </div>
      )}

      <div 
        className="blog-layout"
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '2rem' : '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '1rem' : '0rem'
        }}
      >
        {isMobile && (
          <div style={{ order: 1, width: '100%', marginBottom: '2rem' }}>
            <BlogSidebar 
              onCategorySelect={filterByCategory}
              selectedCategorySlug={selectedCategory?.slug}
            />
          </div>
        )}
        
        <main 
          className="public-content"
          style={{
            flex: '1',
            minWidth: '0',
            order: isMobile ? 2 : 1
          }}
        >
          {posts.length > 0 ? (
            <div 
              className="posts-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile 
                  ? '1fr' 
                  : window.innerWidth > 1400 
                    ? 'repeat(auto-fill, minmax(350px, 1fr))' 
                    : 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: isMobile ? '1.5rem' : '2rem',
                marginBottom: '4rem'
              }}
            >
              {posts.map(post => (
                <article 
                  key={post.id} 
                  className="post-card"
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '0',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    lineHeight: '1.7',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Imagem destacada - Exibida apenas se existir */}
                  {post.featured_image && (
                    <div 
                      className="post-featured-image"
                      style={{
                        width: '100%',
                        height: '200px',
                        overflow: 'hidden',
                        borderRadius: '12px 12px 0 0',
                        position: 'relative',
                        marginBottom: '0'
                      }}
                    >
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  
                  <div 
                    className="post-content"
                    style={{
                      padding: post.featured_image ? '2rem 2rem' : '2rem'
                    }}
                  >
                    {post.category_name && (
                      <div 
                        className="post-category" 
                        style={{ 
                          marginBottom: '1.5rem',
                          display: 'flex',
                          justifyContent: 'flex-start'
                        }}
                      >
                        <span 
                          className="category-tag" 
                          style={{ 
                            background: `linear-gradient(135deg, ${post.category_color || '#6366f1'}, ${post.category_color || '#6366f1'}dd)`,
                            color: 'white',
                            padding: '0.375rem 0.875rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            border: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {post.category_name}
                        </span>
                      </div>
                    )}
                    <h2 
                      className="post-title"
                      style={{
                        margin: '0 0 1.5rem 0',
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        lineHeight: '1.5',
                        color: '#1e293b'
                      }}
                    >
                      <Link 
                        to={`/blog/${post.slug || generateSlug(post.title, post.id)}`}
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                          background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.textDecoration = 'underline'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.textDecoration = 'none'
                        }}
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p 
                      className="post-excerpt"
                      style={{
                        color: '#64748b',
                        lineHeight: '1.8',
                        marginBottom: '1.5rem',
                        fontSize: '0.95rem',
                        position: 'relative'
                      }}
                    >
                      {getDisplaySummary(post.summary, post.content, 250)}
                    </p>
                    
                    {/* Botão de ler mais */}
                    <Link 
                      to={`/blog/${post.slug || generateSlug(post.title, post.id)}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'white',
                        background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        marginBottom: '1.5rem',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <BookOpen size={16} />
                      Ler artigo completo
                    </Link>
                    <div 
                      className="post-meta"
                      style={{
                        display: 'flex',
                        gap: '1.5rem',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        color: '#64748b',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid #e2e8f0'
                      }}
                    >
                      <span 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          fontWeight: '500'
                        }}
                      >
                        <User size={14} style={{ color: 'rgb(102, 234, 205)' }} /> 
                        {post.author_name}
                      </span>
                      <span 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          fontWeight: '500'
                        }}
                      >
                        <Calendar size={14} style={{ color: 'rgb(75, 129, 162)' }} /> 
                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div 
              className="no-content"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}
            >
              <FileText 
                size={64} 
                style={{ 
                  color: 'rgb(102, 234, 205)',
                  marginBottom: '1rem'
                }} 
              />
              <h2 
                style={{
                  color: '#1e293b',
                  marginBottom: '0.5rem',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}
              >
                Nenhum post encontrado
              </h2>
              <p 
                style={{
                  color: '#64748b',
                  fontSize: '1rem',
                  margin: '0'
                }}
              >
                Ainda não há posts publicados no blog.
              </p>
            </div>
          )}
        </main>

        {!isMobile && (
          <BlogSidebar 
            onCategorySelect={filterByCategory}
            selectedCategorySlug={selectedCategory?.slug}
          />
        )}
      </div>
    </div>
  )
}

export default PublicBlog
