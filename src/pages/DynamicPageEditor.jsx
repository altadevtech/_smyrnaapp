import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  Save, Eye, EyeOff, ArrowLeft, FileText, 
  Layout, Tag, Home, Settings, Palette 
} from 'lucide-react'

const DynamicPageEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [templates, setTemplates] = useState([])
  const [previewMode, setPreviewMode] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors, isDirty } 
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      slug: '',
      status: 'draft',
      category_id: '',
      template_id: 1,
      is_home: false,
      widget_data: {}
    }
  })

  const watchedTitle = watch('title')
  const watchedContent = watch('content')
  const watchedStatus = watch('status')

  useEffect(() => {
    fetchInitialData()
    if (isEditing) {
      fetchPage()
    }
  }, [id])

  useEffect(() => {
    // Auto-gerar slug baseado no título
    if (watchedTitle && !isEditing) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setValue('slug', slug)
    }
  }, [watchedTitle, isEditing, setValue])

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, templatesRes] = await Promise.all([
        api.get('/categories'),
        api.get('/templates/public')
      ])
      
      setCategories(categoriesRes.data)
      setTemplates(templatesRes.data)
      
      // Obter usuário atual do token
      const userRes = await api.get('/auth/me')
      setCurrentUser(userRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error)
      toast.error('Erro ao carregar dados iniciais')
    }
  }

  const fetchPage = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/pages/${id}`)
      const page = response.data
      
      // Preencher formulário com dados da página
      Object.keys(page).forEach(key => {
        if (key === 'widget_data') {
          setValue(key, page[key] ? JSON.parse(page[key]) : {})
        } else {
          setValue(key, page[key])
        }
      })
    } catch (error) {
      console.error('Erro ao carregar página:', error)
      toast.error('Erro ao carregar página')
      navigate('/admin/pages')
    }
    setLoading(false)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Preparar dados para envio
      const payload = {
        ...data,
        widget_data: JSON.stringify(data.widget_data || {}),
        is_home: Boolean(data.is_home)
      }

      if (isEditing) {
        await api.put(`/pages/${id}`, payload)
        toast.success('Página atualizada com sucesso!')
      } else {
        await api.post('/pages', payload)
        toast.success('Página criada com sucesso!')
      }
      
      navigate('/admin/pages')
    } catch (error) {
      console.error('Erro ao salvar página:', error)
      const errorMessage = error.response?.data?.message || 'Erro ao salvar página'
      toast.error(errorMessage)
    }
    setLoading(false)
  }

  const handleQuickSave = async () => {
    if (!isDirty) {
      toast.success('Nenhuma alteração para salvar')
      return
    }

    try {
      const data = watch()
      const payload = {
        ...data,
        widget_data: JSON.stringify(data.widget_data || {}),
        is_home: Boolean(data.is_home)
      }

      if (isEditing) {
        await api.put(`/pages/${id}`, payload)
        toast.success('Rascunho salvo!')
      }
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error)
      toast.error('Erro ao salvar rascunho')
    }
  }

  const toggleStatus = () => {
    const currentStatus = watch('status')
    setValue('status', currentStatus === 'published' ? 'draft' : 'published', { shouldDirty: true })
  }

  const renderPreview = () => (
    <div className="card" style={{ padding: '2rem', minHeight: '400px' }}>
      <h1 style={{ marginBottom: '1rem' }}>{watchedTitle || 'Título da Página'}</h1>
      <div 
        style={{ 
          lineHeight: '1.6',
          fontSize: '1rem',
          color: '#333'
        }}
        dangerouslySetInnerHTML={{ 
          __html: watchedContent || '<p>Conteúdo da página aparecerá aqui...</p>' 
        }}
      />
    </div>
  )

  if (loading && isEditing) {
    return <div className="loading">Carregando página...</div>
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => navigate('/admin/pages')}
            className="btn"
            style={{ padding: '0.5rem' }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1>
            <FileText size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            {isEditing ? 'Editar Página' : 'Nova Página Wiki'}
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Preview Toggle */}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`btn ${previewMode ? 'btn-primary' : ''}`}
            style={{ padding: '0.5rem 1rem' }}
          >
            <Eye size={16} style={{ marginRight: '0.5rem' }} />
            {previewMode ? 'Editor' : 'Preview'}
          </button>
          
          {/* Quick Save (apenas para edição) */}
          {isEditing && (
            <button
              type="button"
              onClick={handleQuickSave}
              className="btn"
              disabled={!isDirty || loading}
              style={{ padding: '0.5rem 1rem' }}
            >
              <Save size={16} style={{ marginRight: '0.5rem' }} />
              Salvar Rascunho
            </button>
          )}
          
          {/* Status Toggle */}
          <button
            type="button"
            onClick={toggleStatus}
            className={`btn ${watchedStatus === 'published' ? 'btn-success' : 'btn-warning'}`}
            style={{ padding: '0.5rem 1rem' }}
          >
            {watchedStatus === 'published' ? <Eye size={16} /> : <EyeOff size={16} />}
            <span style={{ marginLeft: '0.5rem' }}>
              {watchedStatus === 'published' ? 'Publicada' : 'Rascunho'}
            </span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: previewMode ? '1fr 1fr' : '2fr 1fr', gap: '2rem' }}>
          
          {/* Coluna Principal - Editor/Preview */}
          <div>
            {previewMode ? renderPreview() : (
              <div className="card" style={{ padding: '1.5rem' }}>
                {/* Título */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Título da Página *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Título é obrigatório' })}
                    placeholder="Digite o título da página..."
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem',
                      fontSize: '1.1rem',
                      border: errors.title ? '2px solid #ef4444' : '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                  {errors.title && (
                    <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                      {errors.title.message}
                    </span>
                  )}
                </div>

                {/* Slug */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    URL (Slug) *
                  </label>
                  <input
                    type="text"
                    {...register('slug', { required: 'Slug é obrigatório' })}
                    placeholder="url-da-pagina"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem',
                      border: errors.slug ? '2px solid #ef4444' : '1px solid #ddd',
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }}
                  />
                  {errors.slug && (
                    <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                      {errors.slug.message}
                    </span>
                  )}
                </div>

                {/* Conteúdo */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Conteúdo *
                  </label>
                  <textarea
                    {...register('content', { required: 'Conteúdo é obrigatório' })}
                    rows={15}
                    placeholder="Digite o conteúdo da página... (HTML é suportado)"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem',
                      border: errors.content ? '2px solid #ef4444' : '1px solid #ddd',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      resize: 'vertical'
                    }}
                  />
                  {errors.content && (
                    <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                      {errors.content.message}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Configurações */}
          <div>
            {/* Configurações da Página */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center' }}>
                <Settings size={18} style={{ marginRight: '0.5rem' }} />
                Configurações
              </h3>

              {/* Categoria */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  <Tag size={14} style={{ marginRight: '0.25rem' }} />
                  Categoria
                </label>
                <select
                  {...register('category_id')}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Selecionar categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  <Layout size={14} style={{ marginRight: '0.25rem' }} />
                  Template
                </label>
                <select
                  {...register('template_id')}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Página Home */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    {...register('is_home')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <Home size={14} style={{ marginRight: '0.25rem' }} />
                  Definir como página inicial
                </label>
              </div>

              {/* Status */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Status
                </label>
                <select
                  {...register('status')}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicada</option>
                </select>
              </div>
            </div>

            {/* Informações */}
            {isEditing && currentUser && (
              <div className="card" style={{ padding: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Informações</h4>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  <div>Autor: {currentUser.name}</div>
                  <div>Última modificação: {new Date().toLocaleDateString()}</div>
                </div>
              </div>
            )}

            {/* Ações */}
            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem',
                  fontSize: '1rem',
                  marginBottom: '0.5rem'
                }}
              >
                <Save size={18} style={{ marginRight: '0.5rem' }} />
                {loading ? 'Salvando...' : (isEditing ? 'Atualizar Página' : 'Criar Página')}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/admin/pages')}
                className="btn"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default DynamicPageEditor
