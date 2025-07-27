import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('crypto-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('crypto-user')
      }
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, accept any email/password
    const demoUser = {
      id: '1',
      email,
      name: email.split('@')[0]
    }
    
    setUser(demoUser)
    localStorage.setItem('crypto-user', JSON.stringify(demoUser))
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newUser = {
      id: Date.now().toString(),
      email,
      name
    }
    
    setUser(newUser)
    localStorage.setItem('crypto-user', JSON.stringify(newUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('crypto-user')
    localStorage.removeItem('crypto-subscription')
    localStorage.removeItem('crypto-portfolio')
  }

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}