import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  Save, ArrowLeft, FileText, 
  Layout, Tag, Settings 
} from 'lucide-react'
import RichTextEditor from '../components/RichTextEditor'
import EditorLayout from '../components/EditorLayout'
import { WikiEditorSidebar } from '../components/EditorSidebars'

const DynamicPageEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [templates, setTemplates] = useState([])
  const [previewMode, setPreviewMode] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [content, setContent] = useState('')
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors, isDirty } 
  } = useForm({
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      slug: '',
      status: 'draft',
      category_id: '',
      template_id: 1,
      widget_data: {}
    }
  })

  // Handler para mudanças no Rich Text Editor
  const handleContentChange = useCallback((newContent) => {
    setContent(newContent)
    setValue('content', newContent, { shouldValidate: false })
  }, [setValue])

  const watchedTitle = watch('title')
  const watchedContent = watch('content')

  // Carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, templatesRes] = await Promise.all([
          api.get('/categories'),
          api.get('/templates')
        ])
        
        setCategories(categoriesRes.data || [])
        setTemplates(templatesRes.data || [])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        toast.error('Erro ao carregar dados necessários')
      }
    }

    fetchData()
  }, [])

  // Buscar informações do usuário
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await api.get('/auth/me')
        setCurrentUser(response.data)
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error)
      }
    }

    fetchUserInfo()
  }, [])

  // Carregar página para edição
  useEffect(() => {
    if (!isEditing) return

    const fetchPage = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/pages/${id}`)
        const page = response.data
        
        // Preencher o formulário
        setValue('title', page.title || '')
        setValue('summary', page.summary || '')
        setValue('slug', page.slug || '')
        setValue('status', page.status || 'draft')
        setValue('category_id', page.category_id || '')
        setValue('template_id', page.template_id || 1)
        setValue('widget_data', page.widget_data ? JSON.parse(page.widget_data) : {})
        
        // Definir conteúdo para o Rich Text Editor
        const pageContent = page.content || ''
        setContent(pageContent)
        setValue('content', pageContent)
        
      } catch (error) {
        console.error('Erro ao carregar página:', error)
        toast.error('Erro ao carregar página')
        navigate('/admin/pages')
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [id, isEditing, setValue, navigate])

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      // Validação do conteúdo
      if (!content.trim()) {
        toast.error('Conteúdo é obrigatório')
        return
      }

      const payload = {
        ...data,
        content: content, // Usar o conteúdo do Rich Text Editor
        widget_data: JSON.stringify(data.widget_data || {}),
        summary: data.summary || '' // Incluir o campo summary
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
      toast.error(error.response?.data?.message || 'Erro ao salvar página')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return <div className="loading">Carregando página...</div>
  }

  return (
    <EditorLayout
      title={isEditing ? 'Editar Página Wiki' : 'Nova Página Wiki'}
      subtitle={isEditing ? 'Modifique o conteúdo da sua página' : 'Crie uma nova página para sua wiki'}
      icon={FileText}
      loading={loading}
      sidebar={<WikiEditorSidebar currentUser={currentUser} isEditing={isEditing} />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Seção Principal */}
        <div className="form-section">
          <h3 className="form-section-title">
            <FileText className="icon" />
            Informações Básicas
          </h3>
          
          <div className="form-group">
            <label className="form-label required">Título</label>
            <input
              type="text"
              className="form-input"
              placeholder="Digite o título da página..."
              {...register('title', { 
                required: 'Título é obrigatório',
                minLength: { value: 3, message: 'Título deve ter pelo menos 3 caracteres' }
              })}
            />
            {errors.title && <div className="form-error">{errors.title.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Resumo da Página</label>
            <textarea
              className="form-input form-textarea"
              rows={3}
              placeholder="Breve resumo da página (será exibido nas listagens)..."
              {...register('summary')}
            />
            <div className="form-help">
              Este resumo aparece nas listagens e ajuda na organização do conteúdo.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Slug (URL)</label>
            <input
              type="text"
              className="form-input"
              placeholder="slug-da-pagina"
              {...register('slug')}
            />
            <div className="form-help">
              URL amigável para a página. Deixe vazio para gerar automaticamente.
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Layout className="icon" />
            Conteúdo da Página
          </h3>
          
          <div className="form-group">
            <label className="form-label required">Conteúdo</label>
            <RichTextEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Digite o conteúdo da página..."
            />
            {errors.content && <div className="form-error">{errors.content.message}</div>}
          </div>
        </div>

        {/* Configurações */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Settings className="icon" />
            Configurações
          </h3>
          
          <div className="form-group">
            <label className="form-label">Categoria</label>
            <select
              className="form-input form-select"
              {...register('category_id')}
            >
              <option value="">Selecionar categoria</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Template</label>
            <select
              className="form-input form-select"
              {...register('template_id')}
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-input form-select"
              {...register('status')}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicada</option>
            </select>
          </div>
        </div>

        {/* Ações */}
        <div className="editor-actions">
          <button
            type="submit"
            className="btn-primary-editor"
            disabled={loading}
          >
            <Save size={18} />
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Página' : 'Criar Página')}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin/pages')}
            className="btn-secondary-editor"
          >
            <ArrowLeft size={18} />
            Cancelar
          </button>
        </div>
      </form>
    </EditorLayout>
  )
}

export default DynamicPageEditor
