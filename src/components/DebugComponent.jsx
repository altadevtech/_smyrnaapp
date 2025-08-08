import React from 'react'

const DebugComponent = () => {
  const token = localStorage.getItem('token')
  
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Debug Autenticação</h1>
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
        <h2>Status atual:</h2>
        <p><strong>Token no localStorage:</strong> {token ? 'Existe' : 'Não existe'}</p>
        <p><strong>Tamanho do token:</strong> {token ? token.length : 'N/A'}</p>
        <p><strong>URL atual:</strong> {window.location.href}</p>
        <p><strong>User Agent:</strong> {navigator.userAgent}</p>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => {
          localStorage.clear()
          window.location.reload()
        }}>
          Limpar localStorage e recarregar
        </button>
        
        <button onClick={() => {
          window.location.href = 'http://localhost:3000'
        }} style={{ marginLeft: '1rem' }}>
          Ir para home
        </button>
      </div>
    </div>
  )
}

export default DebugComponent
