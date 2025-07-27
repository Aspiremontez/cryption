# CryptoInvest - Professional Crypto Investment Platform

A modern, responsive crypto investment platform built with React, TypeScript, and Tailwind CSS. Features user authentication, subscription management, and portfolio tracking.

## Features

- 🔐 User authentication (demo mode with localStorage)
- 💳 Subscription plans (Gold, Elite, Platinum)
- 📊 Portfolio tracking and analytics
- 📱 Responsive mobile-friendly design
- 🎨 Purple/black theme with modern UI
- ⚡ Fast performance with Vite

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts
- **UI Components**: Custom components with Radix UI primitives

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd crypto-investment-platform
npm install
```

### 2. Environment Setup

Create a `.env` file (optional for demo):

```bash
cp .env.example .env
```

For demo purposes, the app works without Supabase credentials.

### 3. Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables (if using Supabase)
4. Deploy - Vercel will automatically detect it's a Vite project

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Set up redirects for SPA routing:

Create `public/_redirects`:
```
/*    /index.html   200
```

### Other Platforms

The build output in `dist` is a standard SPA that can be deployed to any static hosting service.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── AuthModal.tsx   # Authentication modal
│   ├── Layout.tsx      # Main layout with navigation
│   └── PaymentModal.tsx # Payment processing modal
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── lib/               # Utilities and configurations
│   ├── supabase.ts    # Supabase client and mock data
│   └── utils.ts       # Helper functions
├── pages/             # Page components
│   ├── HomePage.tsx   # Landing page
│   ├── PlansPage.tsx  # Subscription plans
│   └── PortfolioPage.tsx # Portfolio tracking
├── App.tsx            # Main app component
├── main.tsx          # App entry point
└── globals.css       # Global styles and Tailwind
```

## Features Overview

### Authentication
- Demo authentication using localStorage
- Sign up/sign in modals
- Session persistence

### Subscription Plans
- Three tiers: Gold ($50), Elite ($200), Platinum ($500)
- Feature comparison
- Mock payment processing

### Portfolio Management
- Add cryptocurrency holdings
- Real-time value tracking (mock data)
- Gain/loss calculations
- Portfolio overview dashboard

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Responsive navigation
- Optimized for all screen sizes

## Customization

### Styling
- Edit `src/globals.css` for theme customization
- Modify CSS variables for colors
- Tailwind classes for component styling

### Mock Data
- Crypto prices in `src/lib/supabase.ts`
- Add more cryptocurrencies to `mockCryptoPrices`

### Adding Real APIs
- Replace mock data with real cryptocurrency APIs
- Integrate with Supabase for backend functionality
- Add payment processing with Stripe/PayPal

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions, please create an issue in the repository.