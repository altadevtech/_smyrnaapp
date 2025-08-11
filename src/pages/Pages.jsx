import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Search, Filter, 
  Grid, List, TreePine, Tag, Home, FileText, History
} from 'lucide-react'

const Pages = () => {
  const [pages, setPages] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filterCategory, setFilterCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPages, setFilteredPages] = useState([])

  useEffect(() => {
    fetchPages()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterPages()
  }, [pages, filterCategory, searchTerm])

  const fetchPages = async () => {
    try {
      const response = await api.get('/pages')
      setPages(response.data)
    } catch (error) {
      toast.error('Erro ao carregar páginas')
      console.error(error)
    }
    setLoading(false)
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const filterPages = () => {
    let filtered = pages

    if (filterCategory) {
      filtered = filtered.filter(page => 
        page.category_id === parseInt(filterCategory)
      )
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(page =>
        page.title.toLowerCase().includes(search) ||
        page.content.toLowerCase().includes(search) ||
        page.slug.toLowerCase().includes(search)
      )
    }

    setFilteredPages(filtered)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta página?')) {
      try {
        await api.delete(`/pages/${id}`)
        toast.success('Página excluída com sucesso!')
        fetchPages()
      } catch (error) {
        toast.error('Erro ao excluir página')
        console.error(error)
      }
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      await api.patch(`/pages/${id}/status`, { status: newStatus })
      toast.success(`Página ${newStatus === 'published' ? 'publicada' : 'despublicada'} com sucesso!`)
      fetchPages()
    } catch (error) {
      toast.error('Erro ao alterar status da página')
      console.error(error)
    }
  }

  const renderGridView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
      {filteredPages.map(page => (
        <div key={page.id} className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{page.title}</h3>
            {page.is_home && <Home size={16} color="#10b981" title="Página Home" />}
          </div>
          
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0' }}>
            {page.content ? page.content.substring(0, 100) + '...' : 'Sem conteúdo'}
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className={`status-badge status-${page.status}`}>
              {page.status === 'published' ? 'Publicada' : 'Rascunho'}
            </span>
            {page.template_name && (
              <span style={{ fontSize: '0.8rem', color: '#666' }}>
                {page.template_name}
              </span>
            )}
          </div>
          
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
            <div>Por: {page.author_name}</div>
            <div>Atualizado: {new Date(page.updated_at).toLocaleDateString()}</div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => toggleStatus(page.id, page.status)}
              className="btn"
              style={{ padding: '0.25rem 0.5rem', flex: 1 }}
              title={page.status === 'published' ? 'Despublicar' : 'Publicar'}
            >
              {page.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <Link 
              to={`/admin/pages/${page.id}/versions`} 
              className="btn"
              style={{ padding: '0.25rem 0.5rem', flex: 1 }}
              title="Ver histórico"
            >
              <History size={16} />
            </Link>
            <Link 
              to={`/admin/pages/edit/${page.id}`} 
              className="btn"
              style={{ padding: '0.25rem 0.5rem', flex: 1 }}
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={() => handleDelete(page.id)}
              className="btn btn-danger"
              style={{ padding: '0.25rem 0.5rem', flex: 1 }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoria</th>
            <th>Template</th>
            <th>Status</th>
            <th>Home</th>
            <th>Autor</th>
            <th>Atualização</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredPages.map(page => (
            <tr key={page.id}>
              <td><strong>{page.title}</strong></td>
              <td>
                {page.category_name && (
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    <Tag size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                    {page.category_name}
                  </span>
                )}
              </td>
              <td>{page.template_name || 'Padrão'}</td>
              <td>
                <span className={`status-badge status-${page.status}`}>
                  {page.status === 'published' ? 'Publicada' : 'Rascunho'}
                </span>
              </td>
              <td>
                {page.is_home && (
                  <Home size={16} color="#10b981" title="Página Home" />
                )}
              </td>
              <td>{page.author_name}</td>
              <td>{new Date(page.updated_at).toLocaleDateString()}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => toggleStatus(page.id, page.status)}
                    className="btn"
                    style={{ padding: '0.25rem 0.5rem' }}
                    title={page.status === 'published' ? 'Despublicar' : 'Publicar'}
                  >
                    {page.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <Link 
                    to={`/admin/pages/${page.id}/versions`} 
                    className="btn"
                    style={{ padding: '0.25rem 0.5rem' }}
                    title="Ver histórico"
                  >
                    <History size={16} />
                  </Link>
                  <Link 
                    to={`/admin/pages/edit/${page.id}`} 
                    className="btn"
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="btn btn-danger"
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  if (loading) {
    return <div className="loading">Carregando páginas...</div>
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1><FileText size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />Wiki - Páginas</h1>
        <Link to="/admin/pages/new" className="btn btn-primary">
          <Plus size={18} style={{ verticalAlign: 'middle' }} /> Nova Página
        </Link>
      </div>

      {/* Filtros e Busca */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Busca */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                placeholder="Buscar páginas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  paddingLeft: '2.5rem',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          {/* Filtro por Categoria */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
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

          {/* Modo de Visualização */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : ''}`}
              style={{ padding: '0.5rem' }}
              title="Visualização em Grid"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn ${viewMode === 'list' ? 'btn-primary' : ''}`}
              style={{ padding: '0.5rem' }}
              title="Visualização em Lista"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Mostrando {filteredPages.length} de {pages.length} páginas
        </div>
      </div>

      {/* Conteúdo */}
      {filteredPages.length > 0 ? (
        viewMode === 'grid' ? renderGridView() : renderListView()
      ) : (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666' }}>
            {searchTerm || filterCategory ? 
              'Nenhuma página encontrada com os filtros aplicados.' :
              'Nenhuma página encontrada.'
            }
            {' '}
            <Link to="/admin/pages/new">Criar primeira página</Link>
          </p>
        </div>
      )}
    </div>
  )
}

export default Pages
