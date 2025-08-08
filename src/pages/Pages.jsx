import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

const Pages = () => {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPages()
  }, [])

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

  if (loading) {
    return <div className="loading">Carregando páginas...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Páginas</h1>
        <Link to="/admin/pages/new" className="btn btn-primary">
          <Plus size={18} style={{ verticalAlign: 'middle' }} /> Nova Página
        </Link>
      </div>

      {pages.length > 0 ? (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Template</th>
                <th>Status</th>
                <th>Home</th>
                <th>Autor</th>
                <th>Data de Criação</th>
                <th>Última Atualização</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id}>
                  <td><strong>{page.title}</strong></td>
                  <td>{page.template_name || 'Template Padrão'}</td>
                  <td>
                    <span className={`status-badge status-${page.status}`}>
                      {page.status === 'published' ? 'Publicada' : 'Rascunho'}
                    </span>
                  </td>
                  <td>
                    {page.is_home && (
                      <span className="status-badge status-published">Home</span>
                    )}
                  </td>
                  <td>{page.author_name}</td>
                  <td>{new Date(page.created_at).toLocaleDateString()}</td>
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
      ) : (
        <div className="card">
          <p>Nenhuma página encontrada. <Link to="/admin/pages/new">Criar primeira página</Link></p>
        </div>
      )}
    </div>
  )
}

export default Pages
