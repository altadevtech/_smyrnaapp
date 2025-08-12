import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Save, ArrowLeft } from 'lucide-react'

const PageEditor = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: '',
      status: 'draft',
      category_id: '',
      tags: '',
      changeSummary: ''
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)
  const [categories, setCategories] = useState([])

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
      setValue('content', page.content)
      setValue('status', page.status)
      setValue('category_id', page.category_id || '')
      setValue('tags', page.tags || '')
    } catch (error) {
      toast.error('Erro ao carregar página')
      navigate('/admin/pages')
    }
    setInitialLoading(false)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      if (isEditing) {
        await api.put(`/pages/${id}`, data)
        toast.success('Página atualizada com sucesso!')
      } else {
        await api.post('/pages', data)
        toast.success('Página criada com sucesso!')
      }
      navigate('/admin/pages')
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
        <h1>{isEditing ? 'Editar Página' : 'Nova Página'}</h1>
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
            <label htmlFor="content">Conteúdo *</label>
            <textarea
              id="content"
              className="form-control editor"
              rows="15"
              placeholder="Digite o conteúdo da página..."
              {...register('content', { required: 'Conteúdo é obrigatório' })}
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
