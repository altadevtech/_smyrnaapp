import React from 'react'
import { 
  FileText, 
  Eye, 
  Calendar, 
  User, 
  Tag,
  Layout,
  Lightbulb,
  Zap
} from 'lucide-react'

export const WikiEditorSidebar = ({ currentUser, isEditing }) => {
  return (
    <>
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <FileText size={16} />
          Editor de Wiki
        </div>
        <div className="sidebar-card-content">
          <div className="sidebar-item">
            <Layout className="sidebar-item-icon" />
            <div className="sidebar-item-content">
              <h4 className="sidebar-item-title">Templates Dinâmicos</h4>
              <p className="sidebar-item-text">
                Use widgets e layouts para criar páginas interativas e organizadas.
              </p>
            </div>
          </div>
          
          <div className="sidebar-item">
            <Eye className="sidebar-item-icon" />
            <div className="sidebar-item-content">
              <h4 className="sidebar-item-title">Preview em Tempo Real</h4>
              <p className="sidebar-item-text">
                Visualize suas mudanças instantaneamente antes de publicar.
              </p>
            </div>
          </div>
          
          <div className="sidebar-item">
            <Tag className="sidebar-item-icon" />
            <div className="sidebar-item-content">
              <h4 className="sidebar-item-title">Categorização</h4>
              <p className="sidebar-item-text">
                Organize seu conteúdo em categorias para melhor navegação.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <Lightbulb size={16} />
          Dicas da Wiki
        </div>
        <div className="sidebar-card-content">
          <div className="sidebar-item">
            <Zap className="sidebar-item-icon" />
            <div className="sidebar-item-content">
              <h4 className="sidebar-item-title">Rich Text Editor</h4>
              <p className="sidebar-item-text">
                Use formatação rica, links e elementos visuais para enriquecer o conteúdo.
              </p>
            </div>
          </div>
          
          <div className="sidebar-item">
            <FileText className="sidebar-item-icon" />
            <div className="sidebar-item-content">
              <h4 className="sidebar-item-title">Campo Resumo</h4>
              <p className="sidebar-item-text">
                O resumo aparece nas listagens e ajuda na busca e organização.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isEditing && currentUser && (
        <div className="sidebar-card">
          <div className="sidebar-card-header">
            <User size={16} />
            Informações
          </div>
          <div className="sidebar-card-content">
            <div className="sidebar-item">
              <User className="sidebar-item-icon" />
              <div className="sidebar-item-content">
                <h4 className="sidebar-item-title">Autor</h4>
                <p className="sidebar-item-text">{currentUser.name}</p>
              </div>
            </div>
            
            <div className="sidebar-item">
              <Calendar className="sidebar-item-icon" />
              <div className="sidebar-item-content">
                <h4 className="sidebar-item-title">Última Modificação</h4>
                <p className="sidebar-item-text">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export const PostEditorSidebar = ({ isEditing }) => {
  return (
    <>
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <FileText size={16} />
          Editor de Posts
        </div>
        <div className="sidebar-card-content">
          <div className="sidebar-item">
            <Zap className="sidebar-item-icon" />
            <div className="sidebar-item-content">
              <h4 className="sidebar-item-title">Recursos do Editor</h4>
              <p className="sidebar-item-text">
                Editor WYSIWYG com formatação rica, HTML direto e preview em tempo real.
              </p>
            </div>
          </div>
          
          <div className="sidebar-item">
            <Eye className="sidebar-item-icon" />
            <div className="sidebar-item-content">
              <h4 className="sidebar-item-title">Status de Publicação</h4>
              <p className="sidebar-item-text">
                <strong>Rascunho:</strong> Não aparece no site<br/>
                <strong>Publicado:</strong> Visível no blog
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <Lightbulb size={16} />
          Dicas Importantes
        </div>
        <div className="sidebar-card-content">
          <div className="sidebar-item">
            <FileText className="sidebar-item-icon" />
            <div className="sidebar-item-content">
              <h4 className="sidebar-item-title">Títulos Chamativos</h4>
              <p className="sidebar-item-text">
                Use títulos descritivos que capturem a atenção dos leitores.
              </p>
            </div>
          </div>
          
          <div className="sidebar-item">
            <Calendar className="sidebar-item-icon" />
            <div className="sidebar-item-content">
              <h4 className="sidebar-item-title">Ordem Cronológica</h4>
              <p className="sidebar-item-text">
                Posts são exibidos por data, do mais recente ao mais antigo.
              </p>
            </div>
          </div>
          
          <div className="sidebar-item">
            <Tag className="sidebar-item-icon" />
            <div className="sidebar-item-content">
              <h4 className="sidebar-item-title">Resumo Eficaz</h4>
              <p className="sidebar-item-text">
                O resumo aparece nas listagens. Recomendamos 100-200 caracteres.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <Zap size={16} />
          Funcionalidades
        </div>
        <div className="sidebar-card-content">
          <div className="sidebar-item">
            <FileText className="sidebar-item-icon" />
            <div className="sidebar-item-content">
              <p className="sidebar-item-text">
                • Formatação rica de texto<br/>
                • Inserção de links e imagens<br/>
                • Listas numeradas e com marcadores<br/>
                • Códigos e citações<br/>
                • HTML e widgets personalizados
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
