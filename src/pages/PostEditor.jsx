import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Save, ArrowLeft } from 'lucide-react'
import RichTextEditor from '../components/RichTextEditor'

const PostEditor = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      slug: '',
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
      setValue('content', post.content)
      setValue('status', post.status)
      setValue('category_id', post.category_id || '')
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
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin/posts')} className="btn">
          <ArrowLeft size={18} />
        </button>
        <h1>{isEditing ? 'Editar Post' : 'Novo Post'}</h1>
      </div>

      <div className="post-editor-grid">
        {/* Formulário principal à esquerda */}
        <div className="post-editor-main">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input
                type="text"
                id="title"
                className="form-control"
                {...register('title', { required: 'Título é obrigatório' })}
              />
              {errors.title && (
                <div className="error" style={{ marginTop: '0.5rem' }}>
                  {errors.title.message}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="slug">URL/Slug *</label>
              <input
                type="text"
                id="slug"
                className="form-control"
                {...register('slug', { required: 'Slug é obrigatório' })}
                placeholder="url-amigavel-do-post"
                onChange={(e) => {
                  // Marcar que o slug foi editado manualmente
                  setSlugManuallyEdited(true)
                  // Aplicar a função register do react-hook-form
                  register('slug').onChange(e)
                }}
              />
              {errors.slug && (
                <div className="error" style={{ marginTop: '0.5rem' }}>
                  {errors.slug.message}
                </div>
              )}
              <small className="form-text text-muted">
                {!slugManuallyEdited && !isEditing ? 
                  "Gerado automaticamente baseado no título. Você pode editá-lo se necessário." :
                  "Usado para criar URLs amigáveis."
                }
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Categoria</label>
              <select
                id="category_id"
                className="form-control"
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
              <label>Conteúdo *</label>
              <RichTextEditor
                value={content}
                onChange={handleContentChange}
                placeholder="Digite o conteúdo do post..."
              />
              {errors.content && (
                <div className="error" style={{ marginTop: '0.5rem' }}>
                  {errors.content.message}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className="form-control"
                {...register('status')}
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div className="actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                <Save size={18} style={{ verticalAlign: 'middle' }} />
                {loading ? 'Salvando...' : 'Salvar Post'}
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => navigate('/admin/posts')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar de ajuda à direita */}
        <div className="post-editor-sidebar">
          <div className="editor-help">
            <h3 style={{ marginTop: 0, color: 'var(--text-color)', fontSize: '1.25rem' }}>📝 Editor de Posts</h3>
            
            <div className="help-sections">
              <div className="help-section" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--primary-color)', fontSize: '16px', marginBottom: '0.5rem' }}>🎨 Recursos do Editor</h4>
                <ul style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '1rem' }}>
                  <li><strong>Visual:</strong> Editor WYSIWYG com formatação</li>
                  <li><strong>HTML:</strong> Edição direta do código</li>
                  <li><strong>Preview:</strong> Visualização do resultado final</li>
                </ul>
              </div>

              <div className="help-section" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--success-color)', fontSize: '16px', marginBottom: '0.5rem' }}>📊 Status de Publicação</h4>
                <ul style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '1rem' }}>
                  <li><strong>Rascunho:</strong> Não aparece no site público</li>
                  <li><strong>Publicado:</strong> Visível na página de blog</li>
                </ul>
              </div>

              <div className="help-section" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--danger-color)', fontSize: '16px', marginBottom: '0.5rem' }}>💡 Dicas Importantes</h4>
                <ul style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '1rem' }}>
                  <li>Use títulos chamativos e descritivos</li>
                  <li>Posts são exibidos em ordem cronológica</li>
                  <li>Você pode usar HTML e widgets no conteúdo</li>
                  <li>Lembre-se de salvar suas alterações</li>
                </ul>
              </div>

              <div className="help-section">
                <h4 style={{ color: 'var(--primary-color)', fontSize: '16px', marginBottom: '0.5rem' }}>🔧 Funcionalidades</h4>
                <ul style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '1rem' }}>
                  <li>Formatação rica de texto</li>
                  <li>Inserção de links e imagens</li>
                  <li>Listas numeradas e com marcadores</li>
                  <li>Códigos e citações</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostEditor
