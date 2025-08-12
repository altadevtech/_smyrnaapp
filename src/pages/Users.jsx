import React, { useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor'
  })
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      toast.error('Erro ao carregar usuários')
      console.error(error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData)
        toast.success('Usuário atualizado com sucesso!')
      } else {
        await api.post('/users', formData)
        toast.success('Usuário criado com sucesso!')
      }
      setShowForm(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', password: '', role: 'editor' })
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar usuário')
      console.error(error)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/users/${id}`)
        toast.success('Usuário excluído com sucesso!')
        fetchUsers()
      } catch (error) {
        toast.error('Erro ao excluir usuário')
        console.error(error)
      }
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await api.patch(`/users/${id}/status`, { status: newStatus })
      toast.success(`Usuário ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso!`)
      fetchUsers()
    } catch (error) {
      toast.error('Erro ao alterar status do usuário')
      console.error(error)
    }
  }

  if (loading) {
    return <div className="loading">Carregando usuários...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Usuários</h1>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
        >
          <Plus size={18} style={{ verticalAlign: 'middle' }} /> Novo Usuário
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Senha{editingUser ? ' (deixe em branco para manter a atual)' : ''}:</label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
              />
            </div>
            <div className="form-group">
              <label>Papel:</label>
              <select
                className="form-control"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="actions">
              <button type="submit" className="btn btn-primary">
                {editingUser ? 'Atualizar' : 'Criar'}
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => {
                  setShowForm(false)
                  setEditingUser(null)
                  setFormData({ name: '', email: '', password: '', role: 'editor' })
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {users.length > 0 ? (
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
                }}>Nome</th>
                <th style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Email</th>
                <th style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Papel</th>
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
              {users.map(user => (
                <tr key={user.id} style={{
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
                  }}><strong>{user.name}</strong></td>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f1f5f9'
                  }}>{user.email}</td>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f1f5f9'
                  }}>
                    <span 
                      className={`role-badge role-${user.role}`}
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
                        minWidth: '70px',
                        justifyContent: 'center',
                        background: user.role === 'admin' 
                          ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' 
                          : 'linear-gradient(135deg, #059669, #047857)',
                        color: 'white',
                        boxShadow: user.role === 'admin' 
                          ? '0 2px 8px rgba(124, 58, 237, 0.3)' 
                          : '0 2px 8px rgba(5, 150, 105, 0.3)'
                      }}
                    >
                      {user.role === 'admin' ? 'Admin' : 'Editor'}
                    </span>
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
                      className={`status-badge ${user.status === 'active' ? 'active' : 'inactive'}`}
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
                        background: user.status === 'active' 
                          ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                          : 'linear-gradient(135deg, #6b7280, #4b5563)',
                        color: 'white',
                        boxShadow: user.status === 'active' 
                          ? '0 2px 8px rgba(59, 130, 246, 0.3)' 
                          : '0 2px 8px rgba(107, 114, 128, 0.3)'
                      }}
                    >
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="hide-mobile" style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    border: 'none',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f1f5f9'
                  }}>{new Date(user.created_at).toLocaleDateString()}</td>
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
                        onClick={() => toggleStatus(user.id, user.status)}
                        className="action-btn reset"
                        title={user.status === 'active' ? 'Desativar' : 'Ativar'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '38px',
                          height: '38px',
                          border: '2px solid #d97706',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '0.9rem',
                          textDecoration: 'none',
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: 'white'
                        }}
                      >
                        {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="action-btn edit"
                        title="Editar usuário"
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
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="action-btn delete"
                        title="Excluir usuário"
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
        <div className="card">
          <p>Nenhum usuário encontrado.</p>
        </div>
      )}
    </div>
  )
}

export default Users
