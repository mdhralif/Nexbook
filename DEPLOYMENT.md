# Nexbook Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Prepare Your Project
1. Make sure your code is pushed to GitHub
2. Create a `vercel.json` file in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your Nexbook repository
5. Configure environment variables (see below)
6. Deploy!

### Step 3: Environment Variables
Add these in Vercel dashboard:
- `DATABASE_URL` - Your MySQL database connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From Clerk dashboard
- `CLERK_SECRET_KEY` - From Clerk dashboard
- `WEBHOOK_SECRET` - From Clerk webhook settings
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/`

## 🗄️ Database Options

### Option 1: PlanetScale (MySQL - Free Tier)
1. Go to [planetscale.com](https://planetscale.com)
2. Create account and new database
3. Get connection string
4. Update DATABASE_URL in Vercel

### Option 2: Railway (PostgreSQL/MySQL)
1. Go to [railway.app](https://railway.app)
2. Create MySQL database
3. Get connection string

### Option 3: Supabase (PostgreSQL)
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Get PostgreSQL connection string
4. Update Prisma schema to use PostgreSQL

## 🔐 Authentication Setup

### Update Clerk URLs
In Clerk dashboard, add your production URLs:
- Authorized redirect URLs: `https://your-app.vercel.app`
- Webhook endpoint: `https://your-app.vercel.app/api/webhooks/clerk`

## 📱 Alternative Deployment Options

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repo
3. Build command: `npm run build`
4. Publish directory: `.next`

### Railway
1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub
3. Automatically detects Next.js

### Render
1. Go to [render.com](https://render.com)
2. Connect GitHub repo
3. Select "Web Service"
4. Build command: `npm run build`
5. Start command: `npm start`

## 🛠️ Pre-deployment Checklist

- [ ] All environment variables set
- [ ] Database schema deployed
- [ ] Clerk webhooks configured
- [ ] Domain configured in Clerk
- [ ] Test authentication flow
- [ ] Test database operations
- [ ] Check for any build errors

## 📊 Free Tier Limitations

### Vercel Free Tier:
- 100GB bandwidth/month
- 1000 serverless function executions/day
- 10 deployments/day

### PlanetScale Free Tier:
- 1 database
- 1GB storage
- 1 billion row reads/month
- 10 million row writes/month

### Clerk Free Tier:
- 10,000 monthly active users
- All authentication features included
