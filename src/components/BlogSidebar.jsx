import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Tag, Hash } from 'lucide-react'

const BlogSidebar = ({ onCategorySelect, selectedCategorySlug }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 980)

  useEffect(() => {
    fetchCategoriesWithPosts()
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 980)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchCategoriesWithPosts = async () => {
    try {
      const response = await api.get('/categories/stats/with-posts?type=blog')
      setCategories(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
    setLoading(false)
  }

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category.slug, category.name)
    }
  }

  const handleShowAll = () => {
    if (onCategorySelect) {
      onCategorySelect(null)
    }
  }

  if (loading) {
    return (
      <aside 
        className="blog-sidebar"
        style={{
          width: isMobile ? '100%' : '300px',
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '2rem',
          height: 'fit-content',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          marginBottom: isMobile ? '2rem' : '0'
        }}
      >
        <div className="sidebar-section" style={{ marginBottom: '2.5rem' }}>
          <h3 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #e2e8f0'
            }}
          >
            <Tag size={18} /> Categorias
          </h3>
          <div 
            className="loading"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              color: '#64748b',
              fontWeight: '500'
            }}
          >
            <div 
              style={{
                width: '24px',
                height: '24px',
                border: '2px solid #e2e8f0',
                borderTop: '2px solid rgb(102, 234, 205)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '0.5rem'
              }}
            ></div>
            Carregando...
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside 
      className="blog-sidebar"
      style={{
        width: isMobile ? '100%' : '300px',
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '2rem',
        height: 'fit-content',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        marginBottom: isMobile ? '2rem' : '0'
      }}
    >
      <div className="sidebar-section" style={{ marginBottom: '2.5rem' }}>
        <h3 
          className="sidebar-title"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '2px solid #e2e8f0'
          }}
        >
          <Tag size={18} /> Categorias
        </h3>
        
        {categories.length > 0 ? (
          <ul 
            className="categories-list"
            style={{
              listStyle: 'none',
              padding: '0',
              margin: '0'
            }}
          >
            <li className="category-item" style={{ marginBottom: '0.75rem' }}>
              <button 
                onClick={handleShowAll}
                className={`category-link ${selectedCategorySlug === null ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '1rem',
                  background: selectedCategorySlug === null 
                    ? 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)'
                    : 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  color: selectedCategorySlug === null ? 'white' : 'inherit',
                  fontSize: 'inherit',
                  fontFamily: 'inherit'
                }}
              >
                <div 
                  className="category-color"
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    flexShrink: '0',
                    backgroundColor: '#64748b'
                  }}
                />
                <span 
                  className="category-name"
                  style={{
                    flex: '1',
                    fontWeight: '500',
                    textAlign: 'left'
                  }}
                >
                  Todas as categorias
                </span>
                <span 
                  className="post-count"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    color: selectedCategorySlug === null ? 'rgba(255, 255, 255, 0.9)' : '#64748b',
                    fontWeight: '600'
                  }}
                >
                  <Hash size={14} />
                  {categories.reduce((total, cat) => total + cat.post_count, 0)}
                </span>
              </button>
            </li>
            {categories.map(category => (
              <li key={category.id} className="category-item" style={{ marginBottom: '0.75rem' }}>
                <button 
                  onClick={() => handleCategoryClick(category)}
                  className={`category-link ${selectedCategorySlug === category.slug ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '1rem',
                    background: selectedCategorySlug === category.slug 
                      ? 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)'
                      : 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    color: selectedCategorySlug === category.slug ? 'white' : 'inherit',
                    fontSize: 'inherit',
                    fontFamily: 'inherit'
                  }}
                >
                  <div 
                    className="category-color"
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      flexShrink: '0',
                      backgroundColor: category.color
                    }}
                  />
                  <span 
                    className="category-name"
                    style={{
                      flex: '1',
                      fontWeight: '500',
                      textAlign: 'left'
                    }}
                  >
                    {category.name}
                  </span>
                  <span 
                    className="post-count"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.875rem',
                      color: selectedCategorySlug === category.slug ? 'rgba(255, 255, 255, 0.9)' : '#64748b',
                      fontWeight: '600'
                    }}
                  >
                    <Hash size={14} />
                    {category.post_count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p 
            className="no-categories"
            style={{
              color: '#64748b',
              textAlign: 'center',
              padding: '1.5rem',
              fontStyle: 'italic',
              lineHeight: '1.6'
            }}
          >
            Nenhuma categoria com posts publicados.
          </p>
        )}
      </div>
    </aside>
  )
}

export default BlogSidebar
