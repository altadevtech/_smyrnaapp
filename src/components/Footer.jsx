import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Code, Globe, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          
          {/* Coluna 1: Sobre */}
          <div className="footer-column">
            <h3>Smyrna CMS</h3>
            <p>
              Sistema de gerenciamento de conteúdo moderno, 
              responsivo e fácil de usar. Construído com React 
              e Node.js para máxima performance.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Website">
                <Globe size={20} />
              </a>
              <a href="#" aria-label="Email">
                <Mail size={20} />
              </a>
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
              <div className="contact-item">
                <Mail size={16} />
                <span>contato@smyrna.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+55 (11) 99999-9999</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>

        </div>

        {/* Barra inferior */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>
              © {currentYear} Smyrna CMS. Todos os direitos reservados.
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
