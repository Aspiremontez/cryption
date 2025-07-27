import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { AuthModal } from './AuthModal'
import { Menu, X, Coins, User, LogOut } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Plans', href: '/plans' },
    ...(user ? [{ name: 'Portfolio', href: '/portfolio' }] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 p-2">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">CryptoInvest</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-colors hover:text-foreground/80 ${
                    location.pathname === item.href
                      ? 'text-foreground'
                      : 'text-foreground/60'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)}>
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block transition-colors hover:text-foreground/80 ${
                    location.pathname === item.href
                      ? 'text-foreground'
                      : 'text-foreground/60'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="pt-4 border-t border-border space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      signOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={() => {
                      setIsAuthModalOpen(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}