import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export { AuthContext }

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('🔍 Token no localStorage:', token ? 'Existe' : 'Não existe')
    
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`
      // Verificar se o token é válido apenas se existe
      checkAuth()
    } else {
      console.log('ℹ️ Nenhum token encontrado, modo público ativado')
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      console.log('🔐 Verificando autenticação...')
      const response = await api.get('/auth/me')
      console.log('✅ Usuário autenticado:', response.data.user.name)
      setUser(response.data.user)
    } catch (error) {
      console.log('ℹ️ Token inválido ou expirado, limpando dados locais')
      // Limpar dados locais mas não redirecionar
      localStorage.removeItem('token')
      delete api.defaults.headers.Authorization
      setUser(null)
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data

      localStorage.setItem('token', token)
      api.defaults.headers.Authorization = `Bearer ${token}`
      setUser(user)

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.Authorization
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
