import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ModernTable from '../components/ModernTable'
import { Users as UsersIcon, Plus, Edit, Trash2, UserX, UserCheck } from 'lucide-react'

const UsersModern = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
    setLoading(false)
  }

  const toggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await api.put(`/users/${userId}/status`, { status: newStatus })
      fetchUsers()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/users/${userId}`)
        fetchUsers()
      } catch (error) {
        console.error('Erro ao excluir usuário:', error)
      }
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (user) => <strong>{user.name}</strong>
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'role',
      label: 'Papel',
      render: (user) => (
        <span className={`status-badge ${user.role === 'admin' ? 'active' : 'inactive'}`}>
          {user.role === 'admin' ? 'Admin' : 'Editor'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => (
        <span className={`status-badge ${user.status === 'active' ? 'active' : 'inactive'}`}>
          {user.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Data de Criação',
      hideOnMobile: true,
      render: (user) => new Date(user.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (user) => (
        <div className="action-buttons">
          <button
            onClick={() => toggleStatus(user.id, user.status)}
            className="action-btn reset"
            title={user.status === 'active' ? 'Desativar' : 'Ativar'}
          >
            {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
          <Link
            to={`/admin/users/edit/${user.id}`}
            className="action-btn edit"
            title="Editar usuário"
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={() => handleDelete(user.id)}
            className="action-btn delete"
            title="Excluir usuário"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <h1>
          <UsersIcon size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Usuários
        </h1>
        <Link to="/admin/users/new" className="btn btn-primary">
          <Plus size={18} style={{ verticalAlign: 'middle' }} /> Novo Usuário
        </Link>
      </div>

      {/* Tabela Moderna */}
      <div className="card">
        <ModernTable
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="Nenhum usuário encontrado. Crie o primeiro usuário!"
        />
      </div>
    </div>
  )
}

export default UsersModern
