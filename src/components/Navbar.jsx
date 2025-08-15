import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { 
  LogOut, 
  User, 
  Settings, 
  Menu, 
  X, 
  ChevronDown,
  Home,
  FileText,
  BookOpen,
  Phone,
  LayoutDashboard,
  Users,
  PenTool,
  Tag
} from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Menu público
  const publicMenuItems = [
    { to: '/', label: 'Início', icon: Home },
    { to: '/pages', label: 'Wiki', icon: FileText },
    { to: '/blog', label: 'Blog', icon: BookOpen },
    { to: '/contact', label: 'Contato', icon: Phone }
  ]

  // Menu administrativo
  const adminMenuItems = [
    { to: '/admin/categories', label: 'Categorias', icon: Tag },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/pages', label: 'Wiki', icon: FileText },
    { to: '/admin/posts', label: 'Posts', icon: PenTool },
    ...(user?.role === 'admin' ? [
      { to: '/admin/users', label: 'Usuários', icon: Users }
    ] : [])
  ]

  // Detectar scroll para efeito no header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location.pathname])

  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: isScrolled 
      ? 'rgba(255, 255, 255, 0.95)' 
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: isScrolled 
      ? '1px solid rgba(0, 0, 0, 0.1)' 
      : '1px solid transparent',
    transition: 'all 0.3s ease',
    boxShadow: isScrolled 
      ? '0 2px 20px rgba(0, 0, 0, 0.1)' 
      : 'none'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px'
  }

  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    color: '#1f2937',
    fontWeight: '700',
    fontSize: '1.5rem',
    transition: 'all 0.3s ease'
  }

  const menuStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  }

  const menuItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: isActive ? '#667eea' : '#6b7280',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.9rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    position: 'relative',
    background: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
  })

  const userMenuStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }

  return (
    <>
      <nav style={navbarStyle}>
        <div style={containerStyle}>
          
          {/* Brand/Logo */}
          <Link to="/" style={brandStyle}>
            {settings.logo ? (
              <img 
                src={settings.logo} 
                alt={settings.siteName} 
                style={{ height: '40px', width: 'auto' }}
              />
            ) : (
              <>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>
                  S
                </div>
                <span>{settings.siteName || 'Smyrna Wiki'}</span>
              </>
            )}
          </Link>

          {/* Desktop Menu */}
          <div style={{ display: window.innerWidth > 768 ? 'block' : 'none' }}>
            <ul style={menuStyle}>
              {user ? (
                // Menu administrativo para usuários logados
                adminMenuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isActiveRoute(item.to)
                  return (
                    <li key={item.to}>
                      <Link 
                        to={item.to} 
                        style={menuItemStyle(isActive)}
                        onMouseOver={(e) => {
                          if (!isActive) {
                            e.target.style.color = '#667eea'
                            e.target.style.background = 'rgba(102, 126, 234, 0.05)'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) {
                            e.target.style.color = '#6b7280'
                            e.target.style.background = 'transparent'
                          }
                        }}
                      >
                        <Icon size={16} />
                        {item.label}
                      </Link>
                    </li>
                  )
                })
              ) : (
                // Menu público para visitantes
                publicMenuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isActiveRoute(item.to)
                  return (
                    <li key={item.to}>
                      <Link 
                        to={item.to} 
                        style={menuItemStyle(isActive)}
                        onMouseOver={(e) => {
                          if (!isActive) {
                            e.target.style.color = '#667eea'
                            e.target.style.background = 'rgba(102, 126, 234, 0.05)'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) {
                            e.target.style.color = '#6b7280'
                            e.target.style.background = 'transparent'
                          }
                        }}
                      >
                        <Icon size={16} />
                        {item.label}
                      </Link>
                    </li>
                  )
                })
              )}
            </ul>
          </div>

          {/* User Menu & Mobile Toggle */}
          <div style={userMenuStyle}>
            {user ? (
              <div style={{ position: 'relative' }} className="user-menu-container">
                <button
                  onClick={toggleUserMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(102, 126, 234, 0.1)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: '8px',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(102, 126, 234, 0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'linear-gradient(135deg, rgb(102, 234, 205), rgb(75, 129, 162))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <User size={12} />
                  </div>
                  <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                  </span>
                  <ChevronDown 
                    size={14} 
                    style={{ 
                      transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </button>

                {isUserMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    background: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    minWidth: '200px',
                    overflow: 'hidden',
                    zIndex: 1001
                  }}>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        textDecoration: 'none',
                        color: '#374151',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(102, 126, 234, 0.05)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent'
                      }}
                    >
                      <Settings size={16} />
                      Perfil
                    </Link>
                    <button 
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        color: '#dc2626',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(220, 38, 38, 0.05)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent'
                      }}
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, rgb(102, 234, 205), rgb(75, 129, 162))',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(102, 234, 205, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-1px)'
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 234, 205, 0.4)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 2px 8px rgba(102, 234, 205, 0.3)'
                }}
              >
                <User size={16} />
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              style={{
                display: window.innerWidth <= 768 ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                background: 'transparent',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.05)'
                e.target.style.color = '#667eea'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = '#6b7280'
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div style={{ height: '70px' }}></div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            background: 'white',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            maxHeight: 'calc(100vh - 70px)',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '1rem' }}>
              {/* Mobile Menu Items */}
              <div style={{ marginBottom: user ? '1.5rem' : '0' }}>
                {(user ? adminMenuItems : publicMenuItems).map((item) => {
                  const Icon = item.icon
                  const isActive = isActiveRoute(item.to)
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        textDecoration: 'none',
                        color: isActive ? '#667eea' : '#374151',
                        background: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: isActive ? '600' : '500',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              {/* Mobile User Section */}
              {user && (
                <div style={{
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  paddingTop: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    background: 'rgba(102, 126, 234, 0.05)',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, rgb(102, 234, 205), rgb(75, 129, 162))',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <User size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {user.role === 'admin' ? 'Administrador' : 'Editor'}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      textDecoration: 'none',
                      color: '#374151',
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Settings size={20} />
                    Perfil
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      color: '#dc2626',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <LogOut size={20} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
