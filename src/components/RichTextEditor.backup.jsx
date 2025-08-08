import React, { useState, useRef, useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Eye,
  Edit,
  FileText
} from 'lucide-react'
import ContentRenderer from './ContentRenderer'

const RichTextEditor = ({ value, onChange, placeholder = "Digite o conteúdo..." }) => {
  const [activeMode, setActiveMode] = useState('visual') // 'visual', 'html', 'preview'
  const [content, setContent] = useState(value || '')
  const editorRef = useRef(null)
  const htmlEditorRef = useRef(null)
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
  const notifyChange = (newContent) => {
    if (onChangeRef.current) {
      onChangeRef.current(newContent)
    }
  }

  // Comandos de formatação
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setContent(newContent)
      notifyChange(newContent)
    }
  }

  // Inserir link
  const insertLink = () => {
    const url = prompt('Digite a URL:')
    if (url) {
      executeCommand('createLink', url)
    }
  }

  // Inserir imagem
  const insertImage = () => {
    const url = prompt('Digite a URL da imagem:')
    if (url) {
      executeCommand('insertImage', url)
    }
  }

  // Atualizar conteúdo do editor visual
  const handleVisualChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setContent(newContent)
      notifyChange(newContent)
    }
  }

  // Atualizar conteúdo do editor HTML
  const handleHtmlChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
    notifyChange(newContent)
    if (editorRef.current) {
      editorRef.current.innerHTML = newContent
    }
  }

  // Inserir widget shortcode
  const insertWidget = (type) => {
    const shortcode = `[widget:${type}]`
    if (activeMode === 'visual' && editorRef.current) {
      executeCommand('insertHTML', shortcode)
    } else if (activeMode === 'html' && htmlEditorRef.current) {
      const textarea = htmlEditorRef.current
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

  return (
    <div className="rich-text-editor">
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

      {/* Toolbar de formatação (apenas no modo visual) */}
      {activeMode === 'visual' && (
        <div className="editor-toolbar" style={{
          padding: '0.5rem',
          borderBottom: '1px solid #ddd',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          gap: '0.25rem',
          flexWrap: 'wrap'
        }}>
          <button type="button" onClick={() => executeCommand('bold')} className="toolbar-btn">
            <Bold size={16} />
          </button>
          <button type="button" onClick={() => executeCommand('italic')} className="toolbar-btn">
            <Italic size={16} />
          </button>
          <button type="button" onClick={() => executeCommand('underline')} className="toolbar-btn">
            <Underline size={16} />
          </button>
          
          <div className="toolbar-separator" style={{ width: '1px', backgroundColor: '#ddd', margin: '0 0.25rem' }}></div>
          
          <button type="button" onClick={() => executeCommand('justifyLeft')} className="toolbar-btn">
            <AlignLeft size={16} />
          </button>
          <button type="button" onClick={() => executeCommand('justifyCenter')} className="toolbar-btn">
            <AlignCenter size={16} />
          </button>
          <button type="button" onClick={() => executeCommand('justifyRight')} className="toolbar-btn">
            <AlignRight size={16} />
          </button>
          
          <div className="toolbar-separator" style={{ width: '1px', backgroundColor: '#ddd', margin: '0 0.25rem' }}></div>
          
          <button type="button" onClick={() => executeCommand('insertUnorderedList')} className="toolbar-btn">
            <List size={16} />
          </button>
          <button type="button" onClick={() => executeCommand('insertOrderedList')} className="toolbar-btn">
            <ListOrdered size={16} />
          </button>
          
          <div className="toolbar-separator" style={{ width: '1px', backgroundColor: '#ddd', margin: '0 0.25rem' }}></div>
          
          <button type="button" onClick={insertLink} className="toolbar-btn">
            <Link size={16} />
          </button>
          <button type="button" onClick={insertImage} className="toolbar-btn">
            <Image size={16} />
          </button>
          
          <div className="toolbar-separator" style={{ width: '1px', backgroundColor: '#ddd', margin: '0 0.25rem' }}></div>
          
          <select 
            onChange={(e) => executeCommand('formatBlock', e.target.value)}
            className="toolbar-select"
            style={{ padding: '0.25rem', border: '1px solid #ddd', borderRadius: '3px' }}
          >
            <option value="">Formato</option>
            <option value="h1">Título 1</option>
            <option value="h2">Título 2</option>
            <option value="h3">Título 3</option>
            <option value="p">Parágrafo</option>
          </select>
        </div>
      )}

      {/* Toolbar de widgets (todos os modos) */}
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
      <div className="editor-content" style={{ minHeight: '400px' }}>
        {/* Modo Visual */}
        {activeMode === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={handleVisualChange}
            onBlur={handleVisualChange}
            className="visual-editor"
            style={{
              minHeight: '400px',
              padding: '1rem',
              border: 'none',
              outline: 'none',
              lineHeight: '1.6',
              fontSize: '14px'
            }}
            data-placeholder={placeholder}
          />
        )}

        {/* Modo HTML */}
        {activeMode === 'html' && (
          <textarea
            ref={htmlEditorRef}
            value={content}
            onChange={handleHtmlChange}
            className="html-editor"
            style={{
              width: '100%',
              minHeight: '400px',
              padding: '1rem',
              border: 'none',
              outline: 'none',
              fontFamily: 'monospace',
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
            border: '1px solid #e5e7eb'
          }}>
            <ContentRenderer content={content} />
          </div>
        )}
      </div>

      {/* CSS interno para os estilos dos botões */}
      <style>{`
        .toolbar-btn, .widget-btn {
          padding: 0.375rem 0.5rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .toolbar-btn:hover, .widget-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }
        
        .toolbar-btn:active, .widget-btn:active {
          background: #e5e7eb;
        }
        
        .widget-btn {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          background: #dbeafe;
          border-color: #93c5fd;
          color: #1e40af;
        }
        
        .widget-btn:hover {
          background: #bfdbfe;
          border-color: #60a5fa;
        }
        
        .visual-editor:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        .visual-editor p:first-child {
          margin-top: 0;
        }
        
        .visual-editor p:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
