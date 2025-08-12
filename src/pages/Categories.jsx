import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Save, X, Tag } from 'lucide-react'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [activeTab, setActiveTab] = useState('wiki') // 'wiki' ou 'blog'

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      color: '#6366f1',
      type: 'wiki'
    }
  })

  useEffect(() => {
    fetchCategories()
  }, [activeTab])

  const fetchCategories = async () => {
    try {
      const response = await api.get(`/categories?type=${activeTab}`)
      setCategories(response.data)
    } catch (error) {
      toast.error('Erro ao carregar categorias')
      console.error(error)
    }
    setLoading(false)
  }

  const generateSlug = (name) => {
    return name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }

  const onSubmit = async (data) => {
    try {
      // Garantir que o tipo seja o mesmo da aba ativa
      const categoryData = { ...data, type: activeTab }
      
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, categoryData)
        toast.success('Categoria atualizada com sucesso!')
      } else {
        await api.post('/categories', categoryData)
        toast.success('Categoria criada com sucesso!')
      }
      
      fetchCategories()
      handleCancel()
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao salvar categoria'
      toast.error(message)
      console.error(error)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setValue('name', category.name)
    setValue('slug', category.slug)
    setValue('description', category.description)
    setValue('color', category.color)
    setIsCreating(true)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingCategory(null)
    reset({
      name: '',
      slug: '',
      description: '',
      color: '#6366f1',
      type: activeTab
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await api.delete(`/categories/${id}`)
        toast.success('Categoria excluída com sucesso!')
        fetchCategories()
      } catch (error) {
        const message = error.response?.data?.error || 'Erro ao excluir categoria'
        toast.error(message)
        console.error(error)
      }
    }
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    if (!editingCategory) {
      setValue('slug', generateSlug(name))
    }
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Carregando categorias...</div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1><Tag size={24} /> Categorias</h1>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)} 
            className="btn btn-primary"
          >
            <Plus size={18} /> Nova Categoria
          </button>
        )}
      </div>

      {/* Abas para alternar entre Wiki e Blog */}
      <div style={{ 
        borderBottom: '1px solid #e2e8f0', 
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem'
      }}>
        <button
          onClick={() => setActiveTab('wiki')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'wiki' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'wiki' ? '#3b82f6' : '#64748b',
            fontWeight: activeTab === 'wiki' ? '600' : '400',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          📚 Categorias Wiki
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'blog' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'blog' ? '#3b82f6' : '#64748b',
            fontWeight: activeTab === 'blog' ? '600' : '400',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          📝 Categorias Blog
        </button>
      </div>

      {/* Abas para Wiki e Blog */}
      <div className="category-tabs" style={{ marginBottom: '2rem' }}>
        <button 
          className={`tab-btn ${activeTab === 'wiki' ? 'active' : ''}`}
          onClick={() => setActiveTab('wiki')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem 0.5rem 0 0',
            background: activeTab === 'wiki' ? '#3b82f6' : '#f1f5f9',
            color: activeTab === 'wiki' ? 'white' : '#64748b',
            fontWeight: '500',
            cursor: 'pointer',
            marginRight: '0.25rem',
            transition: 'all 0.2s'
          }}
        >
          📚 Wiki
        </button>
        <button 
          className={`tab-btn ${activeTab === 'blog' ? 'active' : ''}`}
          onClick={() => setActiveTab('blog')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem 0.5rem 0 0',
            background: activeTab === 'blog' ? '#3b82f6' : '#f1f5f9',
            color: activeTab === 'blog' ? 'white' : '#64748b',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📝 Blog
        </button>
      </div>

      {isCreating && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nome *</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  {...register('name', { 
                    required: 'Nome é obrigatório',
                    onChange: handleNameChange
                  })}
                />
                {errors.name && (
                  <div className="error">{errors.name.message}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="slug">Slug *</label>
                <input
                  type="text"
                  id="slug"
                  className="form-control"
                  {...register('slug', { required: 'Slug é obrigatório' })}
                />
                {errors.slug && (
                  <div className="error">{errors.slug.message}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  className="form-control"
                  rows="3"
                  {...register('description')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Tipo *</label>
                <select
                  id="type"
                  className="form-control"
                  {...register('type', { required: 'Tipo é obrigatório' })}
                  value={activeTab}
                  disabled
                >
                  <option value="wiki">📚 Wiki</option>
                  <option value="blog">📝 Blog</option>
                </select>
                <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  O tipo é definido pela aba ativa
                </small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color">Cor</label>
                <input
                  type="color"
                  id="color"
                  className="form-control"
                  style={{ height: '45px' }}
                  {...register('color')}
                />
              </div>
            </div>

            <div className="actions">
              <button type="submit" className="btn btn-primary">
                <Save size={18} /> Salvar
              </button>
              <button type="button" onClick={handleCancel} className="btn">
                <X size={18} /> Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.length > 0 ? (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Slug</th>
                <th className="hide-mobile">Descrição</th>
                <th>Badge</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {category.type === 'wiki' ? '📚' : '📝'}
                      </span>
                      <strong>{category.name}</strong>
                    </div>
                  </td>
                  <td>
                    <code style={{ 
                      backgroundColor: '#f1f5f9', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem'
                    }}>
                      {category.slug}
                    </code>
                  </td>
                  <td className="hide-mobile">{category.description || '-'}</td>
                  <td>
                    <span 
                      style={{
                        backgroundColor: category.color,
                        color: 'white',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}
                    >
                      {category.name}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(category)}
                        className="action-btn edit"
                        title="Editar categoria"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="action-btn delete"
                        title="Excluir categoria"
                      >
                        <Trash2 size={16} />
                      </button>
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
          <p>
            Nenhuma categoria de {activeTab === 'wiki' ? 'Wiki' : 'Blog'} encontrada. 
            {' '}Crie sua primeira categoria {activeTab === 'wiki' ? 'de Wiki' : 'de Blog'}!
          </p>
        </div>
      )}
    </div>
  )
}

export default Categories
