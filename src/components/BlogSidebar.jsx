import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Tag, Hash } from 'lucide-react'

const BlogSidebar = ({ onCategorySelect, selectedCategorySlug }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategoriesWithPosts()
  }, [])

  const fetchCategoriesWithPosts = async () => {
    try {
      const response = await api.get('/categories/stats/with-posts')
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
      <aside className="blog-sidebar">
        <div className="sidebar-section">
          <h3><Tag size={18} /> Categorias</h3>
          <div className="loading">Carregando...</div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="blog-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <Tag size={18} /> Categorias
        </h3>
        
        {categories.length > 0 ? (
          <ul className="categories-list">
            <li className="category-item">
              <button 
                onClick={handleShowAll}
                className={`category-link ${selectedCategorySlug === null ? 'active' : ''}`}
              >
                <div 
                  className="category-color"
                  style={{ backgroundColor: 'var(--text-secondary)' }}
                />
                <span className="category-name">Todas as categorias</span>
                <span className="post-count">
                  <Hash size={14} />
                  {categories.reduce((total, cat) => total + cat.post_count, 0)}
                </span>
              </button>
            </li>
            {categories.map(category => (
              <li key={category.id} className="category-item">
                <button 
                  onClick={() => handleCategoryClick(category)}
                  className={`category-link ${selectedCategorySlug === category.slug ? 'active' : ''}`}
                >
                  <div 
                    className="category-color"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="category-name">{category.name}</span>
                  <span className="post-count">
                    <Hash size={14} />
                    {category.post_count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-categories">Nenhuma categoria com posts publicados.</p>
        )}
      </div>

      <style jsx>{`
        .blog-sidebar {
          width: 300px;
          background: var(--card-bg);
          border-radius: 12px;
          overflow: hidden;
          height: fit-content;
          box-shadow: var(--card-shadow);
        }

        .sidebar-section {
          padding: 1.5rem;
        }

        .sidebar-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color);
          margin: 0 0 1rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--border-color);
        }

        .categories-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .category-item {
          margin-bottom: 0.5rem;
        }

        .category-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          text-decoration: none;
          color: var(--text-color);
          border-radius: 8px;
          transition: all 0.2s;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          width: 100%;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
        }

        .category-link:hover {
          background: var(--bg-secondary);
          color: var(--text-color);
          transform: translateY(-1px);
          box-shadow: var(--card-shadow);
        }

        .category-link.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .category-link.active:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .category-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .category-name {
          flex: 1;
          font-weight: 500;
        }

        .post-count {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-weight: 600;
        }

        .no-categories {
          color: var(--text-secondary);
          font-style: italic;
          text-align: center;
          margin: 1rem 0;
        }

        .loading {
          text-align: center;
          color: var(--text-secondary);
          padding: 1rem 0;
        }

        @media (max-width: 768px) {
          .blog-sidebar {
            width: 100%;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </aside>
  )
}

export default BlogSidebar
