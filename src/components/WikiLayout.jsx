import React from 'react'
import WikiSidebar from './WikiSidebar'
import WikiBreadcrumbs from './WikiBreadcrumbs'

const WikiLayout = ({ children, category, page }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Sidebar */}
      <WikiSidebar />
      
      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        padding: '1rem 2rem',
        maxWidth: 'calc(100vw - 280px)',
        overflowX: 'auto'
      }}>
        <WikiBreadcrumbs category={category} page={page} />
        
        {/* Content Area */}
        <div style={{
          maxWidth: '800px',
          lineHeight: '1.6',
          fontSize: '1rem'
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default WikiLayout
