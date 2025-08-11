import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { User, Settings, Palette, Upload, Save, Mail, Phone, MapPin, Globe, Eye, EyeOff } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import api from '../services/api'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const { settings, updateSettings, refreshSettings } = useSettings()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  
  // Estados para dados do perfil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Estados para preview do logo
  const [logoPreview, setLogoPreview] = useState('')

  useEffect(() => {
    // Inicializar preview do logo com configurações do contexto
    if (settings.logo) {
      setLogoPreview(settings.logo)
    }
  }, [settings])

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('Arquivo muito grande! Máximo 5MB.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const logoData = e.target.result
        setLogoPreview(logoData)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validações
      if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
        toast.error('As senhas não coincidem!')
        return
      }

      if (profileData.newPassword && profileData.newPassword.length < 6) {
        toast.error('A nova senha deve ter pelo menos 6 caracteres!')
        return
      }

      const updateData = {
        name: profileData.name,
        email: profileData.email
      }

      // Incluir senha apenas se fornecida
      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword
        updateData.newPassword = profileData.newPassword
      }

      const response = await api.put(`/users/${user.id}`, updateData)
      
      // Atualizar contexto de autenticação
      updateUser(response.data.user)
      
      toast.success('Perfil atualizado com sucesso!')
      
      // Limpar campos de senha
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleSystemSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Criar um objeto com as configurações atualizadas incluindo o logo
      const updatedSettings = {
        ...settings,
        logo: logoPreview
      }
      
      // Usar o contexto para atualizar as configurações
      const success = await updateSettings(updatedSettings)
      
      if (success) {
        toast.success('Configurações salvas com sucesso! O logotipo foi atualizado no header.')
      } else {
        toast.error('Erro ao salvar configurações')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleSystemChange = (e) => {
    // Atualizar configurações localmente no contexto
    const newSettings = {
      ...settings,
      [e.target.name]: e.target.value
    }
    updateSettings(newSettings)
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'system', label: 'Sistema', icon: Settings },
    { id: 'themes', label: 'Temas', icon: Palette }
  ]

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h1>
        <User size={32} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
        Perfil do Administrador
      </h1>

      {/* Tabs */}
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background: activeTab === tab.id ? '#3b82f6' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  borderRadius: '0.5rem 0.5rem 0 0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'profile' && (
        <div className="card">
          <h2>Dados Pessoais</h2>
          <form onSubmit={handleProfileSubmit}>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div>
                <label>Nome Completo:</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>E-mail:</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <hr style={{ margin: '2rem 0' }} />

            <h3>Alterar Senha</h3>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <label>Senha Atual:</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={profileData.currentPassword}
                    onChange={handleProfileChange}
                    style={{ width: '100%', paddingRight: '2.5rem' }}
                    placeholder="Digite sua senha atual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label>Nova Senha:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleProfileChange}
                  style={{ width: '100%' }}
                  placeholder="Digite a nova senha"
                />
              </div>

              <div>
                <label>Confirmar Nova Senha:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleProfileChange}
                  style={{ width: '100%' }}
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading} style={{ marginTop: '1rem' }}>
              <Save size={18} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="card">
          <h2>Configurações do Sistema</h2>
          <form onSubmit={handleSystemSubmit}>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div>
                <label>Nome do Site:</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleSystemChange}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>Descrição do Site:</label>
                <textarea
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleSystemChange}
                  rows="3"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <hr style={{ margin: '2rem 0' }} />

            <h3>Logotipo</h3>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'auto 1fr', alignItems: 'start' }}>
              <div>
                {logoPreview && (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '100px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        padding: '0.5rem'
                      }} 
                    />
                  </div>
                )}
                <label className="btn" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={18} />
                  Escolher Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Formatos aceitos: PNG, JPG, SVG (máx. 5MB)
                </p>
              </div>
            </div>

            <hr style={{ margin: '2rem 0' }} />

            <h3>Informações de Contato</h3>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <label>
                  <Mail size={16} style={{ marginRight: '0.5rem' }} />
                  E-mail de Contato:
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleSystemChange}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>
                  <Phone size={16} style={{ marginRight: '0.5rem' }} />
                  Telefone:
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleSystemChange}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>
                  <MapPin size={16} style={{ marginRight: '0.5rem' }} />
                  Endereço:
                </label>
                <input
                  type="text"
                  name="contactAddress"
                  value={settings.contactAddress}
                  onChange={handleSystemChange}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>
                  <Globe size={16} style={{ marginRight: '0.5rem' }} />
                  Website:
                </label>
                <input
                  type="url"
                  name="website"
                  value={settings.website}
                  onChange={handleSystemChange}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading} style={{ marginTop: '2rem' }}>
              <Save size={18} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'themes' && (
        <div className="card">
          <h2>Personalização de Temas</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            Escolha o tema de cores que melhor se adapta ao seu ambiente de trabalho.
          </p>

          <ThemeToggle variant="cards" />

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-color)' }}>ℹ️ Informações sobre Temas</h4>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', paddingLeft: '1.25rem' }}>
              <li><strong>Tema Claro:</strong> Interface clara e moderna, ideal para ambientes bem iluminados.</li>
              <li><strong>Tema Escuro:</strong> Interface escura que reduz o cansaço visual em ambientes com pouca luz.</li>
              <li><strong>Aplicação Automática:</strong> O tema selecionado é aplicado instantaneamente em todo o sistema.</li>
              <li><strong>Persistência:</strong> Sua escolha é salva e mantida entre sessões.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
