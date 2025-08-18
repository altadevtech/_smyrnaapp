import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Tag, Hash, BookOpen, FolderOpen, Folder, FileText, ChevronDown, ChevronRight } from 'lucide-react'

const WikiSidebar = ({ onCategorySelect, selectedCategorySlug, onSubCategorySelect, selectedSubCategorySlug }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 980)
  const [expandedCategories, setExpandedCategories] = useState(new Set())

  useEffect(() => {
    fetchCategoriesWithPages()
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 980)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchCategoriesWithPages = async () => {
    try {
      const response = await api.get('/categories/stats/with-pages?type=wiki')
      const categoriesData = response.data
      
      // Organizar em hierarquia (categorias principais e subcategorias)
      const hierarchicalData = categoriesData.map(category => ({
        ...category,
        subcategories: categoriesData.filter(sub => sub.parent_id === category.id),
        pages: category.pages || []
      })).filter(category => !category.parent_id) // Apenas categorias principais
      
      setCategories(hierarchicalData)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
    setLoading(false)
  }

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category.slug, category.name)
    }
    // Expandir automaticamente quando selecionada
    toggleCategory(category.slug)
  }

  const handleSubCategoryClick = (subcategory, parentSlug) => {
    if (onSubCategorySelect) {
      onSubCategorySelect(subcategory.slug, subcategory.name, parentSlug)
    }
  }

  const handleShowAll = () => {
    if (onCategorySelect) {
      onCategorySelect(null)
    }
    if (onSubCategorySelect) {
      onSubCategorySelect(null)
    }
  }

  const toggleCategory = (categorySlug) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categorySlug)) {
      newExpanded.delete(categorySlug)
    } else {
      newExpanded.add(categorySlug)
    }
    setExpandedCategories(newExpanded)
  }

  const getTotalPagesForCategory = (category) => {
    const mainPages = category.page_count || 0
    const subPages = category.subcategories?.reduce((total, sub) => total + (sub.page_count || 0), 0) || 0
    return mainPages + subPages
  }

  if (loading) {
    return (
      <aside 
        className="wiki-sidebar"
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
              margin: '0 0 1.5rem 0',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1f2937',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #e2e8f0'
            }}
          >
            <BookOpen size={18} /> Categorias
          </h3>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '2rem',
            color: '#64748b' 
          }}>
            Carregando categorias...
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside 
      className="wiki-sidebar"
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
            margin: '0 0 1.5rem 0',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#1f2937',
            paddingBottom: '0.75rem',
            borderBottom: '2px solid #e2e8f0'
          }}
        >
          <BookOpen size={18} /> Categorias
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
            {/* Botão "Todas as Páginas" */}
            <li className="category-item" style={{ marginBottom: '0.75rem' }}>
              <button 
                onClick={handleShowAll}
                className={`category-link ${selectedCategorySlug === null && selectedSubCategorySlug === null ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '1rem',
                  background: selectedCategorySlug === null && selectedSubCategorySlug === null
                    ? 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)'
                    : 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  color: selectedCategorySlug === null && selectedSubCategorySlug === null ? 'white' : 'inherit',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategorySlug !== null || selectedSubCategorySlug !== null) {
                    e.target.style.background = '#f1f5f9'
                    e.target.style.borderColor = '#cbd5e1'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategorySlug !== null || selectedSubCategorySlug !== null) {
                    e.target.style.background = 'white'
                    e.target.style.borderColor = '#e2e8f0'
                  }
                }}
              >
                <div 
                  className="category-color"
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    flexShrink: '0',
                    backgroundColor: selectedCategorySlug === null && selectedSubCategorySlug === null ? 'rgba(255, 255, 255, 0.3)' : '#10b981'
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
                  Todas as Páginas
                </span>
                <span 
                  className="page-count"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    opacity: '0.8'
                  }}
                >
                  <FileText size={14} />
                  {categories.reduce((total, cat) => total + getTotalPagesForCategory(cat), 0)}
                </span>
              </button>
            </li>

            {/* Lista de Categorias */}
            {categories.map(category => {
              const isExpanded = expandedCategories.has(category.slug)
              const isSelected = selectedCategorySlug === category.slug
              const totalPages = getTotalPagesForCategory(category)

              return (
                <li key={category.id} className="category-item" style={{ marginBottom: '0.75rem' }}>
                  {/* Categoria Principal */}
                  <div>
                    <button 
                      onClick={() => handleCategoryClick(category)}
                      className={`category-link ${isSelected ? 'active' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '1rem',
                        background: isSelected 
                          ? 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)'
                          : 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        color: isSelected ? 'white' : 'inherit',
                        fontFamily: 'inherit'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.target.style.background = '#f1f5f9'
                          e.target.style.borderColor = '#cbd5e1'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.target.style.background = 'white'
                          e.target.style.borderColor = '#e2e8f0'
                        }
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flex: '1'
                      }}>
                        {/* Expand/Collapse Icon */}
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCategory(category.slug)
                            }}
                            style={{
                              cursor: 'pointer',
                              padding: '0.125rem',
                              borderRadius: '2px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {isExpanded ? 
                              <ChevronDown size={14} /> : 
                              <ChevronRight size={14} />
                            }
                          </div>
                        )}
                        
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
                      </div>
                      
                      <span 
                        className="page-count"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.875rem',
                          opacity: '0.8'
                        }}
                      >
                        <FileText size={14} />
                        {totalPages}
                      </span>
                    </button>

                    {/* Subcategorias */}
                    {isExpanded && category.subcategories && category.subcategories.length > 0 && (
                      <div style={{ 
                        marginTop: '0.5rem',
                        marginLeft: '1rem',
                        borderLeft: '2px solid #e2e8f0',
                        paddingLeft: '0.75rem'
                      }}>
                        {category.subcategories.map(subcategory => {
                          const isSubSelected = selectedSubCategorySlug === subcategory.slug
                          
                          return (
                            <button
                              key={subcategory.id}
                              onClick={() => handleSubCategoryClick(subcategory, category.slug)}
                              className={`subcategory-link ${isSubSelected ? 'active' : ''}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '100%',
                                padding: '0.75rem 1rem',
                                marginBottom: '0.25rem',
                                background: isSubSelected 
                                  ? 'linear-gradient(135deg, rgba(102, 234, 205, 0.15) 0%, rgba(75, 129, 162, 0.15) 100%)'
                                  : 'transparent',
                                border: isSubSelected ? '1px solid rgba(102, 234, 205, 0.3)' : '1px solid transparent',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontSize: '0.85rem',
                                textDecoration: 'none',
                                color: isSubSelected ? '#0f766e' : '#64748b',
                                fontFamily: 'inherit'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubSelected) {
                                  e.target.style.background = 'rgba(241, 245, 249, 0.5)'
                                  e.target.style.borderColor = 'rgba(203, 213, 225, 0.5)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubSelected) {
                                  e.target.style.background = 'transparent'
                                  e.target.style.borderColor = 'transparent'
                                }
                              }}
                            >
                              <div 
                                className="subcategory-color"
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  flexShrink: '0',
                                  backgroundColor: subcategory.color || category.color
                                }}
                              />
                              <span 
                                className="subcategory-name"
                                style={{
                                  flex: '1',
                                  fontWeight: '500',
                                  textAlign: 'left'
                                }}
                              >
                                {subcategory.name}
                              </span>
                              <span 
                                className="page-count"
                                style={{
                                  fontSize: '0.75rem',
                                  opacity: '0.7'
                                }}
                              >
                                {subcategory.page_count || 0}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="no-categories" style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            color: '#64748b',
            fontSize: '0.9rem'
          }}>
            <BookOpen size={32} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.5 }} />
            <p>Nenhuma categoria encontrada</p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {categories.length > 0 && (
        <div className="sidebar-footer" style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.875rem',
          color: '#64748b',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            📚 {categories.length} categoria{categories.length !== 1 ? 's' : ''}
          </div>
          <div>
            📄 {categories.reduce((total, cat) => total + getTotalPagesForCategory(cat), 0)} página{categories.reduce((total, cat) => total + getTotalPagesForCategory(cat), 0) !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </aside>
  )
}

export default WikiSidebar
