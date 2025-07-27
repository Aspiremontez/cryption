import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { Portfolio } from './components/Portfolio';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { apiClient } from './utils/api';
import { Loader2 } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

function AppContent() {
  const { user, isLoading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserSubscription();
    }
  }, [user]);

  const loadUserSubscription = async () => {
    setIsLoadingSubscription(true);
    try {
      const response = await apiClient.getCurrentSubscription();
      if (response.subscription) {
        // Convert subscription data to plan format for display
        const planMap: Record<string, Partial<Plan>> = {
          gold: { 
            color: 'from-yellow-400 to-yellow-600',
            popular: false
          },
          elite: { 
            color: 'from-purple-400 to-purple-600',
            popular: true
          },
          platinum: { 
            color: 'from-slate-400 to-slate-600',
            popular: false
          }
        };
        
        const planDetails = planMap[response.subscription.plan_id] || {};
        setUserPlan({
          id: response.subscription.plan_id,
          name: response.subscription.plan_name,
          price: response.subscription.price,
          description: '',
          features: [],
          icon: null,
          ...planDetails
        } as Plan);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    setUserPlan(null);
    setCurrentView('home');
  };

  const handleSelectPlan = (plan: Plan) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (plan: Plan) => {
    setUserPlan(plan);
    setIsPaymentModalOpen(false);
    setCurrentView('portfolio');
  };

  const handleGetStarted = () => {
    setCurrentView('plans');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Hero onGetStarted={handleGetStarted} />;
      case 'plans':
        return <SubscriptionPlans onSelectPlan={handleSelectPlan} />;
      case 'portfolio':
        return (
          <div className="container mx-auto px-4 py-8">
            <Portfolio />
          </div>
        );
      default:
        return <Hero onGetStarted={handleGetStarted} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        isLoggedIn={!!user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      <main>
        {renderCurrentView()}
      </main>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* User Plan Status */}
      {userPlan && (
        <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${userPlan.color}`} />
            <span className="text-sm font-medium">Active: {userPlan.name} Plan</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}