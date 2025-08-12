import React from 'react'
import { Link } from 'react-router-dom'

const SimpleHome = () => {
  return (
    <div>
      <h1>Smyrna Wiki - Home Simples</h1>
      <p>Sistema funcionando!</p>
      <div>
        <Link to="/admin/login">Área Administrativa</Link>
      </div>
    </div>
  )
}

export default SimpleHome
