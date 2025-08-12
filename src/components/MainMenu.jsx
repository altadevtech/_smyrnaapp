import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import api from '../services/api'

const MainMenu = ({ className = '', orientation = 'horizontal', onLinkClick }) => {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileExpandedMenus, setMobileExpandedMenus] = useState(new Set())

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus/public')
      setMenus(response.data)
    } catch (error) {
      console.error('Erro ao carregar menus:', error)
      setMenus([])
    }
    setLoading(false)
  }

  const handleMouseEnter = (menuId) => {
    if (orientation === 'horizontal') {
      setActiveDropdown(menuId)
    }
  }

  const handleMouseLeave = () => {
    if (orientation === 'horizontal') {
      setActiveDropdown(null)
    }
  }

  const toggleMobileMenu = (menuId) => {
    if (orientation === 'vertical') {
      const newExpanded = new Set(mobileExpandedMenus)
      if (newExpanded.has(menuId)) {
        newExpanded.delete(menuId)
      } else {
        newExpanded.add(menuId)
      }
      setMobileExpandedMenus(newExpanded)
    }
  }

  const handleLinkClick = () => {
    setActiveDropdown(null)
    setMobileExpandedMenus(new Set())
    if (onLinkClick) {
      onLinkClick()
    }
  }

  const renderMenuItems = (menuItems, level = 0) => {
    if (!menuItems || menuItems.length === 0) return null

    return (
      <ul className={`menu-list level-${level}`}>
        {menuItems.map((menu) => {
          const hasChildren = menu.children && menu.children.length > 0
          const isExpanded = mobileExpandedMenus.has(menu.id)
          const isActive = activeDropdown === menu.id

          return (
            <li 
              key={menu.id} 
              className={`menu-item ${hasChildren ? 'has-children' : ''} ${isActive ? 'active' : ''}`}
              onMouseEnter={() => handleMouseEnter(menu.id)}
              onMouseLeave={handleMouseLeave}
            >
              {hasChildren ? (
                <>
                  <button
                    className="menu-link menu-button"
                    onClick={() => toggleMobileMenu(menu.id)}
                    aria-expanded={isExpanded}
                  >
                    <span>{menu.name}</span>
                    {orientation === 'horizontal' ? (
                      <ChevronDown size={16} className="menu-chevron" />
                    ) : (
                      <ChevronRight 
                        size={16} 
                        className={`menu-chevron ${isExpanded ? 'expanded' : ''}`} 
                      />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  <div className={`submenu ${isActive || isExpanded ? 'open' : ''}`}>
                    {renderMenuItems(menu.children, level + 1)}
                  </div>
                </>
              ) : (
                <Link
                  to={menu.url}
                  className="menu-link"
                  target={menu.target || '_self'}
                  onClick={handleLinkClick}
                >
                  {menu.name}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    )
  }

  if (loading) {
    return (
      <div className={`main-menu loading ${className}`}>
        <div className="menu-skeleton">
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </div>
      </div>
    )
  }

  return (
    <nav className={`main-menu ${orientation} ${className}`}>
      {renderMenuItems(menus)}
    </nav>
  )
}

export default MainMenu