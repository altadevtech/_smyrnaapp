import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Move, ExternalLink, Eye, EyeOff, Menu, GripVertical } from 'lucide-react'

const Menus = () => {
  const [menus, setMenus] = useState([])
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingMenu, setEditingMenu] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    target: '_self',
    parent_id: null,
    page_id: null,
    sort_order: 0,
    is_active: true,
    css_class: '',
    icon: ''
  })

  useEffect(() => {
    fetchMenus()
    fetchPages()
  }, [])

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus')
      setMenus(response.data)
    } catch (error) {
      toast.error('Erro ao carregar menus')
      console.error('Erro ao buscar menus:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPages = async () => {
    try {
      const response = await api.get('/pages')
      setPages(response.data)
    } catch (error) {
      toast.error('Erro ao carregar p├íginas')
      console.error('Erro ao buscar p├íginas:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingMenu) {
        await api.put(`/menus/${editingMenu.id}`, formData)
        toast.success('Menu atualizado com sucesso!')
      } else {
        await api.post('/menus', formData)
        toast.success('Menu criado com sucesso!')
      }
      
      setShowForm(false)
      setEditingMenu(null)
      resetForm()
      fetchMenus()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar menu')
      console.error('Erro ao salvar menu:', error)
    }
  }

  const handleEdit = (menu) => {
    setEditingMenu(menu)
    setFormData({
      title: menu.title,
      url: menu.url || '',
      target: menu.target || '_self',
      parent_id: menu.parent_id || null,
      page_id: menu.page_id || null,
      sort_order: menu.sort_order || 0,
      is_active: menu.is_active,
      css_class: menu.css_class || '',
      icon: menu.icon || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este menu?')) return
    
    try {
      await api.delete(`/menus/${id}`)
      toast.success('Menu exclu├¡do com sucesso!')
      fetchMenus()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao excluir menu. Verifique se n├úo h├í submenus vinculados.')
      console.error('Erro ao excluir menu:', error)
    }
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const items = Array.from(menus)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Atualizar ordem local imediatamente
    setMenus(items)

    // Enviar nova ordem para o servidor
    try {
      const reorderedItems = items.map((item, index) => ({
        id: item.id,
        sort_order: index + 1
      }))
      
      await api.post('/menus/reorder', { items: reorderedItems })
      toast.success('Ordem dos menus atualizada!')
    } catch (error) {
      toast.error('Erro ao reordenar menus')
      console.error('Erro ao reordenar menus:', error)
      // Reverter mudan├ºa em caso de erro
      fetchMenus()
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      target: '_self',
      parent_id: null,
      page_id: null,
      sort_order: 0,
      is_active: true,
      css_class: '',
      icon: ''
    })
  }

  const getParentMenus = () => {
    return menus.filter(menu => !menu.parent_id)
  }

  const renderMenuHierarchy = () => {
    const parentMenus = menus.filter(menu => !menu.parent_id)
    
    return parentMenus.map(menu => (
      <div key={menu.id} className="mb-4">
        <MenuRow menu={menu} level={0} />
        {menus
          .filter(child => child.parent_id === menu.id)
          .map(child => (
            <MenuRow key={child.id} menu={child} level={1} />
          ))}
      </div>
    ))
  }

  const MenuRow = ({ menu, level }) => (
    <div 
      className={`menu-item ${level > 0 ? 'menu-item-child' : ''}`}
      style={{
        marginLeft: level > 0 ? '2rem' : '0',
        borderLeft: level > 0 ? '4px solid #e5e7eb' : 'none',
        paddingLeft: level > 0 ? '1rem' : '0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GripVertical size={16} style={{ color: '#9ca3af', cursor: 'grab' }} />
          {level > 0 && (
            <span style={{ color: '#9ca3af' }}>ÔööÔöÇ</span>
          )}
          {menu.icon && (
            <i className={menu.icon}></i>
          )}
          <strong>{menu.title}</strong>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <span className="badge badge-secondary">
            {menu.url || (menu.page_slug ? `/${menu.page_slug}` : 'Sem URL')}
          </span>
          
          {menu.parent_title && (
            <span className="badge badge-info">
              Submenu de: {menu.parent_title}
            </span>
          )}
          
          <span className={`badge ${menu.is_active ? 'badge-success' : 'badge-danger'}`}>
            {menu.is_active ? (
              <>
                <Eye size={14} style={{ marginRight: '0.25rem' }} />
                Ativo
              </>
            ) : (
              <>
                <EyeOff size={14} style={{ marginRight: '0.25rem' }} />
                Inativo
              </>
            )}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => handleEdit(menu)}
          className="btn btn-sm btn-outline"
          title="Editar menu"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => handleDelete(menu.id)}
          className="btn btn-sm btn-danger"
          title="Excluir menu"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )

  if (loading) {
    return <div className="loading">Carregando menus...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Gerenciar Menus</h1>
        <button
          onClick={() => {
            setEditingMenu(null)
            resetForm()
            setShowForm(true)
          }}
          className="btn btn-primary"
        >
          <Plus size={18} style={{ verticalAlign: 'middle' }} /> Novo Menu
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{editingMenu ? 'Editar Menu' : 'Novo Menu'}</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>T├¡tulo *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="/caminho-da-pagina"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>P├ígina Vinculada</label>
                <select
                  className="form-control"
                  value={formData.page_id || ''}
                  onChange={(e) => setFormData({ ...formData, page_id: e.target.value || null })}
                >
                  <option value="">Selecione uma p├ígina</option>
                  {pages.map(page => (
                    <option key={page.id} value={page.id}>
                      {page.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Menu Pai</label>
                <select
                  className="form-control"
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                >
                  <option value="">Menu Principal</option>
                  {getParentMenus()
                    .filter(menu => !editingMenu || menu.id !== editingMenu.id)
                    .map(menu => (
                      <option key={menu.id} value={menu.id}>
                        {menu.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target</label>
                <select
                  className="form-control"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                >
                  <option value="_self">Mesma janela</option>
                  <option value="_blank">Nova janela</option>
                </select>
              </div>

              <div className="form-group">
                <label>├ìcone (CSS Class)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="fas fa-home, bi bi-house, etc."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>CSS Class</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.css_class}
                  onChange={(e) => setFormData({ ...formData, css_class: e.target.value })}
                  placeholder="classes-css-personalizadas"
                />
              </div>

              <div className="form-group">
                <label>Ordem</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                Menu ativo
              </label>
            </div>

            <div className="actions">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingMenu(null)
                  resetForm()
                }}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingMenu ? 'Atualizar' : 'Criar'} Menu
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Menus Cadastrados</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Organize os menus arrastando e soltando para reordenar
        </p>
        
        {menus.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum menu cadastrado. Clique em "Novo Menu" para come├ºar.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {renderMenuHierarchy()}
          </div>
        )}
      </div>
    </div>
  )
}

export default Menus
