import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Eye, EyeOff, FileText } from 'lucide-react'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts')
      setPosts(response.data)
    } catch (error) {
      toast.error('Erro ao carregar posts')
      console.error(error)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      try {
        await api.delete(`/posts/${id}`)
        toast.success('Post excluído com sucesso!')
        fetchPosts()
      } catch (error) {
        toast.error('Erro ao excluir post')
        console.error(error)
      }
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      await api.patch(`/posts/${id}/status`, { status: newStatus })
      toast.success(`Post ${newStatus === 'published' ? 'publicado' : 'despublicado'} com sucesso!`)
      fetchPosts()
    } catch (error) {
      toast.error('Erro ao alterar status do post')
      console.error(error)
    }
  }

  if (loading) {
    return <div className="loading">Carregando posts...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Posts</h1>
        <Link to="/admin/posts/new" className="btn btn-primary">
          <Plus size={18} style={{ verticalAlign: 'middle' }} /> Novo Post
        </Link>
      </div>

      {posts.length > 0 ? (
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
                }}>Categoria</th>
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
                }}>Data de Criação</th>
                <th className="hide-mobile" style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Última Atualização</th>
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
              {posts.map(post => (
                <tr key={post.id} style={{
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
                  }}><strong>{post.title}</strong></td>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f1f5f9'
                  }}>
                    {post.category_name ? (
                      <span 
                        className="category-badge" 
                        style={{ 
                          backgroundColor: post.category_color || '#6366f1',
                          color: 'white',
                          padding: '0.375rem 0.875rem',
                          borderRadius: '25px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '80px'
                        }}
                      >
                        {post.category_name}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Sem categoria</span>
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
                      className={`status-badge ${post.status}`}
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
                        background: post.status === 'published' 
                          ? 'linear-gradient(135deg, #10b981, #059669)' 
                          : 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        boxShadow: post.status === 'published' 
                          ? '0 2px 8px rgba(16, 185, 129, 0.3)' 
                          : '0 2px 8px rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f1f5f9'
                  }}>{post.author_name}</td>
                  <td className="hide-mobile" style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f1f5f9'
                  }}>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="hide-mobile" style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f1f5f9'
                  }}>{new Date(post.updated_at).toLocaleDateString()}</td>
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
                        onClick={() => toggleStatus(post.id, post.status)}
                        className="action-btn view"
                        title={post.status === 'published' ? 'Despublicar' : 'Publicar'}
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
                        {post.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Link 
                        to={`/admin/posts/edit/${post.id}`} 
                        className="action-btn edit"
                        title="Editar post"
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
                        onClick={() => handleDelete(post.id)}
                        className="action-btn delete"
                        title="Excluir post"
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
          <h2>Nenhum post encontrado</h2>
          <p>Ainda não há posts no blog.</p>
          <Link to="/admin/posts/new" className="btn btn-primary">
            <Plus size={18} style={{ verticalAlign: 'middle' }} /> Criar primeiro post
          </Link>
        </div>
      )}
    </div>
  )
}

export default Posts
