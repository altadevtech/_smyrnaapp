import React, { useState } from 'react'
import { useSettings } from '../contexts/SettingsContext'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

const Contact = () => {
  const { settings } = useSettings()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aqui você pode implementar o envio do email
    console.log('Formulário enviado:', formData)
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const pageStyle = {
    minHeight: '80vh',
    padding: '2rem 2rem',
    background: 'linear-gradient(135deg, rgb(102, 234, 205) 0%, rgb(75, 129, 162) 100%)',
    borderRadius: '15px'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem'
  }

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '1rem'
  }

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: 'white',
    maxWidth: '600px',
    margin: '0 auto'
  }

  const contentStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
    gap: '3rem',
    alignItems: 'start'
  }

  const cardStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.05)'
  }

  const formGroupStyle = {
    marginBottom: '1.5rem'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#374151'
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  }

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical'
  }

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, rgb(102, 234, 205), rgb(75, 129, 162))',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    justifyContent: 'center'
  }

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(102, 126, 234, 0.05)',
    borderRadius: '8px',
    marginBottom: '1rem'
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={{ ...titleStyle, textAlign: 'center', lineHeight: '1' }}>Em caso de dúvidas, sugestão ou reclamação sobre essa Wiki, entre em contato</h1>
          <p style={{ ...subtitleStyle, textAlign: 'center' }}>
            Estamos aqui para ajudar! Entre em contato conosco através do formulário abaixo ou use nossas informações de contato.
          </p>
        </div>

        <div style={contentStyle}>
          {/* Formulário de Contato */}
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1f2937' }}>
              Envie sua Mensagem
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Seu nome completo"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="seu@email.com"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Assunto</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Assunto da sua mensagem"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Mensagem</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={textareaStyle}
                  placeholder="Escreva sua mensagem aqui..."
                />
              </div>

              <button
                type="submit"
                style={buttonStyle}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                <Send size={18} />
                Enviar Mensagem
              </button>
            </form>
          </div>

          {/* Informações de Contato */}
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1f2937' }}>
              Informações de Contato
            </h2>

            {settings.contactEmail && (
              <div style={contactItemStyle}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, rgb(102, 234, 205), rgb(75, 129, 162))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#1f2937' }}>Email</h4>
                  <a 
                    href={`mailto:${settings.contactEmail}`}
                    style={{ color: 'rgb(83, 161, 175)', textDecoration: 'none' }}
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
            )}

            {settings.contactPhone && (
              <div style={contactItemStyle}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, rgb(102, 234, 205), rgb(75, 129, 162))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#1f2937' }}>Telefone</h4>
                  <a 
                    href={`tel:${settings.contactPhone}`}
                    style={{ color: 'rgb(83, 161, 175)', textDecoration: 'none' }}
                  >
                    {settings.contactPhone}
                  </a>
                </div>
              </div>
            )}

            {settings.contactAddress && (
              <div style={contactItemStyle}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, rgb(102, 234, 205), rgb(75, 129, 162))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#1f2937' }}>Endereço</h4>
                  <p style={{ margin: 0, color: '#6b7280' }}>{settings.contactAddress}</p>
                </div>
              </div>
            )}

            {settings.contactHours && (
              <div style={contactItemStyle}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, rgb(102, 234, 205), rgb(75, 129, 162))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#1f2937' }}>Horário de Funcionamento</h4>
                  <p style={{ margin: 0, color: '#6b7280' }}>{settings.contactHours}</p>
                </div>
              </div>
            )}

            <div style={contactItemStyle}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, rgb(102, 234, 205), rgb(75, 129, 162))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Clock size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#1f2937' }}>Horário de Atendimento</h4>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  Segunda a Sexta: 9h às 18h<br />
                  Sábado: 9h às 12h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
