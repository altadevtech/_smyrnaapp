import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Layout, Settings, Eye } from 'lucide-react'

const Templates = () => {
  const { user } = useAuth()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    layout: { blocks: [] },
    showHeader: true,
    showFooter: true,
    isDefault: false
  })
  const [newBlock, setNewBlock] = useState({
    type: 'content',
    title: ''
  })

  // Só admins podem gerenciar templates
  if (user?.role !== 'admin') {
    return (
      <div className="access-denied">
        <h1>Acesso Negado</h1>
        <p>Apenas administradores podem gerenciar templates.</p>
      </div>
    )
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates')
      setTemplates(response.data)
    } catch (error) {
      toast.error('Erro ao carregar templates')
      console.error(error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTemplate) {
        await api.put(`/templates/${editingTemplate.id}`, formData)
        toast.success('Template atualizado com sucesso!')
      } else {
        await api.post('/templates', formData)
        toast.success('Template criado com sucesso!')
      }
      setShowForm(false)
      setEditingTemplate(null)
      resetForm()
      fetchTemplates()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar template')
      console.error(error)
    }
  }

  const handleEdit = (template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      description: template.description || '',
      layout: template.layout || { blocks: [] },
      showHeader: template.show_header,
      showFooter: template.show_footer,
      isDefault: template.is_default
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      try {
        await api.delete(`/templates/${id}`)
        toast.success('Template excluído com sucesso!')
        fetchTemplates()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erro ao excluir template')
        console.error(error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      layout: { blocks: [] },
      showHeader: true,
      showFooter: true,
      isDefault: false
    })
  }

  const addBlock = () => {
    if (!newBlock.title.trim()) {
      toast.error('Título do bloco é obrigatório')
      return
    }

    const block = {
      id: `block-${Date.now()}`,
      type: newBlock.type,
      config: {
        title: newBlock.title,
        ...(newBlock.type === 'banner' && { height: '300px' }),
        ...(newBlock.type === 'news' && { count: 6 }),
        ...(newBlock.type === 'content' && { allowHtml: true })
      }
    }

    setFormData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        blocks: [...prev.layout.blocks, block]
      }
    }))

    setNewBlock({ type: 'content', title: '' })
  }

  const removeBlock = (blockId) => {
    setFormData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        blocks: prev.layout.blocks.filter(block => block.id !== blockId)
      }
    }))
  }

  const moveBlock = (blockId, direction) => {
    const blocks = [...formData.layout.blocks]
    const currentIndex = blocks.findIndex(block => block.id === blockId)
    
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex < 0 || newIndex >= blocks.length) return
    
    [blocks[currentIndex], blocks[newIndex]] = [blocks[newIndex], blocks[currentIndex]]
    
    setFormData(prev => ({
      ...prev,
      layout: { ...prev.layout, blocks }
    }))
  }

  const widgetTypes = [
    { value: 'banner', label: 'Banner/Imagem' },
    { value: 'news', label: 'Notícias' },
    { value: 'login', label: 'Widget de Login' },
    { value: 'contact', label: 'Formulário de Contato' },
    { value: 'image', label: 'Imagem' },
    { value: 'video', label: 'Vídeo' },
    { value: 'content', label: 'Conteúdo/HTML' }
  ]

  if (loading) {
    return <div className="loading">Carregando templates...</div>
  }

  return (
    <div className="templates-manager">
      <div className="page-header">
        <h1>Gerenciar Templates</h1>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
        >
          <Plus size={18} /> Novo Template
        </button>
      </div>

      {showForm && (
        <div className="card template-form">
          <h3>{editingTemplate ? 'Editar Template' : 'Novo Template'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.showHeader}
                    onChange={(e) => setFormData({ ...formData, showHeader: e.target.checked })}
                  />
                  Mostrar cabeçalho
                </label>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.showFooter}
                    onChange={(e) => setFormData({ ...formData, showFooter: e.target.checked })}
                  />
                  Mostrar rodapé
                </label>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  />
                  Template padrão
                </label>
              </div>
            </div>

            <div className="blocks-section">
              <h4>Blocos do Template</h4>
              
              <div className="add-block">
                <div className="form-row">
                  <div className="form-group">
                    <select
                      value={newBlock.type}
                      onChange={(e) => setNewBlock({ ...newBlock, type: e.target.value })}
                      className="form-control"
                    >
                      {widgetTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 2 }}>
                    <input
                      type="text"
                      placeholder="Título do bloco"
                      value={newBlock.title}
                      onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <button type="button" onClick={addBlock} className="btn btn-secondary">
                    Adicionar Bloco
                  </button>
                </div>
              </div>

              <div className="blocks-list">
                {formData.layout.blocks.map((block, index) => (
                  <div key={block.id} className="block-item">
                    <div className="block-info">
                      <strong>{block.config.title}</strong>
                      <span className="block-type">({widgetTypes.find(t => t.value === block.type)?.label})</span>
                    </div>
                    <div className="block-actions">
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, 'up')}
                        disabled={index === 0}
                        className="btn btn-sm"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, 'down')}
                        disabled={index === formData.layout.blocks.length - 1}
                        className="btn btn-sm"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className="btn btn-sm btn-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {formData.layout.blocks.length === 0 && (
                  <p className="no-blocks">Nenhum bloco adicionado ainda.</p>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingTemplate ? 'Atualizar' : 'Criar'}
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => {
                  setShowForm(false)
                  setEditingTemplate(null)
                  resetForm()
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {templates.length > 0 ? (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th className="hide-mobile">Blocos</th>
                <th>Padrão</th>
                <th className="hide-mobile">Data de Criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                <tr key={template.id}>
                  <td><strong>{template.name}</strong></td>
                  <td>{template.description || '-'}</td>
                  <td className="hide-mobile">{template.layout?.blocks?.length || 0} widgets</td>
                  <td>
                    {template.is_default && (
                      <span className="status-badge active">Padrão</span>
                    )}
                  </td>
                  <td className="hide-mobile">{new Date(template.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(template)}
                        className="action-btn edit"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      {!template.is_default && (
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="action-btn delete"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <p>Nenhum template encontrado.</p>
        </div>
      )}
    </div>
  )
}

export default Templates
