import React from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../contexts/SettingsContext'
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram,
  Heart,
  ArrowUp,
  Clock,
  Users,
  FileText,
  Rss
} from 'lucide-react'

const Footer = () => {
  const { settings } = useSettings()
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerStyle = {
    background: 'linear-gradient(135deg, rgb(40, 108, 93) 0%, rgb(75, 129, 162) 100%)',
    color: 'white',
    marginTop: '2rem',
    position: 'relative',
    width: '100%',
    fontFamily: 'Arial, Tahoma, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.5
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  }

  const mainStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr 1fr' : '1fr',
    gap: window.innerWidth > 768 ? '2rem' : '1.5rem',
    padding: '2rem 0 1rem'
  }

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    paddingBottom: '0.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
  }

  const linkStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontSize: '0.85rem',
    display: 'inline-block',
    marginBottom: '0.5rem'
  }

  const bottomStyle = {
    padding: '1rem 0',
    textAlign: 'left'
  }

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        
        {/* Main Footer Content */}
        <div style={mainStyle}>
          
          {/* Brand Section */}
          <div>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.4rem', fontWeight: '700', color: 'white' }}>
              {settings.siteName || 'Smyrna Wiki'}
            </h4>
            <p style={{ margin: '0 0 1rem 0', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5, fontSize: '0.85rem' }}>
              {settings.siteDescription || 'Construído com tecnologias consolidadas e boas práticas de desenvolvimento, o sistema mantém seu compromisso com performance, leveza e segurança, enquanto incorpora recursos essenciais para uma WIKI funcional e escalável.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={titleStyle}>
              <FileText size={16} />
              Links Rápidos
            </h4>
            <div style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <Link to="/" style={linkStyle}>Início</Link><br />
              <Link to="/pages" style={linkStyle}>Wiki</Link><br />
              <Link to="/blog" style={linkStyle}>Blog</Link><br />
              <Link to="/contact" style={linkStyle}>Contato</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={titleStyle}>
              <Mail size={16} />
              Contato
            </h4>
            <div>
              {settings.contactEmail && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>
                  <Mail size={14} />
                  <a href={`mailto:${settings.contactEmail}`} style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                    {settings.contactEmail}
                  </a>
                </div>
              )}
              {settings.contactPhone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>
                  <Phone size={14} />
                  <a href={`tel:${settings.contactPhone}`} style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                    {settings.contactPhone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={bottomStyle}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: '1rem',
            flexDirection: window.innerWidth > 768 ? 'row' : 'column',
            alignItems: window.innerWidth > 768 ? 'flex-start' : 'flex-start'
          }}>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>
              © {currentYear} {settings.siteName || 'Smyrna Wiki'}. Todos os direitos reservados.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                Feito com <Heart size={12} style={{ color: '#ff6b6b' }} /> Powered byFlávio Rodrigues
              </span>
              
              <button 
                onClick={scrollToTop}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: 'linear-gradient(45deg, rgb(40, 108, 93), rgb(75, 129, 162))', 
                  border: 'none', 
                  borderRadius: '50%', 
                  color: 'white', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
                }}
                title="Voltar ao topo"
              >
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
