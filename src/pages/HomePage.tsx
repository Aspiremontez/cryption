import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { TrendingUp, Shield, Zap, ArrowRight, Star } from 'lucide-react'

export function HomePage() {
  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Advanced Analytics',
      description: 'Real-time market data and portfolio tracking with professional-grade analytics.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure Trading',
      description: 'Bank-level security with multi-factor authentication and encrypted data storage.'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Execute trades in milliseconds with our optimized trading infrastructure.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Professional Trader',
      content: 'The analytics tools have completely transformed my trading strategy. Highly recommended!',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Crypto Investor',
      content: 'Clean interface, powerful features, and excellent customer support. Worth every penny.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      role: 'Portfolio Manager',
      content: 'The portfolio tracking features are incredibly detailed and user-friendly.',
      rating: 5
    }
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Professional Crypto Investment Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Take control of your cryptocurrency investments with our comprehensive platform. 
              Track, analyze, and optimize your portfolio with professional-grade tools.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/plans">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose Our Platform?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide the tools and insights you need to make informed investment decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 text-white w-fit">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of satisfied investors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base italic">
                  "{testimonial.content}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0 text-center">
          <CardContent className="p-12">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Start Your Crypto Journey?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join our platform today and get access to professional-grade tools, 
                real-time analytics, and expert insights.
              </p>
              <Link to="/plans">
                <Button size="lg" variant="secondary" className="text-purple-900">
                  Choose Your Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}