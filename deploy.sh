#!/bin/bash

# 🚀 Hotel Booking App - Quick Deployment Script
# This script helps you deploy your app to production

echo "🏨 Hotel Booking App - Production Deployment"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating template..."
    cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# File Upload (Optional)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Service (Optional)
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
EOF
    echo "📝 Please update .env.local with your actual values"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Check if database is configured
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Please configure your database:"
    echo "   1. Set up PostgreSQL on Railway, Heroku, or Supabase"
    echo "   2. Update DATABASE_URL in .env.local"
    echo "   3. Run: npx prisma migrate deploy"
    echo "   4. Run: npx prisma db seed"
else
    echo "🗄️  Database URL is configured"
    
    # Run database migrations
    echo "🔄 Running database migrations..."
    npx prisma migrate deploy
    
    # Seed database
    echo "🌱 Seeding database..."
    npx prisma db seed
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo ""
    echo "🎉 Your app is ready for deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Choose a hosting platform:"
    echo "      • Vercel (recommended): https://vercel.com"
    echo "      • Railway: https://railway.app"
    echo "      • Netlify: https://netlify.com"
    echo ""
    echo "   2. Set up your database:"
    echo "      • Railway PostgreSQL: https://railway.app"
    echo "      • Supabase: https://supabase.com"
    echo "      • Heroku PostgreSQL: https://heroku.com"
    echo ""
    echo "   3. Configure environment variables on your hosting platform"
    echo ""
    echo "   4. Deploy your application"
    echo ""
    echo "📚 For detailed instructions, see PRODUCTION_SETUP.md"
    
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "�� Happy deploying!"
