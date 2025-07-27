import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Plus, Loader2 } from 'lucide-react';
import { apiClient } from '../utils/api';

interface PortfolioData {
  user_id: string;
  total_value: number;
  total_gain: number;
  gain_percentage: number;
  holdings: {
    id: string;
    symbol: string;
    name: string;
    amount: number;
    purchase_price: number;
    current_price: number;
    value: number;
    change: number;
    change_percentage: number;
    added_at: string;
  }[];
  last_updated: string;
}

export function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingHolding, setIsAddingHolding] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    name: '',
    amount: '',
    purchasePrice: ''
  });

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const response = await apiClient.getPortfolio();
      setPortfolio(response.portfolio);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingHolding(true);

    try {
      await apiClient.addHolding(
        newHolding.symbol,
        newHolding.name,
        parseFloat(newHolding.amount),
        parseFloat(newHolding.purchasePrice)
      );
      
      setNewHolding({ symbol: '', name: '', amount: '', purchasePrice: '' });
      setIsAddModalOpen(false);
      await loadPortfolio();
    } catch (error) {
      console.error('Failed to add holding:', error);
    } finally {
      setIsAddingHolding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Failed to load portfolio data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Portfolio Overview</h2>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Holding</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddHolding} className="space-y-4">
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={newHolding.symbol}
                  onChange={(e) => setNewHolding(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  placeholder="BTC"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newHolding.name}
                  onChange={(e) => setNewHolding(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Bitcoin"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="any"
                  value={newHolding.amount}
                  onChange={(e) => setNewHolding(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="any"
                  value={newHolding.purchasePrice}
                  onChange={(e) => setNewHolding(prev => ({ ...prev, purchasePrice: e.target.value }))}
                  placeholder="45000"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isAddingHolding}>
                {isAddingHolding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Holding
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolio.total_value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Updated {new Date(portfolio.last_updated).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            {portfolio.gain_percentage >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portfolio.gain_percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${portfolio.total_gain.toLocaleString()}
            </div>
            <p className={`text-xs ${portfolio.gain_percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolio.gain_percentage >= 0 ? '+' : ''}{portfolio.gain_percentage.toFixed(2)}% from all time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolio.holdings.length}</div>
            <p className="text-xs text-muted-foreground">
              Different cryptocurrencies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.holdings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No holdings yet. Add your first investment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolio.holdings.map((holding) => (
                <div key={holding.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{holding.symbol}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{holding.name}</h4>
                      <p className="text-sm text-muted-foreground">{holding.amount.toFixed(4)} {holding.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">${holding.value.toLocaleString()}</div>
                    <div className={`text-sm flex items-center ${holding.change_percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {holding.change_percentage >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {holding.change_percentage >= 0 ? '+' : ''}{holding.change_percentage.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}