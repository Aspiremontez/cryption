import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../utils/api';

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

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onPaymentSuccess: (plan: Plan) => void;
}

export function PaymentModal({ isOpen, onClose, plan, onPaymentSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real application, you would integrate with a payment processor like Stripe
      // For demo purposes, we'll simulate processing and call our backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await apiClient.purchaseSubscription(
        plan.id,
        plan.name,
        plan.price,
        {
          cardNumber: formData.cardNumber.slice(-4), // Only store last 4 digits
          cardholderName: formData.cardholderName,
          email: formData.email
        }
      );
      
      setIsSuccess(true);
      
      // Show success for 2 seconds then close
      setTimeout(() => {
        onPaymentSuccess(plan);
        setIsSuccess(false);
        onClose();
        setFormData({
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardholderName: '',
          email: ''
        });
      }, 2000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            You're purchasing the {plan.name} plan for ${plan.price}/month
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">Welcome to {plan.name} plan. Redirecting to your portfolio...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{plan.name} Plan</h4>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${plan.price}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  <CreditCard className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isProcessing}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${plan.price}`
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}