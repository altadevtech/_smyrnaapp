import React from 'react'

const ModernTable = ({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = "Nenhum item encontrado",
  className = "" 
}) => {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p style={{ marginLeft: '1rem', color: '#667eea' }}>Carregando...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <div className="empty-icon">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
            <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z"/>
          </svg>
        </div>
        <h3>Lista vazia</h3>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`table-responsive ${className}`}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={column.hideOnMobile ? 'hide-mobile' : ''}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex}
                  className={column.hideOnMobile ? 'hide-mobile' : ''}
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ModernTable
