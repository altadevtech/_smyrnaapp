import React from 'react'
import './EditorLayout.css'

const EditorLayout = ({ 
  title, 
  subtitle,
  icon: Icon, 
  children, 
  sidebar,
  loading = false 
}) => {
  return (
    <div className="editor-layout">
      {/* Header */}
      <div className="editor-header">
        <div className="editor-header-content">
          {Icon && <Icon className="editor-header-icon" />}
          <div className="editor-header-text">
            <h1 className="editor-title">{title}</h1>
            {subtitle && <p className="editor-subtitle">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="editor-container">
        {/* Form Section */}
        <div className="editor-main">
          <div className="editor-form-card">
            {children}
          </div>
        </div>

        {/* Sidebar Section */}
        {sidebar && (
          <div className="editor-sidebar">
            {sidebar}
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="editor-loading-overlay">
          <div className="editor-loading-spinner">
            <div className="spinner"></div>
            <p>Salvando...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditorLayout
