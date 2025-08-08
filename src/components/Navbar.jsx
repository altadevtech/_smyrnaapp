import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, FileText, Users, Home, Settings, Layout } from 'lucide-react'
import api from '../services/api'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [publicPages, setPublicPages] = useState([])

  useEffect(() => {
    // Carregar páginas públicas para o menu (sem dependência de autenticação)
    const loadPublicPages = async () => {
      try {
        console.log('📋 Carregando páginas públicas para menu...')
        const response = await api.get('/pages/public')
        console.log('✅ Páginas públicas carregadas:', response.data.length)
        
        // Filtrar páginas únicas e válidas
        const uniquePages = response.data.filter((page, index, self) => 
          page.title && page.title.trim() !== '' && 
          self.findIndex(p => p.id === page.id) === index
        )
        
        setPublicPages(uniquePages)
      } catch (error) {
        console.error('❌ Erro ao carregar páginas públicas:', error)
        setPublicPages([])
      }
    }
    
    loadPublicPages()
  }, []) // Removida dependência de user

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'white' }}>
            Smyrna CMS
          </Link>
          
          {user ? (
            // Menu para usuários logados (Admin)
            <ul style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <li><Link to="/dashboard"><Settings size={18} /> Dashboard</Link></li>
              <li><Link to="/admin/pages"><FileText size={18} /> Admin Páginas</Link></li>
              <li><Link to="/admin/posts"><FileText size={18} /> Admin Posts</Link></li>
              {user.role === 'admin' && (
                <>
                  <li><Link to="/admin/users"><Users size={18} /> Usuários</Link></li>
                  <li><Link to="/admin/templates"><Layout size={18} /> Templates</Link></li>
                </>
              )}
              <li>
                <span style={{ color: 'white', marginRight: '1rem' }}>
                  <User size={18} style={{ verticalAlign: 'middle' }} /> {user.name} ({user.role})
                </span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem' }}>
                  <LogOut size={18} />
                </button>
              </li>
            </ul>
          ) : (
            // Menu para visitantes públicos
            <ul style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <li><Link to="/"><Home size={18} /> Início</Link></li>
              
              {/* Páginas dinâmicas criadas via admin */}
              {publicPages.map(page => (
                <li key={page.id}>
                  <Link to={`/page/${page.slug || page.id}`}>
                    <FileText size={18} /> {page.title}
                  </Link>
                </li>
              ))}
              
              <li><Link to="/blog"><FileText size={18} /> Blog</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
