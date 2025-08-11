import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Calendar, User, Tag, BookOpen, ArrowRight, FileText } from 'lucide-react'
import BlogSidebar from '../components/BlogSidebar'

const PublicBlog = () => {
  const [posts, setPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categories, setCategories] = useState([])
  
  const { categorySlug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
    fetchCategories()
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
      const response = await api.get('/categories/stats/with-posts')
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

      {selectedCategory && (
        <div className="filter-header">
          <div className="filter-info">
            <Tag size={18} />
            <span>Postagens em: <strong>{selectedCategory.name}</strong></span>
          </div>
          <button 
            onClick={() => filterByCategory(null)}
            className="clear-filter-btn"
          >
            Ver todas as postagens
          </button>
        </div>
      )}

      <div className="blog-layout">
        <main className="public-content">
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map(post => (
                <article key={post.id} className="post-card">
                  <div className="post-content">
                    {post.category_name && (
                      <div className="post-category" style={{ marginBottom: '0.75rem' }}>
                        <span 
                          className="category-tag" 
                          style={{ 
                            backgroundColor: post.category_color || '#6366f1',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}
                        >
                          {post.category_name}
                        </span>
                      </div>
                    )}
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

        <BlogSidebar 
          onCategorySelect={filterByCategory}
          selectedCategorySlug={selectedCategory?.slug}
        />
      </div>
    </div>
  )
}

export default PublicBlog
