import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { BarChart3, FileText, Users, Eye } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalPages: 0,
    totalPosts: 0,
    totalUsers: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      console.log('Buscando dados do dashboard...')
      const response = await api.get('/dashboard/stats')
      console.log('Dados recebidos:', response.data)
      setStats(response.data)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      console.error('Detalhes do erro:', error.response?.data)
      
      // Tentar buscar dados de teste
      try {
        const testResponse = await api.get('/dashboard/test-db')
        console.log('Teste do banco:', testResponse.data)
      } catch (testError) {
        console.error('Erro no teste do banco:', testError)
      }
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="loading">Carregando dashboard...</div>
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Bem-vindo, <strong>{user.name}</strong>!</p>

      <div className="grid" style={{ marginTop: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FileText size={32} style={{ color: 'var(--primary-color)' }} />
            <div>
              <h3>{stats.totalPages}</h3>
              <p>Wiki</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FileText size={32} style={{ color: 'var(--primary-color)' }} />
            <div>
              <h3>{stats.totalPosts}</h3>
              <p>Posts</p>
            </div>
          </div>
        </div>

        {user.role === 'admin' && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Users size={32} style={{ color: 'var(--primary-color)' }} />
              <div>
                <h3>{stats.totalUsers}</h3>
                <p>Usuários</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>Atividade Recente</h2>
        {stats.recentActivity.length > 0 ? (
          <div className="card recent-activity">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item" style={{ 
                padding: '1rem 0', 
                borderBottom: index < stats.recentActivity.length - 1 ? '1px solid var(--border-color)' : 'none' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={16} style={{ color: 'var(--primary-color)' }} />
                  <span><strong>{activity.author_name}</strong> {activity.action} "{activity.title}"</span>
                  <small style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }}>
                    {new Date(activity.created_at).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <p>Nenhuma atividade recente.</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>Ações Rápidas</h2>
        <div className="quick-actions">
          <a href="/admin/pages/new" className="btn btn-primary">Nova Página</a>
          <a href="/admin/posts/new" className="btn btn-primary">Novo Post</a>
          {user.role === 'admin' && (
            <a href="/admin/users" className="btn">Gerenciar Usuários</a>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
