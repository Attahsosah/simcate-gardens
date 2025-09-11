# 🚀 Hotel Booking App - Production Setup Guide

## 📋 Overview
This guide will help you deploy your hotel booking application to production with all necessary configurations, security measures, and best practices.

## 🗄️ 1. Database Setup

### Option A: PostgreSQL on Railway/Heroku (Recommended)
```bash
# Railway (Free tier available)
1. Go to railway.app
2. Create new project
3. Add PostgreSQL database
4. Copy connection string to your environment variables

# Heroku
1. Create Heroku account
2. Install Heroku CLI
3. Create new app: heroku create your-app-name
4. Add PostgreSQL: heroku addons:create heroku-postgresql:mini
```

### Option B: Supabase (Free tier available)
```bash
1. Go to supabase.com
2. Create new project
3. Get connection string from Settings > Database
4. Use connection string in your environment variables
```

### Database Migration
```bash
# Generate migration
npx prisma migrate dev --name production-init

# Deploy to production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## 🌐 2. Environment Variables

Create `.env.production` file:
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# File Upload (if using cloud storage)
# For AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# For Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Service (for notifications)
# For SendGrid
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"

# For Resend
RESEND_API_KEY="your-resend-api-key"
```

## 📁 3. File Storage Setup

### Option A: Cloudinary (Recommended for images)
```bash
npm install cloudinary
```

Create `lib/cloudinary.ts`:
```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

### Option B: AWS S3
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## 📧 4. Email Service Setup

### Option A: SendGrid
```bash
npm install @sendgrid/mail
```

### Option B: Resend
```bash
npm install resend
```

## 🔐 5. Security Enhancements

### Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'your-s3-bucket.s3.amazonaws.com'],
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### Add Rate Limiting
```bash
npm install express-rate-limit
```

## 🚀 6. Deployment Options

### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Option B: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option C: Netlify
```bash
# Build command
npm run build

# Publish directory
.next
```

## 🔧 7. Production Scripts

Update `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "type-check": "tsc --noEmit"
  }
}
```

## 📊 8. Monitoring & Analytics

### Add Sentry for Error Tracking
```bash
npm install @sentry/nextjs
```

### Add Google Analytics
```bash
npm install @next/third-parties
```

## 🔄 9. CI/CD Pipeline

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🧪 10. Testing Setup

### Add Testing Dependencies
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Create `jest.config.js`:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

## 📱 11. PWA Setup (Optional)

### Add PWA Dependencies
```bash
npm install next-pwa
```

### Update `next.config.js`:
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // ... other config
});
```

## 🔍 12. SEO Optimization

### Add Meta Tags Component
Create `components/MetaTags.tsx`:
```typescript
import Head from 'next/head';

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export default function MetaTags({ title, description, image, url }: MetaTagsProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}
```

## 🚨 13. Error Handling

### Create Global Error Boundary
Create `components/ErrorBoundary.tsx`:
```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 📈 14. Performance Optimization

### Add Performance Monitoring
```bash
npm install @next/bundle-analyzer
```

### Update `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... other config
});
```

## 🔒 15. Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS protection
- [ ] CSRF protection (NextAuth handles this)
- [ ] Secure headers configured
- [ ] File upload validation
- [ ] Authentication required for sensitive routes

## 🚀 16. Go Live Checklist

- [ ] Database migrated and seeded
- [ ] Environment variables configured
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Email service configured
- [ ] File storage configured
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Backup strategy implemented
- [ ] Performance tested
- [ ] Security audit completed

## 📞 17. Support & Maintenance

### Regular Tasks:
- [ ] Database backups
- [ ] Security updates
- [ ] Performance monitoring
- [ ] Error log review
- [ ] User feedback collection
- [ ] Feature updates

### Emergency Contacts:
- Database provider support
- Hosting provider support
- Domain registrar support
- Payment processor support

---

## 🎉 You're Ready for Production!

Your hotel booking application is now production-ready with:
- ✅ Secure database setup
- ✅ Environment configuration
- ✅ File storage
- ✅ Email notifications
- ✅ Security measures
- ✅ Monitoring & analytics
- ✅ CI/CD pipeline
- ✅ Error handling
- ✅ Performance optimization

Deploy with confidence! 🚀
