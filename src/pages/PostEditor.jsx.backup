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
      content: '',
      status: 'draft'
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)
  const [content, setContent] = useState('')

  useEffect(() => {
    if (isEditing) {
      fetchPost()
    }
  }, [id])

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
      setValue('content', post.content)
      setValue('status', post.status)
      setContent(post.content || '')
    } catch (error) {
      toast.error('Erro ao carregar post')
      navigate('/admin/posts')
    }
    setInitialLoading(false)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      // Validar se há conteúdo
      if (!content || content.trim() === '') {
        toast.error('Conteúdo é obrigatório')
        setLoading(false)
        return
      }

      const postData = {
        title: data.title,
        content: content,
        status: data.status
      }

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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="main-content">
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

        <div className="sidebar" style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', height: 'fit-content' }}>
          <div className="editor-help">
            <h3 style={{ marginTop: 0, color: '#333', fontSize: '1.25rem' }}>📝 Editor de Posts</h3>
            
            <div className="help-sections">
              <div className="help-section" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#2563eb', fontSize: '16px', marginBottom: '0.5rem' }}>🎨 Recursos do Editor</h4>
                <ul style={{ fontSize: '14px', color: '#666', marginLeft: '1rem' }}>
                  <li><strong>Visual:</strong> Editor WYSIWYG com formatação</li>
                  <li><strong>HTML:</strong> Edição direta do código</li>
                  <li><strong>Preview:</strong> Visualização do resultado final</li>
                </ul>
              </div>

              <div className="help-section" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#16a34a', fontSize: '16px', marginBottom: '0.5rem' }}>📊 Status de Publicação</h4>
                <ul style={{ fontSize: '14px', color: '#666', marginLeft: '1rem' }}>
                  <li><strong>Rascunho:</strong> Não aparece no site público</li>
                  <li><strong>Publicado:</strong> Visível na página de blog</li>
                </ul>
              </div>

              <div className="help-section" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#dc2626', fontSize: '16px', marginBottom: '0.5rem' }}>💡 Dicas Importantes</h4>
                <ul style={{ fontSize: '14px', color: '#666', marginLeft: '1rem' }}>
                  <li>Use títulos chamativos e descritivos</li>
                  <li>Posts são exibidos em ordem cronológica</li>
                  <li>Você pode usar HTML e widgets no conteúdo</li>
                  <li>Lembre-se de salvar suas alterações</li>
                </ul>
              </div>

              <div className="help-section">
                <h4 style={{ color: '#7c3aed', fontSize: '16px', marginBottom: '0.5rem' }}>🔧 Funcionalidades</h4>
                <ul style={{ fontSize: '14px', color: '#666', marginLeft: '1rem' }}>
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
