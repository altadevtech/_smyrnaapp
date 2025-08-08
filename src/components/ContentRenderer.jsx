import React, { useEffect, useRef, useState } from 'react'
import ShortcodeParser from '../utils/ShortcodeParser'

const ContentRenderer = ({ content, className = '' }) => {
  const contentRef = useRef(null)
  const [parser] = useState(() => new ShortcodeParser())
  const [parsedContent, setParsedContent] = useState('')

  useEffect(() => {
    const initializeContent = async () => {
      // Carregar widgets disponíveis
      await parser.loadWidgets()
      
      // Parse shortcodes no conteúdo
      const parsed = parser.parseShortcodes(content)
      setParsedContent(parsed)
    }

    if (content) {
      initializeContent()
    }
  }, [content, parser])

  useEffect(() => {
    // Renderizar widgets após o conteúdo ser inserido no DOM
    if (parsedContent && contentRef.current) {
      // Pequeno delay para garantir que o DOM foi atualizado
      setTimeout(() => {
        parser.renderWidgets(contentRef)
      }, 100)
    }
  }, [parsedContent, parser])

  return (
    <div 
      ref={contentRef}
      className={`content-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: parsedContent }}
    />
  )
}

export default ContentRenderer
