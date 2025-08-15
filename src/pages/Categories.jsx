import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Save, X, Tag, ChevronRight } from 'lucide-react'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [parentCategories, setParentCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [activeTab, setActiveTab] = useState('wiki') // 'wiki' ou 'blog'

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      color: '#6366f1',
      type: 'wiki',
      parent_id: ''
    }
  })

  const watchName = watch('name')

  useEffect(() => {
    fetchCategories()
    fetchParentCategories()
  }, [activeTab])

  useEffect(() => {
    if (watchName && !editingCategory) {
      setValue('slug', generateSlug(watchName))
    }
  }, [watchName, setValue, editingCategory])

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

  const fetchParentCategories = async () => {
    try {
      const response = await api.get(`/categories/main/${activeTab}`)
      setParentCategories(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias principais:', error)
    }
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
    setValue('parent_id', category.parent_id || '')
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
      type: activeTab,
      parent_id: ''
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

  // Organizar categorias em estrutura hierárquica
  const organizeCategories = () => {
    const rootCategories = categories.filter(cat => !cat.parent_id)
    const subcategories = categories.filter(cat => cat.parent_id)

    return rootCategories.map(rootCat => ({
      ...rootCat,
      subcategories: subcategories.filter(subCat => subCat.parent_id === rootCat.id)
    }))
  }

  const getCategoryDisplay = (category) => {
    if (category.parent_name) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-500">{category.parent_name}</span>
          <ChevronRight size={16} className="text-gray-400" />
          <span>{category.name}</span>
        </div>
      )
    }
    return category.name
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
                <label htmlFor="parent_id">Categoria Pai (opcional)</label>
                <select
                  id="parent_id"
                  className="form-control"
                  {...register('parent_id')}
                >
                  <option value="">Categoria Principal</option>
                  {parentCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Deixe vazio para criar uma categoria principal ou selecione uma categoria pai para criar uma subcategoria
                </small>
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
        <div className="card" style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <div className="table-responsive">
            <table className="table" style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0',
              margin: '0',
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb'
            }}>
            <thead style={{
              background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
              color: 'white'
            }}>
              <tr>
                <th style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Nome</th>
                <th style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Slug</th>
                <th className="hide-mobile" style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Descrição</th>
                <th style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Badge</th>
                <th style={{
                  padding: '1.25rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  border: 'none',
                  color: 'white',
                  textTransform: 'uppercase'
                }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} style={{
                  transition: 'all 0.3s ease',
                  borderBottom: '1px solid #f1f5f9',
                  background: 'white'
                }}>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: '#374151',
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {category.parent_id && <span style={{ marginLeft: '1.5rem', color: '#9ca3af' }}>↳</span>}
                      <span style={{ fontSize: '1.2rem' }}>
                        {category.type === 'wiki' ? '📚' : '📝'}
                      </span>
                      <div>
                        {getCategoryDisplay(category)}
                      </div>
                    </div>
                  </td>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle'
                  }}>
                    <code style={{ 
                      backgroundColor: '#f1f5f9', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                    }}>
                      {category.slug}
                    </code>
                  </td>
                  <td className="hide-mobile" style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                    maxWidth: '200px'
                  }}>
                    {category.description || (
                      <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>Sem descrição</span>
                    )}
                  </td>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle'
                  }}>
                    <span 
                      style={{
                        backgroundColor: category.color,
                        color: 'white',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'inline-block',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {category.name}
                    </span>
                  </td>
                  <td style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => handleEdit(category)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          border: 'none',
                          borderRadius: '8px',
                          background: '#f0f9ff',
                          color: '#0369a1',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '0'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#0369a1'
                          e.target.style.color = 'white'
                          e.target.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#f0f9ff'
                          e.target.style.color = '#0369a1'
                          e.target.style.transform = 'translateY(0)'
                        }}
                        title="Editar categoria"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          border: 'none',
                          borderRadius: '8px',
                          background: '#fef2f2',
                          color: '#dc2626',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '0'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#dc2626'
                          e.target.style.color = 'white'
                          e.target.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#fef2f2'
                          e.target.style.color = '#dc2626'
                          e.target.style.transform = 'translateY(0)'
                        }}
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
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            opacity: 0.5
          }}>
            {activeTab === 'wiki' ? '📚' : '📝'}
          </div>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            color: '#374151',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Nenhuma categoria de {activeTab === 'wiki' ? 'Wiki' : 'Blog'} encontrada
          </h3>
          <p style={{
            margin: '0 0 1.5rem 0',
            fontSize: '0.95rem'
          }}>
            Crie sua primeira categoria {activeTab === 'wiki' ? 'de Wiki' : 'de Blog'} para organizar melhor seu conteúdo!
          </p>
          <button 
            onClick={() => setIsCreating(true)} 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 4px 15px rgba(102, 234, 205, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            <Plus size={18} />
            Criar Primeira Categoria
          </button>
        </div>
      )}
    </div>
  )
}

export default Categories
