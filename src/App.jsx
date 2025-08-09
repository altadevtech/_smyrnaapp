import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import DynamicHome from './pages/DynamicHome'
import PublicPages from './pages/PublicPages'
import DynamicPublicPage from './pages/DynamicPublicPage'
import PublicBlog from './pages/PublicBlog'
import PublicPost from './pages/PublicPost'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pages from './pages/Pages'
import Posts from './pages/Posts'
import Users from './pages/Users'
import Profile from './pages/Profile'
import DynamicPageEditor from './pages/DynamicPageEditor'
import PostEditor from './pages/PostEditor'
import Templates from './pages/TemplatesSimple'
import ProtectedRoute from './components/ProtectedRoute'
import DebugComponent from './components/DebugComponent'
import QuillTest from './components/QuillTest'
import './App.css'

function App() {
  return (
    <AuthProvider>
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
              <Route path="/pages" element={<PublicPages />} />
              <Route path="/page/:slug" element={<DynamicPublicPage />} />
              <Route path="/blog" element={<PublicBlog />} />
              <Route path="/blog/:slug" element={<PublicPost />} />
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
    </AuthProvider>
  )
}

export default App
