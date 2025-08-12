import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import Navbar from './components/NavbarNew'
import Footer from './components/Footer'
import DynamicHome from './pages/DynamicHome'
import PublicPages from './pages/PublicPages'
import DynamicPublicPage from './pages/DynamicPublicPage'
import PublicBlog from './pages/PublicBlog'
import PublicPost from './pages/PublicPost'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pages from './pages/Pages'
import Posts from './pages/Posts'
import Categories from './pages/Categories'
import Menus from './pages/Menus'
import Users from './pages/Users'
import Profile from './pages/Profile'
import DynamicPageEditor from './pages/DynamicPageEditor'
import PostEditor from './pages/PostEditor'
import Templates from './pages/TemplatesSimple'
import ProtectedRoute from './components/ProtectedRoute'
import DebugComponent from './components/DebugComponent'
import QuillTest from './components/QuillTest'
import WikiLayout from './components/WikiLayout'
import PageVersionHistory from './pages/PageVersionHistory'
import VersionCompare from './pages/VersionCompare'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="container">
            <Routes>
              {/* Rota de Debug */}
              <Route path="/debug" element={<DebugComponent />} />
              <Route path="/quill-test" element={<QuillTest />} />
              
              {/* Rotas Públicas */}
              <Route path="/" element={<DynamicHome />} />
              
              {/* Rotas Wiki Públicas */}
              <Route path="/wiki" element={
                <WikiLayout>
                  <PublicPages />
                </WikiLayout>
              } />
              <Route path="/wiki/:slug" element={<DynamicPublicPage />} />
              <Route path="/:slug" element={<DynamicPublicPage />} />
              
              {/* Outras Rotas Públicas */}
              <Route path="/pages" element={<PublicPages />} />
              <Route path="/page/:slug" element={<DynamicPublicPage />} />
              <Route path="/blog" element={<PublicBlog />} />
              <Route path="/blog/categoria/:categorySlug" element={<PublicBlog />} />
              <Route path="/blog/:slug" element={<PublicPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<Login />} />
              
              {/* Rotas Administrativas */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/pages" 
                element={
                  <ProtectedRoute>
                    <Pages />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/pages/new" 
                element={
                  <ProtectedRoute>
                    <DynamicPageEditor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/pages/edit/:id" 
                element={
                  <ProtectedRoute>
                    <DynamicPageEditor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/pages/:id/versions" 
                element={
                  <ProtectedRoute>
                    <PageVersionHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/pages/:id/versions/:versionNumber" 
                element={
                  <ProtectedRoute>
                    <VersionCompare />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/posts" 
                element={
                  <ProtectedRoute>
                    <Posts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/posts/new" 
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/posts/edit/:id" 
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/categories" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Categories />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/menus" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Menus />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Users />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/templates" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Templates />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
