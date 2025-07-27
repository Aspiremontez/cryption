import React from 'react';
import { Button } from './ui/button';
import { TrendingUp, Shield, Zap } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/20 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Professional Crypto Investment Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust CryptoVault for professional-grade crypto investment strategies. 
            Choose your plan and start building your portfolio today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={onGetStarted} className="bg-primary hover:bg-primary/90">
              Get Started Today
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 border border-border">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Safe</h3>
              <p className="text-muted-foreground text-center">
                Bank-level security with multi-layer protection for your investments.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 border border-border">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Expert Strategies</h3>
              <p className="text-muted-foreground text-center">
                Professional investment strategies designed by crypto experts.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 border border-border">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground text-center">
                Advanced analytics and real-time market data at your fingertips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}