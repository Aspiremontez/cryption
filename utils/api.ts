import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7dabaff2`;

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    } else {
      headers.Authorization = `Bearer ${publicAnonKey}`;
    }
    
    return headers;
  }

  async register(email: string, password: string, name: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  }

  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profile');
    }
    
    return response.json();
  }

  async purchaseSubscription(planId: string, planName: string, price: number, paymentDetails: any) {
    const response = await fetch(`${API_BASE_URL}/subscription/purchase`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ planId, planName, price, paymentDetails }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Purchase failed');
    }
    
    return response.json();
  }

  async getCurrentSubscription() {
    const response = await fetch(`${API_BASE_URL}/subscription/current`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch subscription');
    }
    
    return response.json();
  }

  async getPortfolio() {
    const response = await fetch(`${API_BASE_URL}/portfolio`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch portfolio');
    }
    
    return response.json();
  }

  async addHolding(symbol: string, name: string, amount: number, purchasePrice: number) {
    const response = await fetch(`${API_BASE_URL}/portfolio/add-holding`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ symbol, name, amount, purchasePrice }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add holding');
    }
    
    return response.json();
  }

  async getCryptoPrices() {
    const response = await fetch(`${API_BASE_URL}/crypto/prices`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch prices');
    }
    
    return response.json();
  }
}

export const apiClient = new ApiClient();