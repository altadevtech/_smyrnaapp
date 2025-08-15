import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Save, ArrowLeft, FileText, Tag, Settings } from 'lucide-react'
import RichTextEditor from '../components/RichTextEditor'
import EditorLayout from '../components/EditorLayout'
import { PostEditorSidebar } from '../components/EditorSidebars'

const PostEditor = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      content: '',
      status: 'draft',
      category_id: ''
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState([])
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  // Função para gerar slug automaticamente
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[áàâãäå]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôõö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hifens
      .replace(/-+/g, '-') // Remove hifens consecutivos
      .replace(/^-|-$/g, '') // Remove hifens do início e fim
  }

  // Observar mudanças no título para gerar slug automaticamente
  const watchedTitle = watch('title')
  
  useEffect(() => {
    if (watchedTitle && !isEditing && !slugManuallyEdited) {
      const newSlug = generateSlug(watchedTitle)
      setValue('slug', newSlug)
    }
  }, [watchedTitle, setValue, isEditing, slugManuallyEdited])

  useEffect(() => {
    fetchCategories()
    if (isEditing) {
      fetchPost()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories?type=blog')
      setCategories(response.data)
      console.log('Categorias de blog carregadas:', response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      toast.error('Erro ao carregar categorias')
    }
  }

  // Função para atualizar o conteúdo do RichTextEditor (estabilizada com useCallback)
  const handleContentChange = useCallback((newContent) => {
    setContent(newContent)
    setValue('content', newContent, { shouldValidate: false })
  }, [setValue])

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`)
      const post = response.data
      
      setValue('title', post.title)
      setValue('slug', post.slug || '')
      setValue('summary', post.summary || '')
      setValue('content', post.content)
      setValue('status', post.status)
      setValue('category_id', post.category_id || '')
      setValue('featured_image', post.featured_image || '')
      setContent(post.content || '')
      setSlugManuallyEdited(true) // Marca que o slug não deve ser auto-gerado ao editar
    } catch (error) {
      toast.error('Erro ao carregar post')
      navigate('/admin/posts')
    }
    setInitialLoading(false)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      // Validar se há conteúdo (removendo HTML tags para verificar se há texto real)
      const textContent = content.replace(/<[^>]*>/g, '').trim()
      if (!content || !textContent) {
        toast.error('Conteúdo é obrigatório')
        setLoading(false)
        return
      }

      // Validar slug
      if (!data.slug || !data.slug.trim()) {
        toast.error('Slug é obrigatório')
        setLoading(false)
        return
      }

      const postData = {
        title: data.title,
        slug: data.slug,
        summary: data.summary || '',
        content: content,
        status: data.status,
        category_id: data.category_id || null
      }

      console.log('Dados do post:', postData)

      if (isEditing) {
        await api.put(`/posts/${id}`, postData)
        toast.success('Post atualizado com sucesso!')
      } else {
        await api.post('/posts', postData)
        toast.success('Post criado com sucesso!')
        navigate('/admin/posts')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar post')
      console.error(error)
    }
    setLoading(false)
  }

  if (initialLoading) {
    return <div className="loading">Carregando post...</div>
  }

  return (
    <EditorLayout
      title={isEditing ? 'Editar Post' : 'Novo Post'}
      subtitle={isEditing ? 'Modifique seu post do blog' : 'Crie um novo post para o blog'}
      icon={FileText}
      loading={loading}
      sidebar={<PostEditorSidebar isEditing={isEditing} />}
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
              placeholder="Digite o título do post..."
              {...register('title', { required: 'Título é obrigatório' })}
            />
            {errors.title && <div className="form-error">{errors.title.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label required">URL/Slug</label>
            <input
              type="text"
              className="form-input"
              placeholder="url-amigavel-do-post"
              {...register('slug', { required: 'Slug é obrigatório' })}
              onChange={(e) => {
                setSlugManuallyEdited(true)
                register('slug').onChange(e)
              }}
            />
            {errors.slug && <div className="form-error">{errors.slug.message}</div>}
            <div className="form-help">
              {!slugManuallyEdited && !isEditing ? 
                "Gerado automaticamente baseado no título. Você pode editá-lo se necessário." :
                "Usado para criar URLs amigáveis."
              }
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Resumo</label>
            <textarea
              className="form-input form-textarea"
              rows={3}
              placeholder="Breve resumo do post (será exibido na lista de posts)..."
              {...register('summary')}
            />
            <div className="form-help">
              Este resumo aparecerá na grade de posts no blog. Recomendamos entre 100-200 caracteres.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Imagem Destaque</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://exemplo.com/imagem.jpg"
              {...register('featured_image')}
            />
            <div className="form-help">
              URL da imagem que será exibida no grid de posts e no cabeçalho do post individual. Use uma imagem com boa resolução (recomendado: 1200x630px).
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="form-section">
          <h3 className="form-section-title">
            <FileText className="icon" />
            Conteúdo do Post
          </h3>
          
          <div className="form-group">
            <label className="form-label required">Conteúdo</label>
            <RichTextEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Digite o conteúdo do post..."
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
            <label className="form-label">Status</label>
            <select
              className="form-input form-select"
              {...register('status')}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
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
            {loading ? 'Salvando...' : 'Salvar Post'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
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

export default PostEditor
