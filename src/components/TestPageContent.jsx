import React, { useState, useEffect } from 'react'
import api from '../services/api'

const TestPageContent = () => {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        console.log('Buscando página sobre...')
        const response = await api.get('/pages/public/sobre')
        console.log('Resposta da API:', response.data)
        setPage(response.data)
      } catch (error) {
        console.error('Erro ao buscar página:', error)
        setError(error.message)
      }
      setLoading(false)
    }

    fetchPage()
  }, [])

  if (loading) {
    return <div>Carregando teste...</div>
  }

  if (error) {
    return <div>Erro: {error}</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Teste da Página Sobre</h1>
      {page ? (
        <div>
          <h2>Título: {page.title}</h2>
          <p>Slug: {page.slug}</p>
          <p>Autor: {page.author_name}</p>
          <div>
            <h3>Conteúdo:</h3>
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </div>
      ) : (
        <div>Nenhuma página encontrada</div>
      )}
    </div>
  )
}

export default TestPageContent
