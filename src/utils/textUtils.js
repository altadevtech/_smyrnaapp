/**
 * Utilitários para manipulação de texto e HTML
 */

/**
 * Remove todas as tags HTML de uma string e retorna apenas o texto limpo
 * @param {string} html - String com HTML
 * @param {number} maxLength - Comprimento máximo do texto (opcional)
 * @returns {string} - Texto limpo sem HTML
 */
export const stripHtml = (html, maxLength = null) => {
  if (!html) return ''
  
  // Remove todas as tags HTML
  const cleanText = html
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/&nbsp;/g, ' ') // Substitui &nbsp; por espaço
    .replace(/&amp;/g, '&') // Substitui &amp; por &
    .replace(/&lt;/g, '<') // Substitui &lt; por <
    .replace(/&gt;/g, '>') // Substitui &gt; por >
    .replace(/&quot;/g, '"') // Substitui &quot; por "
    .replace(/&#39;/g, "'") // Substitui &#39; por '
    .replace(/\s+/g, ' ') // Remove múltiplos espaços
    .trim() // Remove espaços do início e fim
  
  // Limita o comprimento se especificado
  if (maxLength && cleanText.length > maxLength) {
    return cleanText.substring(0, maxLength).trim() + '...'
  }
  
  return cleanText
}

/**
 * Extrai um resumo de um texto HTML
 * @param {string} html - String com HTML
 * @param {number} maxLength - Comprimento máximo do resumo (padrão: 200)
 * @returns {string} - Resumo do texto
 */
export const extractSummary = (html, maxLength = 200) => {
  return stripHtml(html, maxLength)
}

/**
 * Trunca texto preservando palavras completas
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} - Texto truncado
 */
export const truncateText = (text, maxLength = 200) => {
  if (!text || text.length <= maxLength) return text
  
  // Encontra o último espaço antes do limite
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > 0) {
    return text.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

/**
 * Formata uma data para exibição
 * @param {string|Date} dateString - Data em string ou objeto Date
 * @returns {string} - Data formatada
 */
export const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formata uma data de forma relativa (ex: "há 2 horas")
 * @param {string|Date} dateString - Data em string ou objeto Date
 * @returns {string} - Data formatada de forma relativa
 */
export const formatRelativeDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  
  const now = new Date()
  const diffInMs = now - date
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInMinutes < 1) {
    return 'agora'
  } else if (diffInMinutes < 60) {
    return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`
  } else if (diffInHours < 24) {
    return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
  } else if (diffInDays < 7) {
    return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`
  } else {
    return formatDate(date)
  }
}

/**
 * Gera um resumo automático a partir do conteúdo HTML se não existir summary
 * @param {string} summary - Resumo existente
 * @param {string} content - Conteúdo HTML
 * @param {number} maxLength - Comprimento máximo (padrão: 200)
 * @returns {string} - Resumo final
 */
export const getDisplaySummary = (summary, content, maxLength = 200) => {
  if (summary && summary.trim()) {
    return summary.trim()
  }
  
  // Se não tem summary, gera automaticamente do conteúdo
  return extractSummary(content, maxLength)
}
