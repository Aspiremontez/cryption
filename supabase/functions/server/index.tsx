import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Enable CORS and logging
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('*', logger(console.log))

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// User registration endpoint
app.post('/make-server-7dabaff2/auth/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log(`Registration error for ${email}: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }

    // Store user profile in KV store
    await kv.set(`user_profile:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      subscription_plan: null,
      created_at: new Date().toISOString()
    })

    return c.json({ 
      message: 'User registered successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name
      }
    })
  } catch (error) {
    console.log(`Registration error: ${error}`)
    return c.json({ error: 'Registration failed' }, 500)
  }
})

// User profile endpoint
app.get('/make-server-7dabaff2/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const profile = await kv.get(`user_profile:${user.id}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    return c.json({ profile })
  } catch (error) {
    console.log(`Profile fetch error: ${error}`)
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

// Purchase subscription endpoint
app.post('/make-server-7dabaff2/subscription/purchase', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { planId, planName, price, paymentDetails } = await c.req.json()
    
    if (!planId || !planName || !price) {
      return c.json({ error: 'Plan details are required' }, 400)
    }

    // In a real application, you would process the payment here
    // For demo purposes, we'll simulate a successful payment
    
    const subscription = {
      id: `sub_${Date.now()}`,
      user_id: user.id,
      plan_id: planId,
      plan_name: planName,
      price,
      status: 'active',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    }

    // Store subscription
    await kv.set(`subscription:${user.id}`, subscription)
    
    // Update user profile with subscription
    const profile = await kv.get(`user_profile:${user.id}`)
    if (profile) {
      profile.subscription_plan = planId
      await kv.set(`user_profile:${user.id}`, profile)
    }

    return c.json({ 
      message: 'Subscription purchased successfully',
      subscription
    })
  } catch (error) {
    console.log(`Subscription purchase error: ${error}`)
    return c.json({ error: 'Purchase failed' }, 500)
  }
})

// Get user subscription
app.get('/make-server-7dabaff2/subscription/current', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const subscription = await kv.get(`subscription:${user.id}`)
    return c.json({ subscription })
  } catch (error) {
    console.log(`Subscription fetch error: ${error}`)
    return c.json({ error: 'Failed to fetch subscription' }, 500)
  }
})

// Portfolio endpoints
app.get('/make-server-7dabaff2/portfolio', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const portfolio = await kv.get(`portfolio:${user.id}`) || {
      user_id: user.id,
      total_value: 0,
      total_gain: 0,
      gain_percentage: 0,
      holdings: [],
      last_updated: new Date().toISOString()
    }

    return c.json({ portfolio })
  } catch (error) {
    console.log(`Portfolio fetch error: ${error}`)
    return c.json({ error: 'Failed to fetch portfolio' }, 500)
  }
})

app.post('/make-server-7dabaff2/portfolio/add-holding', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { symbol, name, amount, purchasePrice } = await c.req.json()
    
    if (!symbol || !name || !amount || !purchasePrice) {
      return c.json({ error: 'All holding details are required' }, 400)
    }

    let portfolio = await kv.get(`portfolio:${user.id}`) || {
      user_id: user.id,
      total_value: 0,
      total_gain: 0,
      gain_percentage: 0,
      holdings: [],
      last_updated: new Date().toISOString()
    }

    const holding = {
      id: `holding_${Date.now()}`,
      symbol: symbol.toUpperCase(),
      name,
      amount: parseFloat(amount),
      purchase_price: parseFloat(purchasePrice),
      current_price: parseFloat(purchasePrice), // In real app, this would be from API
      value: parseFloat(amount) * parseFloat(purchasePrice),
      change: 0,
      change_percentage: 0,
      added_at: new Date().toISOString()
    }

    portfolio.holdings.push(holding)
    
    // Recalculate portfolio totals
    portfolio.total_value = portfolio.holdings.reduce((sum, h) => sum + h.value, 0)
    portfolio.last_updated = new Date().toISOString()
    
    await kv.set(`portfolio:${user.id}`, portfolio)

    return c.json({ 
      message: 'Holding added successfully',
      portfolio
    })
  } catch (error) {
    console.log(`Add holding error: ${error}`)
    return c.json({ error: 'Failed to add holding' }, 500)
  }
})

// Mock crypto prices endpoint
app.get('/make-server-7dabaff2/crypto/prices', async (c) => {
  // Mock cryptocurrency prices - in real app this would come from external API
  const mockPrices = {
    BTC: { price: 43250.30, change: 1234.50, change_percentage: 2.95 },
    ETH: { price: 2650.80, change: -125.40, change_percentage: -4.52 },
    ADA: { price: 0.485, change: 0.025, change_percentage: 5.43 },
    SOL: { price: 98.75, change: 4.20, change_percentage: 4.45 },
    DOT: { price: 7.32, change: -0.15, change_percentage: -2.01 },
    LINK: { price: 15.67, change: 0.89, change_percentage: 6.02 }
  }
  
  return c.json({ prices: mockPrices })
})

// Health check endpoint
app.get('/make-server-7dabaff2/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() })
})

Deno.serve(app.fetch)