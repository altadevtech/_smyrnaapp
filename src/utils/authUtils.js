// Utilitário para limpar dados de autenticação sem redirecionamento
export const clearAuthData = () => {
  localStorage.removeItem('token')
  sessionStorage.clear()
  
  // Limpar também cookies se houver
  document.cookie.split(";").forEach((c) => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
  })
}

// Verificar se o usuário deve ter acesso a uma rota protegida
export const shouldRedirectToLogin = (pathname) => {
  const protectedPaths = [
    '/admin',
    '/dashboard',
    '/users',
    '/templates'
  ]
  
  return protectedPaths.some(path => pathname.startsWith(path))
}

// Verificar se uma rota de API é pública
export const isPublicAPIRoute = (url) => {
  const publicRoutes = [
    '/public',
    '/pages/home',
    '/home',
    '/auth/login',
    '/posts/public',
    '/templates/'
  ]
  
  return publicRoutes.some(route => url.includes(route))
}

export default {
  clearAuthData,
  shouldRedirectToLogin,
  isPublicAPIRoute
}
