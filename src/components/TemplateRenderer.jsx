import React from 'react'
import Widget from './Widget'

const TemplateRenderer = ({ page, template, widgets = {} }) => {
  if (!template?.layout?.blocks) {
    return (
      <div className="template-error">
        <p>Template não encontrado ou layout inválido</p>
      </div>
    )
  }

  const getWidgetData = (blockId) => {
    if (page.widget_data && page.widget_data[blockId]) {
      return page.widget_data[blockId]
    }
    return {}
  }

  const renderBlock = (block) => {
    const widgetData = getWidgetData(block.id)
    const config = { ...block.config, ...widgetData }

    return (
      <div key={block.id} className={`template-block block-${block.type}`}>
        <Widget 
          type={block.type}
          data={widgetData}
          config={config}
        />
      </div>
    )
  }

  return (
    <div className={`template-container template-${template.id}`}>
      {template.show_header !== false && (
        <header className="template-header">
          <div className="page-header">
            <h1>{page.title}</h1>
            {page.author_name && (
              <div className="page-meta">
                <span>Por {page.author_name}</span>
                <span>Atualizado em {new Date(page.updated_at).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
        </header>
      )}

      <main className="template-content">
        {template.layout.blocks.map(renderBlock)}
      </main>

      {template.show_footer !== false && (
        <footer className="template-footer">
          <div className="footer-content">
            <p>&copy; 2025 Smyrna Wiki. Todos os direitos reservados.</p>
          </div>
        </footer>
      )}
    </div>
  )
}

export default TemplateRenderer
