import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { CreditCard, Lock, Loader2 } from 'lucide-react'
import { formatCurrency } from '../lib/utils'

interface Plan {
  id: string
  name: string
  price: number
  description: string
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan | null
  onPaymentSuccess: () => void
}

export function PaymentModal({ isOpen, onClose, plan, onPaymentSuccess }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')

  if (!plan) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsLoading(false)
    onPaymentSuccess()
    
    // Reset form
    setCardNumber('')
    setExpiryDate('')
    setCvv('')
    setCardName('')
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Subscribe to the {plan.name} plan for {formatCurrency(plan.price)}/month
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{plan.name} Plan</h3>
                <p className="text-purple-100 text-sm">{plan.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(plan.price)}</div>
                <div className="text-purple-100 text-sm">per month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium mb-2">
              Cardholder Name
            </label>
            <Input
              id="cardName"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
              Card Number
            </label>
            <div className="relative">
              <Input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                disabled={isLoading}
                className="pl-10"
              />
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                Expiry Date
              </label>
              <Input
                id="expiryDate"
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                CVV
              </label>
              <Input
                id="cvv"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123"
                maxLength={4}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <Lock className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <div className="flex flex-col space-y-3">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Processing...' : `Pay ${formatCurrency(plan.price)}`}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}