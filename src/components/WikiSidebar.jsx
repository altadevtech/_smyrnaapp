import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api from '../services/api'
import { 
  ChevronDown, ChevronRight, Search, Tag, 
  FileText, Home, Folder, FolderOpen 
} from 'lucide-react'

const WikiSidebar = () => {
  const [categories, setCategories] = useState([])
  const [pages, setPages] = useState([])
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPages, setFilteredPages] = useState([])
  const location = useLocation()

  useEffect(() => {
    fetchCategories()
    fetchPages()
  }, [])

  useEffect(() => {
    filterPages()
  }, [pages, searchTerm])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories?type=wiki&hierarchical=true')
      setCategories(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const fetchPages = async () => {
    try {
      const response = await api.get('/pages/public')
      setPages(response.data)
    } catch (error) {
      console.error('Erro ao carregar wiki:', error)
    }
  }

  const filterPages = () => {
    if (!searchTerm) {
      setFilteredPages(pages)
      return
    }
    
    try {
      const search = searchTerm.toLowerCase()
      const filtered = pages.filter(page =>
        page.title?.toLowerCase().includes(search) ||
        page.content?.toLowerCase().includes(search)
      )
      setFilteredPages(filtered)
    } catch (error) {
      console.error('Erro ao filtrar wiki:', error)
      setFilteredPages([])
    }
  }

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getPagesByCategory = (categoryId) => {
    return filteredPages.filter(page => page.category_id === categoryId)
  }

  const getUncategorizedPages = () => {
    return filteredPages.filter(page => !page.category_id)
  }

  const getHomePage = () => {
    return pages.find(page => page.is_home)
  }

  const isCurrentPage = (slug) => {
    return location.pathname === `/wiki/${slug}` || location.pathname === `/${slug}`
  }

  return (
    <div style={{ 
      width: '280px', 
      height: '100vh', 
      overflowY: 'auto',
      borderRight: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      padding: '1rem'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          fontSize: '1.25rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <FileText size={20} style={{ marginRight: '0.5rem' }} />
          Wiki Navigation
        </h2>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ 
            position: 'absolute', 
            left: '0.75rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#6b7280' 
          }} />
          <input
            type="text"
            placeholder="Buscar no wiki..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '2.5rem',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      {/* Home Page */}
      {getHomePage() && (
        <div style={{ marginBottom: '1rem' }}>
          <Link
            to={`/${getHomePage().slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              color: isCurrentPage(getHomePage().slug) ? '#1f2937' : '#4b5563',
              backgroundColor: isCurrentPage(getHomePage().slug) ? '#e5e7eb' : 'transparent',
              fontWeight: isCurrentPage(getHomePage().slug) ? 'bold' : 'normal'
            }}
          >
            <Home size={16} style={{ marginRight: '0.5rem', color: '#10b981' }} />
            {getHomePage().title}
          </Link>
        </div>
      )}

      {/* Categories with Pages */}
      <div style={{ marginBottom: '1rem' }}>
        {categories.map(category => {
          const categoryPages = getPagesByCategory(category.id)
          const isExpanded = expandedCategories.has(category.id)
          
          // Contar páginas incluindo subcategorias
          const allPages = categoryPages.concat(
            ...(category.subcategories || []).map(sub => getPagesByCategory(sub.id))
          )
          
          if (allPages.length === 0 && !searchTerm && (!category.subcategories || category.subcategories.length === 0)) return null

          return (
            <div key={category.id} style={{ marginBottom: '0.5rem' }}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: '#374151'
                }}
              >
                {isExpanded ? 
                  <ChevronDown size={14} style={{ marginRight: '0.25rem' }} /> :
                  <ChevronRight size={14} style={{ marginRight: '0.25rem' }} />
                }
                {isExpanded ? 
                  <FolderOpen size={16} style={{ marginRight: '0.5rem', color: category.color || '#6366f1' }} /> :
                  <Folder size={16} style={{ marginRight: '0.5rem', color: category.color || '#6366f1' }} />
                }
                {category.name} ({allPages.length})
              </button>

              {/* Category Content */}
              {isExpanded && (
                <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }}>
                  {/* Category Pages */}
                  {categoryPages.map(page => (
                    <Link
                      key={page.id}
                      to={`/wiki/${page.slug}`}
                      style={{
                        display: 'block',
                        padding: '0.375rem 0.5rem',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        color: isCurrentPage(page.slug) ? '#1f2937' : '#6b7280',
                        backgroundColor: isCurrentPage(page.slug) ? '#e5e7eb' : 'transparent',
                        marginBottom: '0.125rem'
                      }}
                    >
                      <FileText size={14} style={{ 
                        marginRight: '0.5rem', 
                        verticalAlign: 'middle' 
                      }} />
                      {page.title}
                    </Link>
                  ))}
                  
                  {/* Subcategories */}
                  {category.subcategories && category.subcategories.map(subcategory => {
                    const subcategoryPages = getPagesByCategory(subcategory.id)
                    const isSubExpanded = expandedCategories.has(subcategory.id)
                    
                    if (subcategoryPages.length === 0 && !searchTerm) return null
                    
                    return (
                      <div key={subcategory.id} style={{ marginTop: '0.5rem' }}>
                        {/* Subcategory Header */}
                        <button
                          onClick={() => toggleCategory(subcategory.id)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.375rem 0.5rem',
                            border: 'none',
                            background: 'transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: '#4b5563'
                          }}
                        >
                          {isSubExpanded ? 
                            <ChevronDown size={12} style={{ marginRight: '0.25rem' }} /> :
                            <ChevronRight size={12} style={{ marginRight: '0.25rem' }} />
                          }
                          <Tag size={12} style={{ marginRight: '0.5rem', color: subcategory.color || '#8b5cf6' }} />
                          {subcategory.name} ({subcategoryPages.length})
                        </button>
                        
                        {/* Subcategory Pages */}
                        {isSubExpanded && (
                          <div style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                            {subcategoryPages.map(page => (
                              <Link
                                key={page.id}
                                to={`/wiki/${page.slug}`}
                                style={{
                                  display: 'block',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  textDecoration: 'none',
                                  fontSize: '0.8rem',
                                  color: isCurrentPage(page.slug) ? '#1f2937' : '#6b7280',
                                  backgroundColor: isCurrentPage(page.slug) ? '#e5e7eb' : 'transparent',
                                  marginBottom: '0.125rem'
                                }}
                              >
                                <FileText size={12} style={{ 
                                  marginRight: '0.5rem', 
                                  verticalAlign: 'middle' 
                                }} />
                                {page.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Uncategorized Pages */}
      {getUncategorizedPages().length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => toggleCategory('uncategorized')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              border: 'none',
              background: 'transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              color: '#6b7280'
            }}
          >
            {expandedCategories.has('uncategorized') ? 
              <ChevronDown size={14} style={{ marginRight: '0.25rem' }} /> :
              <ChevronRight size={14} style={{ marginRight: '0.25rem' }} />
            }
            <Tag size={16} style={{ marginRight: '0.5rem' }} />
            Sem categoria ({getUncategorizedPages().length})
          </button>

          {expandedCategories.has('uncategorized') && (
            <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }}>
              {getUncategorizedPages().map(page => (
                <Link
                  key={page.id}
                  to={`/wiki/${page.slug}`}
                  style={{
                    display: 'block',
                    padding: '0.375rem 0.5rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    color: isCurrentPage(page.slug) ? '#1f2937' : '#6b7280',
                    backgroundColor: isCurrentPage(page.slug) ? '#e5e7eb' : 'transparent',
                    marginBottom: '0.125rem'
                  }}
                >
                  <FileText size={14} style={{ 
                    marginRight: '0.5rem', 
                    verticalAlign: 'middle' 
                  }} />
                  {page.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchTerm && filteredPages.length === 0 && (
        <div style={{ 
          padding: '1rem', 
          textAlign: 'center', 
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          Nenhuma página encontrada
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: 'auto', 
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb',
        fontSize: '0.75rem',
        color: '#9ca3af'
      }}>
        {filteredPages.length} página{filteredPages.length !== 1 ? 's' : ''} encontrada{filteredPages.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}

export default WikiSidebar