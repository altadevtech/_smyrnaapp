import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, History } from 'lucide-react'

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
      toast.error('Erro ao carregar wiki')
      console.error(error)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta pagina?')) {
      try {
        await api.delete(`/pages/${id}`)
        toast.success('Pagina excluida com sucesso!')
        fetchPages()
      } catch (error) {
        toast.error('Erro ao excluir pagina')
        console.error(error)
      }
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      await api.patch(`/pages/${id}/status`, { status: newStatus })
      toast.success(`Pagina ${newStatus === 'published' ? 'publicada' : 'despublicada'} com sucesso!`)
      fetchPages()
    } catch (error) {
      toast.error('Erro ao alterar status da pagina')
      console.error(error)
    }
  }

  if (loading) {
    return <div className="loading">Carregando wiki...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1><FileText size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />Wiki</h1>
        <Link to="/admin/pages/new" className="btn btn-primary">
          <Plus size={18} style={{ verticalAlign: 'middle' }} /> Nova Pagina
        </Link>
      </div>

      {pages.length > 0 ? (
        <div className="card" style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <div className="table-responsive">
            <table className="table" style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0',
              margin: '0',
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb'
            }}>
            <thead style={{
              background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
              color: 'white'
            }}>
              <tr>
                <th style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Título</th>
                <th style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Status</th>
                <th style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Autor</th>
                <th className="hide-mobile" style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Atualização</th>
                <th style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id} style={{
                  transition: 'all 0.3s ease',
                  borderBottom: '1px solid #f1f5f9',
                  background: 'white'
                }}>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f1f5f9'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong>{page.title}</strong>
                    </div>
                    {page.template_name && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                        Template: {page.template_name}
                      </div>
                    )}
                  </td>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f1f5f9'
                  }}>
                    <span 
                      className={`status-badge ${page.status}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '25px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        minWidth: '80px',
                        justifyContent: 'center',
                        background: page.status === 'published' 
                          ? 'linear-gradient(135deg, #10b981, #059669)' 
                          : 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        boxShadow: page.status === 'published' 
                          ? '0 2px 8px rgba(16, 185, 129, 0.3)' 
                          : '0 2px 8px rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      {page.status === 'published' ? 'Publicada' : 'Rascunho'}
                    </span>
                  </td>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f1f5f9'
                  }}>{page.author_name}</td>
                  <td className="hide-mobile" style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f1f5f9'
                  }}>{new Date(page.updated_at).toLocaleDateString('pt-BR')}</td>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle'
                  }}>
                    <div className="action-buttons" style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => toggleStatus(page.id, page.status)}
                        className="action-btn view"
                        title={page.status === 'published' ? 'Despublicar' : 'Publicar'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '38px',
                          height: '38px',
                          border: '2px solid #059669',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '0.9rem',
                          textDecoration: 'none',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white'
                        }}
                      >
                        {page.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Link 
                        to={`/admin/pages/${page.id}/versions`} 
                        className="action-btn info"
                        title="Histórico de versões"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '38px',
                          height: '38px',
                          border: '2px solid #0ea5e9',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '0.9rem',
                          textDecoration: 'none',
                          background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
                          color: 'white'
                        }}
                      >
                        <History size={16} />
                      </Link>
                      <Link 
                        to={`/admin/pages/edit/${page.id}`} 
                        className="action-btn edit"
                        title="Editar página"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '38px',
                          height: '38px',
                          border: '2px solid #1d4ed8',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '0.9rem',
                          textDecoration: 'none',
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          color: 'white'
                        }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="action-btn delete"
                        title="Excluir página"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '38px',
                          height: '38px',
                          border: '2px solid #dc2626',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '0.9rem',
                          textDecoration: 'none',
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: 'white'
                        }}
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
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FileText size={64} style={{ color: 'rgb(102, 234, 205)', marginBottom: '1rem' }} />
          <h2>Nenhuma pagina encontrada</h2>
          <p>Ainda nao ha paginas no wiki.</p>
          <Link to="/admin/pages/new" className="btn btn-primary">
            <Plus size={18} style={{ verticalAlign: 'middle' }} /> Criar primeira pagina
          </Link>
        </div>
      )}
    </div>
  )
}

export default Pages