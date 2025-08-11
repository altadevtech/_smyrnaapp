import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const WikiBreadcrumbs = ({ category, page }) => {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 0',
      fontSize: '0.875rem',
      color: '#6b7280',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '1rem'
    }}>
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: '#6b7280',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        <Home size={14} style={{ marginRight: '0.25rem' }} />
        Início
      </Link>

      <ChevronRight size={14} style={{ margin: '0 0.5rem', color: '#d1d5db' }} />

      <Link
        to="/wiki"
        style={{
          textDecoration: 'none',
          color: '#6b7280',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        Wiki
      </Link>

      {category && (
        <>
          <ChevronRight size={14} style={{ margin: '0 0.5rem', color: '#d1d5db' }} />
          <span style={{ 
            color: category.color || '#6366f1',
            fontWeight: '500',
            padding: '0.25rem 0.5rem'
          }}>
            {category.name}
          </span>
        </>
      )}

      {page && (
        <>
          <ChevronRight size={14} style={{ margin: '0 0.5rem', color: '#d1d5db' }} />
          <span style={{ 
            color: '#1f2937', 
            fontWeight: 'bold',
            padding: '0.25rem 0.5rem'
          }}>
            {page.title}
          </span>
        </>
      )}
    </nav>
  )
}

export default WikiBreadcrumbs
