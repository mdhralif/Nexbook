#!/bin/bash

# Pre-deployment setup script for Nexbook

echo "🚀 Nexbook Pre-deployment Setup"
echo "================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one with your environment variables."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Check database connection
echo "🗄️ Checking database connection..."
npx prisma db pull --force || echo "⚠️ Database connection failed. Please check your DATABASE_URL"

# Push schema to database
echo "📊 Pushing schema to database..."
npx prisma db push

# Test build
echo "🔨 Testing build..."
npm run build

echo "✅ Pre-deployment setup complete!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy to Vercel/Railway/Netlify"
echo "3. Configure environment variables"
echo "4. Update Clerk webhook URLs"
echo "5. Test your deployment"
