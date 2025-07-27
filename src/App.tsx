import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { PlansPage } from './pages/PlansPage'
import { PortfolioPage } from './pages/PortfolioPage'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Routes>
        </Layout>
      </div>
    </AuthProvider>
  )
}