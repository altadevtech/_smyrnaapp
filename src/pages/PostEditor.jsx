import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Save, ArrowLeft } from 'lucide-react'

const PostEditor = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: '',
      status: 'draft'
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)

  useEffect(() => {
    if (isEditing) {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`)
      const post = response.data
      
      setValue('title', post.title)
      setValue('content', post.content)
      setValue('status', post.status)
    } catch (error) {
      toast.error('Erro ao carregar post')
      navigate('/admin/posts')
    }
    setInitialLoading(false)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      if (isEditing) {
        await api.put(`/posts/${id}`, data)
        toast.success('Post atualizado com sucesso!')
      } else {
        await api.post('/posts', data)
        toast.success('Post criado com sucesso!')
      }
      navigate('/admin/posts')
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
              placeholder="Digite o conteúdo do post..."
              {...register('content', { required: 'Conteúdo é obrigatório' })}
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

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        <h4>Dicas:</h4>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>Use títulos chamativos para seus posts</li>
          <li>Posts com status "Rascunho" não aparecerão no site público</li>
          <li>Você pode usar HTML básico no conteúdo</li>
          <li>Lembre-se de salvar suas alterações</li>
          <li>Posts são exibidos em ordem cronológica na página inicial</li>
        </ul>
      </div>
    </div>
  )
}

export default PostEditor
