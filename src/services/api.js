import axios from 'axios'
import { clearAuthData, shouldRedirectToLogin, isPublicAPIRoute } from '../utils/authUtils'

// Detectar se está em desenvolvimento ou produção
const getBaseURL = () => {
  // 1. Verificar se há uma variável de ambiente customizada
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // 2. Se estiver em produção (Render.com), usar a URL atual
  if (import.meta.env.PROD) {
    return `${window.location.origin}/api`
  }
  
  // 3. Se estiver em desenvolvimento, usar localhost
  return 'http://localhost:10000/api'
}

// Configuração base do axios
const api = axios.create({
  baseURL: getBaseURL()
})

console.log('🔗 API Base URL:', api.defaults.baseURL)
console.log('🌍 Environment:', import.meta.env.MODE)

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      const currentPath = window.location.pathname
      
      const isPublicAPI = isPublicAPIRoute(url)
      const shouldRedirect = shouldRedirectToLogin(currentPath)
      
      if (!isPublicAPI && shouldRedirect) {
        console.log('🔐 Redirecionando para login - rota protegida:', currentPath)
        clearAuthData()
        window.location.href = '/login'
      } else {
        console.log('ℹ️ Erro 401 ignorado - contexto público:', { api: url, page: currentPath })
      }
    }
    return Promise.reject(error)
  }
)

export default api
