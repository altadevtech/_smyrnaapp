import React, { useState, useCallback, useRef, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Eye, Code, Edit } from 'lucide-react'
import ContentRenderer from './ContentRenderer'

const RichTextEditor = ({ value, onChange, placeholder = "Digite o conteúdo..." }) => {
  const [activeMode, setActiveMode] = useState('visual') // 'visual', 'html', 'preview'
  const [content, setContent] = useState(value || '')
  const quillRef = useRef(null)
  const onChangeRef = useRef(onChange)

  // Atualizar a referência do onChange sem causar re-render
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    // Só atualizar se o valor realmente mudou
    const newValue = value || ''
    if (newValue !== content) {
      setContent(newValue)
    }
  }, [value])

  // Função para notificar mudanças de conteúdo
  const notifyChange = useCallback((newContent) => {
    if (onChangeRef.current) {
      onChangeRef.current(newContent)
    }
  }, [])

  // Handler para mudanças no Quill
  const handleQuillChange = useCallback((value) => {
    setContent(value)
    notifyChange(value)
  }, [notifyChange])

  // Handler para mudanças no editor HTML
  const handleHtmlChange = useCallback((e) => {
    const newContent = e.target.value
    setContent(newContent)
    notifyChange(newContent)
  }, [notifyChange])

  // Inserir widget shortcode
  const insertWidget = useCallback((type) => {
    const shortcode = `[widget:${type}]`
    
    if (activeMode === 'visual' && quillRef.current) {
      const quill = quillRef.current.getEditor()
      const range = quill.getSelection(true)
      quill.insertText(range.index, shortcode)
      quill.setSelection(range.index + shortcode.length)
    } else if (activeMode === 'html') {
      const textarea = document.querySelector('.html-editor')
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newContent = content.substring(0, start) + shortcode + content.substring(end)
        setContent(newContent)
        notifyChange(newContent)
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + shortcode.length
          textarea.focus()
        }, 0)
      }
    }
  }, [activeMode, content, notifyChange])

  // Configuração do Quill
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'bullet', 'link', 'image',
    'blockquote', 'code-block', 'color', 'background'
  ]

  return (
    <div className="quill-rich-text-editor">
      {/* Barra de abas */}
      <div className="editor-tabs" style={{ 
        display: 'flex', 
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f8f9fa'
      }}>
        <button
          type="button"
          className={`tab-button ${activeMode === 'visual' ? 'active' : ''}`}
          onClick={() => setActiveMode('visual')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            backgroundColor: activeMode === 'visual' ? 'white' : 'transparent',
            borderBottom: activeMode === 'visual' ? '2px solid #2563eb' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Edit size={16} /> Visual
        </button>
        <button
          type="button"
          className={`tab-button ${activeMode === 'html' ? 'active' : ''}`}
          onClick={() => setActiveMode('html')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            backgroundColor: activeMode === 'html' ? 'white' : 'transparent',
            borderBottom: activeMode === 'html' ? '2px solid #2563eb' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Code size={16} /> HTML
        </button>
        <button
          type="button"
          className={`tab-button ${activeMode === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveMode('preview')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            backgroundColor: activeMode === 'preview' ? 'white' : 'transparent',
            borderBottom: activeMode === 'preview' ? '2px solid #2563eb' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Eye size={16} /> Preview
        </button>
      </div>

      {/* Toolbar de widgets */}
      <div className="widget-toolbar" style={{
        padding: '0.5rem',
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f0f9ff',
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1e40af' }}>Widgets:</span>
        <button type="button" onClick={() => insertWidget('banner')} className="widget-btn">
          Banner
        </button>
        <button type="button" onClick={() => insertWidget('contact')} className="widget-btn">
          Contato
        </button>
        <button type="button" onClick={() => insertWidget('login')} className="widget-btn">
          Login
        </button>
        <button type="button" onClick={() => insertWidget('news')} className="widget-btn">
          Notícias
        </button>
        <button type="button" onClick={() => insertWidget('image')} className="widget-btn">
          Imagem
        </button>
        <button type="button" onClick={() => insertWidget('video')} className="widget-btn">
          Vídeo
        </button>
        <button type="button" onClick={() => insertWidget('content')} className="widget-btn">
          HTML
        </button>
      </div>

      {/* Área do editor */}
      <div className="editor-content">
        {/* Modo Visual - React Quill */}
        {activeMode === 'visual' && (
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleQuillChange}
            placeholder={placeholder}
            modules={modules}
            formats={formats}
            style={{
              height: '400px',
              marginBottom: '42px' // Espaço para a toolbar do quill
            }}
          />
        )}

        {/* Modo HTML */}
        {activeMode === 'html' && (
          <textarea
            value={content}
            onChange={handleHtmlChange}
            className="html-editor"
            style={{
              width: '100%',
              minHeight: '400px',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '0 0 4px 4px',
              outline: 'none',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              resize: 'vertical'
            }}
            placeholder={placeholder}
          />
        )}

        {/* Modo Preview */}
        {activeMode === 'preview' && (
          <div className="preview-content" style={{
            minHeight: '400px',
            padding: '1rem',
            backgroundColor: '#fafafa',
            border: '1px solid #e5e7eb',
            borderRadius: '0 0 4px 4px'
          }}>
            <ContentRenderer content={content} />
          </div>
        )}
      </div>

      {/* CSS interno para os estilos dos botões */}
      <style>{`
        .widget-btn {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          background: #dbeafe;
          border: 1px solid #93c5fd;
          color: #1e40af;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .widget-btn:hover {
          background: #bfdbfe;
          border-color: #60a5fa;
        }
        
        .quill-rich-text-editor {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          overflow: hidden;
          background: white;
        }
        
        .quill-rich-text-editor .ql-container {
          border: none;
        }
        
        .quill-rich-text-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .quill-rich-text-editor .ql-editor {
          min-height: 350px;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
