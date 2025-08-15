import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Save, ArrowLeft } from 'lucide-react'
import RichTextEditor from '../components/RichTextEditor'

const PageEditor = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      status: 'draft',
      category_id: '',
      tags: '',
      changeSummary: ''
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState([])

  // Handler para mudanças no Rich Text Editor
  const handleContentChange = useCallback((newContent) => {
    setContent(newContent)
    setValue('content', newContent, { shouldValidate: false })
  }, [setValue])

  useEffect(() => {
    fetchCategories()
    if (isEditing) {
      fetchPage()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories?type=wiki')
      setCategories(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const fetchPage = async () => {
    try {
      const response = await api.get(`/pages/${id}`)
      const page = response.data
      
      setValue('title', page.title)
      setValue('summary', page.summary || '')
      setValue('content', page.content)
      setValue('status', page.status)
      setValue('category_id', page.category_id || '')
      setValue('tags', page.tags || '')
      setContent(page.content || '')
    } catch (error) {
      toast.error('Erro ao carregar página')
      navigate('/admin/pages')
    }
    setInitialLoading(false)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      // Validar se há conteúdo
      const textContent = content.replace(/<[^>]*>/g, '').trim()
      if (!content || !textContent) {
        toast.error('Conteúdo é obrigatório')
        setLoading(false)
        return
      }

      const pageData = {
        title: data.title,
        summary: data.summary || '',
        content: content,
        status: data.status,
        category_id: data.category_id || null,
        tags: data.tags || '',
        changeSummary: data.changeSummary || ''
      }

      if (isEditing) {
        await api.put(`/pages/${id}`, pageData)
        toast.success('Página atualizada com sucesso!')
      } else {
        await api.post('/pages', pageData)
        toast.success('Página criada com sucesso!')
        navigate('/admin/pages')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar página')
      console.error(error)
    }
    
    setLoading(false)
  }

  if (initialLoading) {
    return <div className="loading">Carregando página...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin/pages')} className="btn">
          <ArrowLeft size={18} />
        </button>
        <h1>{isEditing ? 'Editar Página Wiki' : 'Nova Página Wiki'}</h1>
      </div>

      <div className="card">
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
            <label htmlFor="summary">Resumo da Página</label>
            <textarea
              id="summary"
              className="form-control"
              rows="3"
              placeholder="Breve resumo da página (será exibido na lista de páginas)..."
              {...register('summary')}
            />
            <small className="form-text text-muted">
              Este resumo aparecerá na grade de páginas wiki. Recomendamos entre 100-200 caracteres.
            </small>
          </div>

          <div className="form-group">
            <label>Conteúdo *</label>
            <RichTextEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Digite o conteúdo da página..."
            />
            {errors.content && (
              <div className="error" style={{ marginTop: '0.5rem' }}>
                {errors.content.message}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Categoria</label>
            <select
              id="category_id"
              className="form-control"
              {...register('category_id')}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              className="form-control"
              placeholder="Digite tags separadas por vírgula (ex: tutorial, programação, javascript)"
              {...register('tags')}
            />
            <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>
              Separe as tags com vírgulas. Elas ajudam na busca e organização do conteúdo.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              className="form-control"
              {...register('status')}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicada</option>
            </select>
          </div>

          {isEditing && (
            <div className="form-group">
              <label htmlFor="changeSummary">Resumo das Alterações</label>
              <input
                type="text"
                id="changeSummary"
                className="form-control"
                placeholder="Descreva brevemente as alterações feitas (opcional)"
                {...register('changeSummary')}
              />
              <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>
                Este resumo será salvo no histórico de versões da página.
              </small>
            </div>
          )}

          <div className="actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={18} style={{ verticalAlign: 'middle' }} />
              {loading ? 'Salvando...' : 'Salvar Página'}
            </button>
            <button 
              type="button" 
              className="btn" 
              onClick={() => navigate('/admin/pages')}
            >
              Cancelar
            </button>
            {isEditing && (
              <button 
                type="button" 
                className="btn"
                onClick={() => navigate(`/admin/pages/${id}/versions`)}
                style={{ marginLeft: '0.5rem' }}
              >
                Ver Histórico
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        <h4>Dicas:</h4>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>Use títulos descritivos para suas páginas do wiki</li>
          <li>Páginas do wiki com status "Rascunho" não aparecerão no site público</li>
          <li>Escolha uma categoria para ajudar na organização do conteúdo</li>
          <li>Use tags relevantes para facilitar a busca (separe por vírgulas)</li>
          <li>Você pode usar HTML básico no conteúdo</li>
          <li>Lembre-se de salvar suas alterações</li>
        </ul>
      </div>
    </div>
  )
}

export default PageEditor
