import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog'
import { TrendingUp, TrendingDown, Plus, DollarSign, Wallet, Activity } from 'lucide-react'
import { formatCurrency, formatPercentage } from '../lib/utils'
import { mockCryptoPrices } from '../lib/supabase'

interface Holding {
  id: string
  symbol: string
  name: string
  amount: number
  purchase_price: number
  current_price: number
  value: number
  change: number
  change_percentage: number
}

interface Portfolio {
  total_value: number
  total_gain: number
  gain_percentage: number
  holdings: Holding[]
}

export function PortfolioPage() {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState<Portfolio>({
    total_value: 0,
    total_gain: 0,
    gain_percentage: 0,
    holdings: []
  })
  const [isAddHoldingOpen, setIsAddHoldingOpen] = useState(false)
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    name: '',
    amount: '',
    purchasePrice: ''
  })

  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = () => {
    const stored = localStorage.getItem('crypto-portfolio')
    if (stored) {
      const data = JSON.parse(stored)
      // Update current prices with mock data
      const updatedHoldings = data.holdings.map((holding: Holding) => {
        const mockPrice = mockCryptoPrices[holding.symbol as keyof typeof mockCryptoPrices]
        if (mockPrice) {
          const current_price = mockPrice.price
          const value = holding.amount * current_price
          const change = value - (holding.amount * holding.purchase_price)
          const change_percentage = (change / (holding.amount * holding.purchase_price)) * 100
          
          return {
            ...holding,
            current_price,
            value,
            change,
            change_percentage
          }
        }
        return holding
      })

      const total_value = updatedHoldings.reduce((sum: number, h: Holding) => sum + h.value, 0)
      const total_cost = updatedHoldings.reduce((sum: number, h: Holding) => sum + (h.amount * h.purchase_price), 0)
      const total_gain = total_value - total_cost
      const gain_percentage = total_cost > 0 ? (total_gain / total_cost) * 100 : 0

      const updatedPortfolio = {
        total_value,
        total_gain,
        gain_percentage,
        holdings: updatedHoldings
      }

      setPortfolio(updatedPortfolio)
      localStorage.setItem('crypto-portfolio', JSON.stringify(updatedPortfolio))
    }
  }

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault()
    
    const mockPrice = mockCryptoPrices[newHolding.symbol.toUpperCase() as keyof typeof mockCryptoPrices]
    if (!mockPrice) {
      alert('Cryptocurrency not found. Try BTC, ETH, ADA, SOL, DOT, or LINK.')
      return
    }

    const amount = parseFloat(newHolding.amount)
    const purchasePrice = parseFloat(newHolding.purchasePrice)
    const currentPrice = mockPrice.price
    const value = amount * currentPrice
    const change = value - (amount * purchasePrice)
    const changePercentage = (change / (amount * purchasePrice)) * 100

    const holding: Holding = {
      id: Date.now().toString(),
      symbol: newHolding.symbol.toUpperCase(),
      name: newHolding.name,
      amount,
      purchase_price: purchasePrice,
      current_price: currentPrice,
      value,
      change,
      change_percentage: changePercentage
    }

    const updatedHoldings = [...portfolio.holdings, holding]
    const total_value = updatedHoldings.reduce((sum, h) => sum + h.value, 0)
    const total_cost = updatedHoldings.reduce((sum, h) => sum + (h.amount * h.purchase_price), 0)
    const total_gain = total_value - total_cost
    const gain_percentage = total_cost > 0 ? (total_gain / total_cost) * 100 : 0

    const updatedPortfolio = {
      total_value,
      total_gain,
      gain_percentage,
      holdings: updatedHoldings
    }

    setPortfolio(updatedPortfolio)
    localStorage.setItem('crypto-portfolio', JSON.stringify(updatedPortfolio))

    setIsAddHoldingOpen(false)
    setNewHolding({ symbol: '', name: '', amount: '', purchasePrice: '' })
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your portfolio</h1>
        <p className="text-muted-foreground">You need to be logged in to access portfolio features.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Overview</h1>
          <p className="text-muted-foreground">Track your cryptocurrency investments</p>
        </div>
        <Button onClick={() => setIsAddHoldingOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Holding
        </Button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolio.total_value)}</div>
            <p className="text-xs text-muted-foreground">Portfolio value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            {portfolio.total_gain >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portfolio.total_gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(portfolio.total_gain)}
            </div>
            <p className={`text-xs ${portfolio.total_gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(portfolio.gain_percentage)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolio.holdings.length}</div>
            <p className="text-xs text-muted-foreground">Different cryptocurrencies</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Holdings</CardTitle>
          <CardDescription>Detailed view of your cryptocurrency investments</CardDescription>
        </CardHeader>
        <CardContent>
          {portfolio.holdings.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No holdings yet</h3>
              <p className="text-muted-foreground mb-4">Start tracking your cryptocurrency investments</p>
              <Button onClick={() => setIsAddHoldingOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Holding
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolio.holdings.map((holding) => (
                <div key={holding.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white font-bold">
                      {holding.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-medium">{holding.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {holding.amount} {holding.symbol}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(holding.value)}</div>
                    <div className={`text-sm flex items-center ${holding.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {holding.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {formatCurrency(holding.change)} ({formatPercentage(holding.change_percentage)})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Holding Modal */}
      <Dialog open={isAddHoldingOpen} onOpenChange={setIsAddHoldingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Holding</DialogTitle>
            <DialogDescription>
              Add a cryptocurrency to your portfolio. Available: BTC, ETH, ADA, SOL, DOT, LINK
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddHolding} className="space-y-4">
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium mb-2">
                Symbol
              </label>
              <Input
                id="symbol"
                type="text"
                value={newHolding.symbol}
                onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value.toUpperCase() })}
                placeholder="BTC"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={newHolding.name}
                onChange={(e) => setNewHolding({ ...newHolding, name: e.target.value })}
                placeholder="Bitcoin"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-2">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                step="any"
                value={newHolding.amount}
                onChange={(e) => setNewHolding({ ...newHolding, amount: e.target.value })}
                placeholder="0.5"
                required
              />
            </div>

            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium mb-2">
                Purchase Price (USD)
              </label>
              <Input
                id="purchasePrice"
                type="number"
                step="any"
                value={newHolding.purchasePrice}
                onChange={(e) => setNewHolding({ ...newHolding, purchasePrice: e.target.value })}
                placeholder="40000"
                required
              />
            </div>

            <div className="flex flex-col space-y-3">
              <Button type="submit" className="w-full">
                Add Holding
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddHoldingOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}