import React from 'react'
import { Link } from 'react-router-dom'
import { Home, FileText, BookOpen, Phone } from 'lucide-react'

const MainMenuSimple = ({ className = '', orientation = 'horizontal', onLinkClick }) => {
  const menuItems = [
    { to: '/', label: 'Início', icon: Home },
    { to: '/pages', label: 'Wiki', icon: FileText },
    { to: '/blog', label: 'Blog', icon: BookOpen },
    { to: '/contact', label: 'Contato', icon: Phone }
  ]

  const isHorizontal = orientation === 'horizontal'

  const menuStyle = {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    gap: isHorizontal ? '2rem' : '0.5rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  }

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: isHorizontal ? '0.5rem 1rem' : '0.75rem 1rem',
    textDecoration: 'none',
    color: '#6b7280',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontSize: isHorizontal ? '0.9rem' : '1rem'
  }

  return (
    <nav className={className}>
      <ul style={menuStyle}>
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                style={itemStyle}
                onClick={onLinkClick}
                onMouseOver={(e) => {
                  e.target.style.color = '#667eea'
                  e.target.style.background = 'rgba(102, 126, 234, 0.1)'
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#6b7280'
                  e.target.style.background = 'transparent'
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MainMenuSimple
