import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { PaymentModal } from '../components/PaymentModal'
import { AuthModal } from '../components/AuthModal'
import { Check, Crown, Gem, Star } from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  icon: React.ReactNode
  description: string
  features: string[]
  popular?: boolean
  color: string
}

export function PlansPage() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const plans: Plan[] = [
    {
      id: 'gold',
      name: 'Gold',
      price: 50,
      icon: <Star className="h-6 w-6" />,
      description: 'Perfect for beginners getting started with crypto investing',
      features: [
        'Portfolio tracking for up to 10 currencies',
        'Basic market analytics',
        'Email notifications',
        'Mobile app access',
        'Basic support'
      ],
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 200,
      icon: <Crown className="h-6 w-6" />,
      description: 'Ideal for serious investors who want advanced features',
      features: [
        'Unlimited portfolio tracking',
        'Advanced analytics & insights',
        'Real-time price alerts',
        'Priority support',
        'Custom watchlists',
        'Tax reporting tools',
        'API access'
      ],
      popular: true,
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: 500,
      icon: <Gem className="h-6 w-6" />,
      description: 'For professional traders and institutional investors',
      features: [
        'Everything in Elite',
        'Professional trading tools',
        'Advanced charting',
        'White-label solutions',
        'Dedicated account manager',
        'Custom integrations',
        'Institutional-grade security',
        '24/7 premium support'
      ],
      color: 'from-slate-400 to-slate-600'
    }
  ]

  const handleSelectPlan = (plan: Plan) => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }
    setSelectedPlan(plan)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false)
    // Store subscription in localStorage for demo
    if (selectedPlan) {
      localStorage.setItem('crypto-subscription', JSON.stringify({
        plan_id: selectedPlan.id,
        plan_name: selectedPlan.name,
        price: selectedPlan.price,
        status: 'active',
        created_at: new Date().toISOString()
      }))
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your crypto investment journey. 
          Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'ring-2 ring-purple-500 shadow-lg' : ''} hover:shadow-lg transition-shadow`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader className="text-center">
              <div className={`mx-auto mb-4 p-3 rounded-full bg-gradient-to-br ${plan.color} text-white w-fit`}>
                {plan.icon}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </div>
              <CardDescription className="text-base">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12 space-y-4">
        <p className="text-muted-foreground">
          All plans include a 30-day money-back guarantee
        </p>
        <p className="text-sm text-muted-foreground">
          Need a custom solution? <a href="#" className="text-purple-400 hover:underline">Contact our sales team</a>
        </p>
      </div>

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
    </div>
  )
}