import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Calendar, User, FileText, ArrowRight, BookOpen, Search, Filter, Tag, X } from 'lucide-react'
import { getDisplaySummary, formatDate, formatRelativeDate } from '../utils/textUtils'

const PublicPages = () => {
  const [pages, setPages] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchPages()
    fetchCategories()
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchPages()
  }, [searchTerm, selectedCategory, tagFilter])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories?type=wiki')
      setCategories(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const fetchPages = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)
      if (tagFilter) params.append('tag', tagFilter)
      
      const response = await api.get(`/pages/public?${params.toString()}`)
      console.log('📄 Páginas recebidas da API:', response.data)
      console.log('📊 Total de páginas:', response.data.length)
      setPages(response.data)
    } catch (error) {
      console.error('Erro ao carregar páginas do wiki:', error)
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

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setTagFilter('')
  }

  const hasActiveFilters = searchTerm || selectedCategory || tagFilter

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1.1rem',
        color: '#64748b'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '2rem',
          background: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid rgb(102, 234, 205)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#64748b', margin: '0', fontWeight: '500' }}>
            Carregando wiki...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '1rem' : '2rem 1rem',
      fontFamily: 'Arial, Tahoma, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
        padding: '4rem 2rem',
        borderRadius: '20px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '40%',
          height: '200%',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'rotate(15deg)'
        }}></div>
        <h1 style={{
          margin: '0 0 1rem 0',
          fontSize: isMobile ? '2.5rem' : '3.5rem',
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1
        }}>
          <BookOpen 
            size={isMobile ? 40 : 56} 
            style={{ 
              marginRight: '1rem', 
              verticalAlign: 'middle',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
            }} 
          />
          Wiki
        </h1>
        <p style={{
          margin: 0,
          fontSize: isMobile ? '1rem' : '1.25rem',
          opacity: 0.9,
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6,
          position: 'relative',
          zIndex: 1
        }}>
          Base de conhecimento e documentação
        </p>
        <Link 
          to="/" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'white',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            marginTop: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> 
          Voltar ao início
        </Link>
      </div>

      {/* Search and Filters */}
      <div style={{
        background: '#f8fafc',
        padding: '2rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        border: '1px solid #e2e8f0'
      }}>
        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: showFilters ? '1.5rem' : '1rem'
        }}>
          <Search 
            size={20} 
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b'
            }}
          />
          <input
            type="text"
            placeholder="Buscar por título ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              background: 'white',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgb(102, 234, 205)'
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 234, 205, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0'
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          />
        </div>

        {/* Toggle Filters Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: showFilters ? 'rgb(102, 234, 205)' : 'white',
              color: showFilters ? 'white' : '#64748b',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            <Filter size={16} />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              <X size={16} />
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '1rem',
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            {/* Category Filter */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'white'
                }}
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Tag
              </label>
              <div style={{ position: 'relative' }}>
                <Tag 
                  size={16} 
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b'
                  }}
                />
                <input
                  type="text"
                  placeholder="Digite uma tag..."
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: 'white'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(102, 234, 205, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(102, 234, 205, 0.3)'
          }}>
            <div style={{
              fontSize: '0.85rem',
              color: '#374151',
              marginBottom: '0.5rem',
              fontWeight: '600'
            }}>
              Filtros ativos:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {searchTerm && (
                <span style={{
                  background: 'rgba(102, 234, 205, 0.2)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  color: '#374151'
                }}>
                  Busca: "{searchTerm}"
                </span>
              )}
              {selectedCategory && (
                <span style={{
                  background: 'rgba(102, 234, 205, 0.2)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  color: '#374151'
                }}>
                  Categoria: {categories.find(c => c.id == selectedCategory)?.name}
                </span>
              )}
              {tagFilter && (
                <span style={{
                  background: 'rgba(102, 234, 205, 0.2)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  color: '#374151'
                }}>
                  Tag: #{tagFilter}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Counter */}
      {pages.length > 0 && (
        <div style={{
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(102, 234, 205, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(102, 234, 205, 0.2)',
          fontSize: '0.9rem',
          color: '#374151'
        }}>
          <strong>{pages.length}</strong> {pages.length === 1 ? 'página encontrada' : 'páginas encontradas'}
          {hasActiveFilters && ' com os filtros aplicados'}
        </div>
      )}

      {/* Pages Grid */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {pages.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : window.innerWidth > 1400 
                ? 'repeat(auto-fill, minmax(350px, 1fr))' 
                : 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: isMobile ? '1.5rem' : '2rem',
            marginBottom: '4rem'
          }}>
            {pages.map(page => (
              <article 
                key={page.id} 
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  lineHeight: '1.7'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div>
                  {/* Category Badge */}
                  {page.category_name && (
                    <div style={{
                      marginBottom: '1rem'
                    }}>
                      <span style={{
                        background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {page.category_name}
                      </span>
                    </div>
                  )}

                  <h2 style={{
                    margin: '0 0 1.5rem 0',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    lineHeight: '1.5',
                    color: '#1e293b'
                  }}>
                    <Link 
                      to={`/page/${page.slug || generateSlug(page.title, page.id)}`}
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
                      {page.title}
                    </Link>
                  </h2>
                  
                  <p style={{
                    color: '#64748b',
                    lineHeight: '1.8',
                    marginBottom: '1.5rem',
                    fontSize: '0.95rem'
                  }}>
                    {getDisplaySummary(page.summary, page.content, 250)}
                  </p>
                  
                  {/* Tags */}
                  {page.tags && (
                    <div style={{
                      marginBottom: '1.5rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      {page.tags.split(',').map((tag, index) => (
                        <span 
                          key={index}
                          style={{
                            background: '#f1f5f9',
                            color: '#475569',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Read More Button */}
                  <Link 
                    to={`/page/${page.slug || generateSlug(page.title, page.id)}`}
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
                    Ler página completa
                  </Link>
                  
                  <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    color: '#64748b',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontWeight: '500'
                    }}>
                      <User size={14} style={{ color: 'rgb(102, 234, 205)' }} /> 
                      {page.author_name}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontWeight: '500'
                    }}>
                      <Calendar size={14} style={{ color: 'rgb(75, 129, 162)' }} /> 
                      {new Date(page.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            background: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <FileText 
              size={64} 
              style={{ 
                color: 'rgb(102, 234, 205)',
                marginBottom: '1rem'
              }} 
            />
            <h2 style={{
              color: '#1e293b',
              marginBottom: '0.5rem',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              {hasActiveFilters ? 'Nenhuma página encontrada' : 'Nenhuma página disponível'}
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '1rem',
              margin: '0'
            }}>
              {hasActiveFilters 
                ? 'Tente ajustar os filtros de busca para encontrar mais resultados.'
                : 'Ainda não há páginas publicadas no wiki.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(102, 234, 205)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgb(75, 129, 162)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgb(102, 234, 205)'
                }}
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default PublicPages
