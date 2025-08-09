import React from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../contexts/SettingsContext'
import { Heart, Code, Globe, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const { settings } = useSettings()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          
          {/* Coluna 1: Sobre */}
          <div className="footer-column">
            {settings.logo ? (
              <div className="footer-logo-container">
                <img 
                  src={settings.logo} 
                  alt={settings.siteName}
                  className="footer-logo"
                />
              </div>
            ) : (
              <h3>{settings.siteName}</h3>
            )}
            <p>
              {settings.siteDescription || 'Sistema de gerenciamento de conteúdo moderno, responsivo e fácil de usar. Construído com React e Node.js para máxima performance.'}
            </p>
            <div className="footer-social">
              {settings.website && (
                <a href={settings.website} aria-label="Website" target="_blank" rel="noopener noreferrer">
                  <Globe size={20} />
                </a>
              )}
              {settings.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`} aria-label="Email">
                  <Mail size={20} />
                </a>
              )}
              {!settings.website && !settings.contactEmail && (
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontStyle: 'italic' }}>
                  Configure links sociais no perfil.
                </p>
              )}
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div className="footer-column">
            <h4>Links Rápidos</h4>
            <ul className="footer-links">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/pages">Páginas</Link></li>
              <li><Link to="/login">Área Admin</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Recursos */}
          <div className="footer-column">
            <h4>Recursos</h4>
            <ul className="footer-links">
              <li><a href="#templates">Templates</a></li>
              <li><a href="#widgets">Widgets</a></li>
              <li><a href="#responsivo">Design Responsivo</a></li>
              <li><a href="#seo">SEO Otimizado</a></li>
            </ul>
          </div>

          {/* Coluna 4: Contato */}
          <div className="footer-column">
            <h4>Contato</h4>
            <div className="footer-contact">
              {settings.contactEmail && (
                <div className="contact-item">
                  <Mail size={16} />
                  <span>{settings.contactEmail}</span>
                </div>
              )}
              {settings.contactPhone && (
                <div className="contact-item">
                  <Phone size={16} />
                  <span>{settings.contactPhone}</span>
                </div>
              )}
              {settings.contactAddress && (
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>{settings.contactAddress}</span>
                </div>
              )}
              {!settings.contactEmail && !settings.contactPhone && !settings.contactAddress && (
                <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                  Configure as informações de contato no painel administrativo.
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Barra inferior */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>
              © {currentYear} {settings.siteName}. Todos os direitos reservados.
            </p>
            <p className="footer-credit">
              Feito com <Heart size={16} className="heart" /> e <Code size={16} /> 
              para criar experiências incríveis.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
