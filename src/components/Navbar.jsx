import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { LogOut, User, FileText, Users, Home, Settings, Layout, Menu, X } from 'lucide-react'
import api from '../services/api'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [publicPages, setPublicPages] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link 
            to="/" 
            className="navbar-brand"
            onClick={closeMobileMenu}
          >
            {settings.logo ? (
              <img 
                src={settings.logo} 
                alt={settings.siteName}
                className="navbar-logo"
              />
            ) : (
              settings.siteName
            )}
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop Menu */}
          <div className="desktop-menu">
            {user ? (
              // Menu para usuários logados (Admin)
              <ul className="nav-list">
                <li><Link to="/dashboard"><Settings size={18} /> Dashboard</Link></li>
                <li><Link to="/admin/pages"><FileText size={18} /> Páginas</Link></li>
                <li><Link to="/admin/posts"><FileText size={18} /> Posts</Link></li>
                {user.role === 'admin' && (
                  <>
                    <li><Link to="/admin/users"><Users size={18} /> Usuários</Link></li>
                    <li><Link to="/admin/templates"><Layout size={18} /> Templates</Link></li>
                  </>
                )}
                <li><Link to="/profile"><User size={18} /> Perfil</Link></li>
                <li className="user-info">
                  <span>{user.name} ({user.role})</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={18} />
                  </button>
                </li>
              </ul>
            ) : (
              // Menu para visitantes públicos
              <ul className="nav-list">
                <li><Link to="/"><Home size={18} /> Início</Link></li>
                
                {/* Páginas dinâmicas criadas via admin */}
                {publicPages.slice(0, 3).map(page => (
                  <li key={page.id}>
                    <Link to={`/page/${page.slug || page.id}`}>
                      <FileText size={18} /> {page.title}
                    </Link>
                  </li>
                ))}
                
                <li><Link to="/blog"><FileText size={18} /> Blog</Link></li>
                <li><Link to="/login" className="login-btn">Login</Link></li>
              </ul>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {user ? (
            // Menu mobile para usuários logados
            <ul className="mobile-nav-list">
              <li className="mobile-user-info">
                <User size={18} />
                <span>{user.name} ({user.role})</span>
              </li>
              <li><Link to="/dashboard" onClick={closeMobileMenu}><Settings size={18} /> Dashboard</Link></li>
              <li><Link to="/admin/pages" onClick={closeMobileMenu}><FileText size={18} /> Páginas</Link></li>
              <li><Link to="/admin/posts" onClick={closeMobileMenu}><FileText size={18} /> Posts</Link></li>
              {user.role === 'admin' && (
                <>
                  <li><Link to="/admin/users" onClick={closeMobileMenu}><Users size={18} /> Usuários</Link></li>
                  <li><Link to="/admin/templates" onClick={closeMobileMenu}><Layout size={18} /> Templates</Link></li>
                </>
              )}
              <li><Link to="/profile" onClick={closeMobileMenu}><User size={18} /> Perfil</Link></li>
              <li>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <LogOut size={18} /> Sair
                </button>
              </li>
            </ul>
          ) : (
            // Menu mobile para visitantes públicos
            <ul className="mobile-nav-list">
              <li><Link to="/" onClick={closeMobileMenu}><Home size={18} /> Início</Link></li>
              
              {/* Páginas dinâmicas criadas via admin */}
              {publicPages.map(page => (
                <li key={page.id}>
                  <Link to={`/page/${page.slug || page.id}`} onClick={closeMobileMenu}>
                    <FileText size={18} /> {page.title}
                  </Link>
                </li>
              ))}
              
              <li><Link to="/blog" onClick={closeMobileMenu}><FileText size={18} /> Blog</Link></li>
              <li><Link to="/login" onClick={closeMobileMenu} className="mobile-login-btn">Login</Link></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
