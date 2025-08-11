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

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }

    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [activeDropdown])

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus/public')
      setMenus(response.data)
    } catch (error) {
      console.error('Erro ao buscar menus:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMenuUrl = (menu) => {
    if (menu.page_slug) {
      return `/page/${menu.page_slug}`
    }
    return menu.url || '#'
  }

  const hasValidLink = (menu) => {
    return menu.page_slug || (menu.url && menu.url !== '#' && menu.url !== '')
  }

  const handleDropdownClick = (e, menuId) => {
    e.stopPropagation()
    setActiveDropdown(activeDropdown === menuId ? null : menuId)
  }

  const handleMobileMenuToggle = (menuId) => {
    const newExpandedMenus = new Set(mobileExpandedMenus)
    if (newExpandedMenus.has(menuId)) {
      newExpandedMenus.delete(menuId)
    } else {
      newExpandedMenus.add(menuId)
    }
    setMobileExpandedMenus(newExpandedMenus)
  }

  const renderMenuItem = (menu, level = 0) => {
    const hasChildren = menu.children && menu.children.length > 0
    const menuUrl = getMenuUrl(menu)
    const hasLink = hasValidLink(menu)
    const isDropdownOpen = activeDropdown === menu.id
    const isMobileExpanded = mobileExpandedMenus.has(menu.id)

    if (orientation === 'horizontal') {
      return (
        <li key={menu.id} className={`menu-item-horizontal ${menu.css_class || ''}`}>
          <div className="menu-item-wrapper">
            {hasChildren ? (
              // Item pai com filhos - pode ter ou não ter link
              <div className="menu-parent-container">
                {hasLink ? (
                  // Item pai com link E dropdown
                  <>
                    <Link
                      to={menuUrl}
                      target={menu.target}
                      onClick={onLinkClick}
                      className="menu-link has-dropdown with-link"
                      onMouseEnter={() => setActiveDropdown(menu.id)}
                    >
                      {menu.icon && (
                        <i className={`${menu.icon} menu-icon`}></i>
                      )}
                      <span className="menu-text">{menu.title}</span>
                    </Link>
                    <button
                      className="dropdown-toggle-btn"
                      onClick={(e) => handleDropdownClick(e, menu.id)}
                      onMouseEnter={() => setActiveDropdown(menu.id)}
                      aria-label={`Toggle ${menu.title} submenu`}
                    >
                      <ChevronDown size={16} className={`menu-chevron ${isDropdownOpen ? 'rotated' : ''}`} />
                    </button>
                  </>
                ) : (
                  // Item pai apenas com dropdown (sem link)
                  <button
                    className="menu-link has-dropdown no-link"
                    onClick={(e) => handleDropdownClick(e, menu.id)}
                    onMouseEnter={() => setActiveDropdown(menu.id)}
                    aria-label={`Toggle ${menu.title} submenu`}
                  >
                    {menu.icon && (
                      <i className={`${menu.icon} menu-icon`}></i>
                    )}
                    <span className="menu-text">{menu.title}</span>
                    <ChevronDown size={16} className={`menu-chevron ${isDropdownOpen ? 'rotated' : ''}`} />
                  </button>
                )}
              </div>
            ) : (
              // Item simples sem filhos
              <Link
                to={menuUrl}
                target={menu.target}
                onClick={onLinkClick}
                className="menu-link"
              >
                {menu.icon && (
                  <i className={`${menu.icon} menu-icon`}></i>
                )}
                <span className="menu-text">{menu.title}</span>
              </Link>
            )}

            {hasChildren && (
              <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                {menu.children.map(child => (
                  <li key={child.id} className={`dropdown-item ${child.css_class || ''}`}>
                    <Link
                      to={getMenuUrl(child)}
                      target={child.target}
                      onClick={(e) => {
                        setActiveDropdown(null)
                        if (onLinkClick) onLinkClick(e)
                      }}
                      className="dropdown-link"
                    >
                      {child.icon && (
                        <i className={`${child.icon} dropdown-icon`}></i>
                      )}
                      <span>{child.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      )
    }

    // Vertical menu (mobile)
    return (
      <li key={menu.id} className={`menu-item-vertical ${menu.css_class || ''}`}>
        <div className="menu-item-wrapper">
          {hasChildren ? (
            // Item pai com filhos no mobile
            <div className="mobile-menu-parent-container">
              {hasLink ? (
                // Item pai com link E submenu no mobile
                <>
                  <Link
                    to={menuUrl}
                    target={menu.target}
                    onClick={onLinkClick}
                    className="menu-link mobile-has-link"
                  >
                    {menu.icon && (
                      <i className={`${menu.icon} menu-icon`}></i>
                    )}
                    <span className="menu-text">{menu.title}</span>
                  </Link>
                  <button
                    onClick={() => handleMobileMenuToggle(menu.id)}
                    className="mobile-toggle-btn"
                    aria-label={`Toggle ${menu.title} submenu`}
                  >
                    <ChevronRight size={16} className={`menu-chevron ${isMobileExpanded ? 'rotated' : ''}`} />
                  </button>
                </>
              ) : (
                // Item pai apenas com submenu no mobile (sem link)
                <button
                  onClick={() => handleMobileMenuToggle(menu.id)}
                  className="menu-toggle-btn no-link"
                >
                  {menu.icon && (
                    <i className={`${menu.icon} menu-icon`}></i>
                  )}
                  <span className="menu-text">{menu.title}</span>
                  <ChevronRight size={16} className={`menu-chevron ${isMobileExpanded ? 'rotated' : ''}`} />
                </button>
              )}
            </div>
          ) : (
            // Item simples sem filhos no mobile
            <Link
              to={menuUrl}
              target={menu.target}
              onClick={onLinkClick}
              className="menu-link"
            >
              {menu.icon && (
                <i className={`${menu.icon} menu-icon`}></i>
              )}
              <span className="menu-text">{menu.title}</span>
            </Link>
          )}

          {hasChildren && (
            <ul className={`submenu ${isMobileExpanded ? 'expanded' : ''}`}>
              {menu.children.map(child => (
                <li key={child.id} className={`submenu-item ${child.css_class || ''}`}>
                  <Link
                    to={getMenuUrl(child)}
                    target={child.target}
                    onClick={onLinkClick}
                    className="submenu-link"
                  >
                    {child.icon && (
                      <i className={`${child.icon} submenu-icon`}></i>
                    )}
                    <span>{child.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </li>
    )
  }

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="loading-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-item"></div>
          ))}
        </div>
      </div>
    )
  }

  if (menus.length === 0) {
    return null
  }

  return (
    <nav className={`main-menu ${orientation} ${className}`}>
      <ul className="menu-list">
        {menus.map(menu => renderMenuItem(menu))}
      </ul>
    </nav>
  )
}

export default MainMenu
