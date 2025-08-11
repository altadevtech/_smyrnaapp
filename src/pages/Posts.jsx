import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

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
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Autor</th>
                <th>Data de Criação</th>
                <th>Última Atualização</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td><strong>{post.title}</strong></td>
                  <td>
                    {post.category_name ? (
                      <span 
                        className="category-badge" 
                        style={{ 
                          backgroundColor: post.category_color || '#6366f1',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        {post.category_name}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Sem categoria</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${post.status}`}>
                      {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td>{post.author_name}</td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td>{new Date(post.updated_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => toggleStatus(post.id, post.status)}
                        className="btn"
                        style={{ padding: '0.25rem 0.5rem' }}
                        title={post.status === 'published' ? 'Despublicar' : 'Publicar'}
                      >
                        {post.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Link 
                        to={`/admin/posts/edit/${post.id}`} 
                        className="btn"
                        style={{ padding: '0.25rem 0.5rem' }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
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
          <p>Nenhum post encontrado. <Link to="/admin/posts/new">Criar primeiro post</Link></p>
        </div>
      )}
    </div>
  )
}

export default Posts
