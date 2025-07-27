import React from 'react';
import { Button } from './ui/button';
import { TrendingUp, User, Menu } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ currentView, onViewChange, isLoggedIn, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">CryptoVault</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => onViewChange('home')}
            className={`transition-colors ${currentView === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Home
          </button>
          <button
            onClick={() => onViewChange('plans')}
            className={`transition-colors ${currentView === 'plans' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Plans
          </button>
          {isLoggedIn && (
            <button
              onClick={() => onViewChange('portfolio')}
              className={`transition-colors ${currentView === 'portfolio' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Portfolio
            </button>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={onLogin}>
              Sign In
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}