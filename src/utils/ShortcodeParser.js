import React from 'react'
import Widget from '../components/Widget'
import api from '../services/api'

class ShortcodeParser {
  constructor() {
    this.widgets = new Map()
  }

  // Carregar widgets disponíveis
  async loadWidgets() {
    try {
      const response = await api.get('/widgets/public')
      response.data.forEach(widget => {
        this.widgets.set(widget.id.toString(), widget)
      })
    } catch (error) {
      console.error('Erro ao carregar widgets:', error)
    }
  }

  // Parse shortcodes no conteúdo HTML
  parseShortcodes(content) {
    if (!content) return content

    // Regex para encontrar shortcodes com parâmetros: [widget:tipo param1="valor1" param2="valor2"]
    const shortcodeRegex = /\[widget:(\w+)([^\]]*)\]/g

    return content.replace(shortcodeRegex, (match, type, params) => {
      // Parse dos parâmetros
      const config = this.parseShortcodeParams(params)
      
      // Criar um placeholder único para o widget
      const widgetId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
      const placeholderId = `widget-placeholder-${widgetId}`
      
      // Armazenar dados do widget para renderização posterior
      const widgetData = {
        type,
        placeholderId,
        config
      }

      // Retornar placeholder HTML que será substituído depois
      return `<div id="${placeholderId}" data-widget="${JSON.stringify(widgetData).replace(/"/g, '&quot;')}" class="widget-placeholder"></div>`
    })
  }

  // Parse dos parâmetros do shortcode
  parseShortcodeParams(paramsString) {
    const config = {}
    
    if (!paramsString.trim()) return config

    // Regex para encontrar parâmetros: param="valor" ou param='valor'
    const paramRegex = /(\w+)=["']([^"']+)["']/g
    let match

    while ((match = paramRegex.exec(paramsString)) !== null) {
      const [, key, value] = match
      config[key] = value
    }

    return config
  }

  // Renderizar widgets nos placeholders
  renderWidgets(containerRef) {
    if (!containerRef.current) return

    const placeholders = containerRef.current.querySelectorAll('.widget-placeholder')
    
    placeholders.forEach(placeholder => {
      try {
        const widgetDataStr = placeholder.getAttribute('data-widget').replace(/&quot;/g, '"')
        const widgetData = JSON.parse(widgetDataStr)
        
        // Criar widget padrão por tipo
        const widget = {
          type: widgetData.type,
          name: `Widget ${widgetData.type}`,
          config: widgetData.config || {}
        }

        if (widget) {
          // Renderizar o widget no placeholder
          placeholder.innerHTML = ''
          placeholder.appendChild(this.createWidgetElement(widget))
        }
      } catch (error) {
        console.error('Erro ao renderizar widget:', error)
        placeholder.innerHTML = `<p style="color: red; font-style: italic;">Erro ao carregar widget ${widgetData?.type || 'desconhecido'}</p>`
      }
    })
  }

  // Criar elemento DOM para o widget (fallback simples)
  createWidgetElement(widget) {
    const div = document.createElement('div')
    div.className = 'widget-container'
    
    switch (widget.type) {
      case 'banner':
        div.innerHTML = `
          <div class="widget-banner">
            <h3>${widget.config?.title || 'Banner'}</h3>
            <p>${widget.config?.description || 'Descrição do banner'}</p>
            ${widget.config?.link ? `<a href="${widget.config.link}" class="btn btn-primary">Saiba mais</a>` : ''}
          </div>
        `
        break
      
      case 'contact':
        div.innerHTML = `
          <div class="widget-contact">
            <h3>Contato</h3>
            <form class="contact-form">
              <input type="text" placeholder="Nome" required />
              <input type="email" placeholder="Email" required />
              <textarea placeholder="Mensagem" required></textarea>
              <button type="submit" class="btn btn-primary">Enviar</button>
            </form>
          </div>
        `
        break
      
      case 'login':
        div.innerHTML = `
          <div class="widget-login">
            <h3>Acesso</h3>
            <form class="login-form">
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Senha" required />
              <button type="submit" class="btn btn-primary">Entrar</button>
            </form>
          </div>
        `
        break
      
      case 'news':
        div.innerHTML = `
          <div class="widget-news">
            <h3>Últimas Notícias</h3>
            <p>Carregando notícias...</p>
          </div>
        `
        // Aqui você pode fazer uma chamada AJAX para carregar posts
        break
      
      case 'content':
        div.innerHTML = `
          <div class="widget-content">
            ${widget.config?.content || '<p>Conteúdo do widget</p>'}
          </div>
        `
        break
      
      case 'image':
        div.innerHTML = `
          <div class="widget-image">
            ${widget.config?.title ? `<h3>${widget.config.title}</h3>` : ''}
            <img src="${widget.config?.url || widget.config?.src || '/placeholder.jpg'}" 
                 alt="${widget.config?.alt || widget.config?.title || 'Imagem'}" 
                 style="max-width: 100%; height: auto; ${widget.config?.borderRadius ? `border-radius: ${widget.config.borderRadius};` : ''}" />
            ${widget.config?.caption ? `<p class="image-caption" style="font-size: 14px; color: #666; margin-top: 8px; font-style: italic;">${widget.config.caption}</p>` : ''}
          </div>
        `
        break
      
      case 'video':
        div.innerHTML = `
          <div class="widget-video">
            <video controls style="max-width: 100%;">
              <source src="${widget.config?.src || ''}" type="video/mp4">
              Seu navegador não suporta vídeo.
            </video>
            ${widget.config?.caption ? `<p class="video-caption">${widget.config.caption}</p>` : ''}
          </div>
        `
        break
      
      default:
        div.innerHTML = `<p>Widget tipo "${widget.type}" não encontrado</p>`
    }
    
    return div
  }
}

export default ShortcodeParser
