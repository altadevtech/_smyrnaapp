import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Save, ArrowLeft } from 'lucide-react'
import RichTextEditor from '../components/RichTextEditor'

const DynamicPageEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(isEditing)
  const [content, setContent] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: '',
      status: 'draft',
      slug: '',
      isHome: false
    }
  })

  useEffect(() => {
    if (isEditing) {
      fetchPage()
    }
  }, [id, isEditing])

  // Função para atualizar o conteúdo do RichTextEditor (estabilizada com useCallback)
  const handleContentChange = useCallback((newContent) => {
    setContent(newContent)
    setValue('content', newContent, { shouldValidate: false })
  }, [setValue])

  const fetchPage = async () => {
    try {
      const response = await api.get(`/pages/${id}`)
      const pageData = response.data
      
      setPage(pageData)
      setValue('title', pageData.title)
      setValue('content', pageData.content)
      setValue('status', pageData.status)
      setValue('slug', pageData.slug || '')
      setValue('isHome', pageData.is_home || false)
      setContent(pageData.content || '')
    } catch (error) {
      toast.error('Erro ao carregar página')
      console.error(error)
      navigate('/admin/pages')
    }
    setLoading(false)
  }

  const onSubmit = async (formData) => {
    try {
      // Validar se há conteúdo
      if (!content || content.trim() === '') {
        toast.error('Conteúdo é obrigatório')
        return
      }

      const pageData = {
        title: formData.title,
        content: content,
        status: formData.status,
        slug: formData.slug,
        isHome: formData.isHome
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
  }

  if (loading) {
    return <div className="loading">Carregando página...</div>
  }

  return (
    <div className="page-editor">
      <div className="editor-header">
        <div className="header-left">
          <button 
            type="button" 
            onClick={() => navigate('/admin/pages')}
            className="btn btn-secondary"
          >
            <ArrowLeft size={18} /> Voltar
          </button>
          <h1>{isEditing ? 'Editar Página' : 'Nova Página'}</h1>
        </div>
        <div className="header-right">
          <button type="submit" form="page-form" className="btn btn-primary">
            <Save size={18} /> Salvar
          </button>
        </div>
      </div>

      <form id="page-form" onSubmit={handleSubmit(onSubmit)} className="editor-form">
        <div className="form-layout" style={{ display: 'flex', gap: '2rem' }}>
          <div className="main-content" style={{ flex: 2 }}>
            <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Título:</label>
                <input
                  type="text"
                  className="form-control"
                  {...register('title', { required: 'Título é obrigatório' })}
                />
                {errors.title && <span className="error">{errors.title.message}</span>}
              </div>
              
              <div className="form-group" style={{ flex: 1 }}>
                <label>Slug (URL):</label>
                <input
                  type="text"
                  className="form-control"
                  {...register('slug')}
                  placeholder="url-amigavel"
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label>Status:</label>
                <select className="form-control" {...register('status')}>
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    {...register('isHome')}
                  />
                  Definir como página inicial
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Conteúdo:</label>
              <RichTextEditor
                value={content}
                onChange={handleContentChange}
                placeholder="Digite o conteúdo da página..."
              />
              {errors.content && <span className="error">{errors.content.message}</span>}
            </div>
          </div>

          <div className="sidebar" style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
            <div className="editor-help">
              <h3 style={{ marginTop: 0, color: '#333' }}>� Editor de Conteúdo</h3>
              
              <div className="help-sections">
                <div className="help-section" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#2563eb', fontSize: '16px', marginBottom: '0.5rem' }}>🎨 Modos de Edição</h4>
                  <ul style={{ fontSize: '14px', color: '#666', marginLeft: '1rem' }}>
                    <li><strong>Visual:</strong> Editor WYSIWYG com formatação</li>
                    <li><strong>HTML:</strong> Edição direta do código HTML</li>
                    <li><strong>Preview:</strong> Visualização com widgets renderizados</li>
                  </ul>
                </div>
                
                <div className="help-section" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#2563eb', fontSize: '16px', marginBottom: '0.5rem' }}>⚡ Widgets Rápidos</h4>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>
                    Use a barra de widgets ou digite os shortcodes:
                  </p>
                  <div style={{ fontSize: '12px', color: '#555' }}>
                    <code style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '3px', display: 'block', marginBottom: '4px' }}>[widget:banner]</code>
                    <code style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '3px', display: 'block', marginBottom: '4px' }}>[widget:contact]</code>
                    <code style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '3px', display: 'block', marginBottom: '4px' }}>[widget:news]</code>
                  </div>
                </div>
                
                <div className="help-section">
                  <h4 style={{ color: '#2563eb', fontSize: '16px', marginBottom: '0.5rem' }}>💡 Dicas</h4>
                  <ul style={{ fontSize: '14px', color: '#666', marginLeft: '1rem' }}>
                    <li>Use o <strong>Preview</strong> para ver como ficará</li>
                    <li>Widgets são renderizados automaticamente</li>
                    <li>HTML personalizado é suportado</li>
                    <li>Shortcodes funcionam em qualquer modo</li>
                  </ul>
                </div>
              </div>
              
              <div className="help-note" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '4px', border: '1px solid #93c5fd' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#1e40af' }}>
                  <strong>� Novo:</strong> Editor rico com preview em tempo real!
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default DynamicPageEditor
