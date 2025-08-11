import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { LogOut, User, FileText, Users, Home, Settings, Layout, Menu, X, Tag, MessageSquare, ChevronDown } from 'lucide-react'
import MainMenu from './MainMenu'
import ThemeToggle from './ThemeToggle'
import api from '../services/api'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownOpen && !event.target.closest('.dropdown')) {
        setAccountDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [accountDropdownOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
    setAccountDropdownOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const toggleAccountDropdown = () => {
    setAccountDropdownOpen(!accountDropdownOpen)
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
                    <li><Link to="/admin/categories"><Tag size={18} /> Categorias</Link></li>
                    <li><Link to="/admin/menus"><MessageSquare size={18} /> Menus</Link></li>
                    <li><Link to="/admin/templates"><Layout size={18} /> Templates</Link></li>
                  </>
                )}
                
                {/* Dropdown de Conta */}
                <li className="dropdown">
                  <button onClick={toggleAccountDropdown} className="dropdown-btn">
                    <User size={18} />
                    <span>{user.name}</span>
                    <ChevronDown size={16} className={`chevron ${accountDropdownOpen ? 'open' : ''}`} />
                  </button>
                  
                  {accountDropdownOpen && (
                    <ul className="dropdown-menu">
                      <li className="dropdown-header">
                        <span className="user-role">({user.role})</span>
                      </li>
                      <li><Link to="/profile" onClick={() => setAccountDropdownOpen(false)}><User size={16} /> Meu Perfil</Link></li>
                      {user.role === 'admin' && (
                        <li><Link to="/admin/users" onClick={() => setAccountDropdownOpen(false)}><Users size={16} /> Gerenciar Usuários</Link></li>
                      )}
                      <li className="dropdown-divider"></li>
                      <li className="theme-toggle-wrapper">
                        <ThemeToggle variant="button-text" size="small" />
                      </li>
                      <li className="dropdown-divider"></li>
                      <li>
                        <button onClick={handleLogout} className="dropdown-logout-btn">
                          <LogOut size={16} /> Sair
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            ) : (
              // Menu público moderno
              <div className="public-navigation">
                <MainMenu className="main-navigation" orientation="horizontal" />
                <div className="auth-actions">
                  <ThemeToggle size="small" />
                  <Link to="/login" className="login-btn">
                    <User size={16} />
                    <span>Entrar</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {user ? (
            // Menu mobile para usuários logados
            <ul className="mobile-nav-list">
              <li className="mobile-user-header">
                <User size={18} />
                <span>{user.name} ({user.role})</span>
              </li>
              
              <li><Link to="/dashboard" onClick={closeMobileMenu}><Settings size={18} /> Dashboard</Link></li>
              <li><Link to="/admin/pages" onClick={closeMobileMenu}><FileText size={18} /> Páginas</Link></li>
              <li><Link to="/admin/posts" onClick={closeMobileMenu}><FileText size={18} /> Posts</Link></li>
              {user.role === 'admin' && (
                <>
                  <li><Link to="/admin/categories" onClick={closeMobileMenu}><Tag size={18} /> Categorias</Link></li>
                  <li><Link to="/admin/menus" onClick={closeMobileMenu}><MessageSquare size={18} /> Menus</Link></li>
                  <li><Link to="/admin/templates" onClick={closeMobileMenu}><Layout size={18} /> Templates</Link></li>
                </>
              )}
              
              {/* Seção de Conta */}
              <li className="mobile-section-header">Conta</li>
              <li><Link to="/profile" onClick={closeMobileMenu}><User size={18} /> Meu Perfil</Link></li>
              {user.role === 'admin' && (
                <li><Link to="/admin/users" onClick={closeMobileMenu}><Users size={18} /> Gerenciar Usuários</Link></li>
              )}
              <li>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <LogOut size={18} /> Sair
                </button>
              </li>
            </ul>
          ) : (
            // Menu mobile para visitantes públicos
            <div className="mobile-public-menu">
              <div className="mobile-menu-header">
                <Link to="/" onClick={closeMobileMenu} className="mobile-home-link">
                  <Home size={18} />
                  <span>Início</span>
                </Link>
              </div>
              
              <div className="mobile-main-navigation">
                <MainMenu orientation="vertical" onLinkClick={closeMobileMenu} />
              </div>
              
              <div className="mobile-auth-section">
                <Link to="/login" onClick={closeMobileMenu} className="mobile-login-btn">
                  <User size={18} />
                  <span>Entrar</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
