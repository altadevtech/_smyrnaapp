import React, { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { LogIn, Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, Zap, Globe } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  
  const { login, user } = useAuth()
  const navigate = useNavigate()

  // Se já estiver logado, redireciona
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      toast.success('Login realizado com sucesso!')
      navigate('/dashboard')
    } else {
      toast.error(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: 'Arial, Tahoma, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Decorations */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '30%',
        height: '120%',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        transform: 'rotate(-15deg)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '40%',
        height: '140%',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        transform: 'rotate(20deg)'
      }}></div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '2rem' : '4rem',
        maxWidth: '1100px',
        width: '100%',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Left Side - Welcome Section */}
        <div style={{
          color: 'white',
          textAlign: isMobile ? 'center' : 'left',
          order: isMobile ? 2 : 1
        }}>
          <div style={{
            marginBottom: '3rem'
          }}>
            <h1 style={{
              fontSize: isMobile ? '2.5rem' : '3.5rem',
              fontWeight: '700',
              margin: '0 0 1rem 0',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              lineHeight: 1.1
            }}>
              <LogIn 
                size={isMobile ? 40 : 56} 
                style={{ 
                  marginRight: '1rem', 
                  verticalAlign: 'middle',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }} 
              />
              Bem-vindo
            </h1>
            <p style={{
              fontSize: isMobile ? '1.1rem' : '1.3rem',
              opacity: 0.9,
              lineHeight: 1.6,
              margin: '0 0 2rem 0'
            }}>
              Acesse seu painel administrativo do Smyrna Wiki
            </p>
          </div>

          {/* Features */}
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                  Seguro e Confiável
                </h3>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                  Autenticação JWT e proteção avançada
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                  Rápido e Eficiente
                </h3>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                  Interface moderna e responsiva
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Globe size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                  Wiki e Blog Integrados
                </h3>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                  Gerencie todo seu conteúdo em um lugar
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <Link 
            to="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'white',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> 
            Voltar ao site
          </Link>
        </div>

        {/* Right Side - Login Form */}
        <div style={{
          order: isMobile ? 1 : 2
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem 2rem',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            
            {/* Form Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                boxShadow: '0 8px 16px rgba(102, 234, 205, 0.3)'
              }}>
                <User size={36} color="white" />
              </div>
              <h2 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                Fazer Login
              </h2>
              <p style={{
                margin: 0,
                color: '#64748b',
                fontSize: '0.95rem'
              }}>
                Entre com suas credenciais para acessar o painel
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              
              {/* Email Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail 
                    size={20} 
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b'
                    }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu email"
                    required
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: '#f8fafc',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgb(102, 234, 205)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 234, 205, 0.1)'
                      e.target.style.background = 'white'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.boxShadow = 'none'
                      e.target.style.background = '#f8fafc'
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Senha
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock 
                    size={20} 
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b'
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    style={{
                      width: '100%',
                      padding: '1rem 3rem 1rem 3rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: '#f8fafc',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgb(102, 234, 205)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 234, 205, 0.1)'
                      e.target.style.background = 'white'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.boxShadow = 'none'
                      e.target.style.background = '#f8fafc'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f1f5f9'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none'
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  background: loading 
                    ? '#94a3b8' 
                    : 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(102, 234, 205, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 8px 20px rgba(102, 234, 205, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 14px rgba(102, 234, 205, 0.3)'
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Fazer Login
                  </>
                )}
              </button>
            </form>

            {/* Test Users Info */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(102, 234, 205, 0.1) 0%, rgba(75, 129, 162, 0.1) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 234, 205, 0.2)'
            }}>
              <h4 style={{
                margin: '0 0 1rem 0',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <User size={16} />
                Usuários de Teste
              </h4>
              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ color: '#1e293b' }}>Administrador:</strong><br />
                  <code style={{ 
                    background: 'rgba(255, 255, 255, 0.8)', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    admin@smyrna.com / admin123
                  </code>
                </div>
                <div>
                  <strong style={{ color: '#1e293b' }}>Editor:</strong><br />
                  <code style={{ 
                    background: 'rgba(255, 255, 255, 0.8)', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    editor@smyrna.com / editor123
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
