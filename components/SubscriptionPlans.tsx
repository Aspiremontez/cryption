import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Star, Crown, Gem } from 'lucide-react';

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

interface SubscriptionPlansProps {
  onSelectPlan: (plan: Plan) => void;
}

const plans: Plan[] = [
  {
    id: 'gold',
    name: 'Gold',
    price: 50,
    icon: <Star className="h-6 w-6" />,
    description: 'Perfect for beginners starting their crypto journey',
    color: 'from-yellow-400 to-yellow-600',
    features: [
      'Basic portfolio tracking',
      'Weekly market reports',
      'Email support',
      'Access to 5 cryptocurrencies',
      'Basic analytics dashboard',
      'Mobile app access'
    ]
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 200,
    icon: <Crown className="h-6 w-6" />,
    description: 'Advanced features for serious investors',
    color: 'from-purple-400 to-purple-600',
    popular: true,
    features: [
      'Advanced portfolio management',
      'Daily market insights',
      'Priority support',
      'Access to 20+ cryptocurrencies',
      'Advanced analytics & charts',
      'Risk assessment tools',
      'Copy trading features',
      'API access'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 500,
    icon: <Gem className="h-6 w-6" />,
    description: 'Professional-grade tools for expert traders',
    color: 'from-slate-400 to-slate-600',
    features: [
      'Professional portfolio suite',
      'Real-time market data',
      'Dedicated account manager',
      'Access to all cryptocurrencies',
      'Professional trading tools',
      'Advanced risk management',
      'Institutional-grade analytics',
      'White-label solutions',
      'Custom API endpoints',
      'Private Discord community'
    ]
  }
];

export function SubscriptionPlans({ onSelectPlan }: SubscriptionPlansProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Investment Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your crypto investment journey. All plans include our core features with varying levels of access and support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative border-2 transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'border-primary shadow-lg shadow-primary/20' : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4 text-white`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full mt-6 ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => onSelectPlan(plan)}
                >
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}