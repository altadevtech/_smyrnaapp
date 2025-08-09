import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const SettingsContext = createContext()

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider')
  }
  return context
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'Smyrna CMS',
    siteDescription: 'Sistema de Gerenciamento de Conteúdo',
    logo: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    website: '',
    theme: 'light'
  })
  const [loading, setLoading] = useState(true)

  const loadSettings = async () => {
    try {
      const response = await api.get('/settings')
      setSettings({ ...settings, ...response.data })
    } catch (error) {
      console.log('Configurações não encontradas, usando padrões')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings) => {
    try {
      await api.put('/settings', newSettings)
      setSettings({ ...settings, ...newSettings })
      return true
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      return false
    }
  }

  const refreshSettings = () => {
    loadSettings()
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const value = {
    settings,
    loading,
    updateSettings,
    refreshSettings
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsContext
