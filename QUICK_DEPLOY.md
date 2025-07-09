# 🚀 Quick Deployment Guide for Nexbook

## Step 1: Prepare Your Database (Choose ONE)

### Option A: PlanetScale (Recommended)
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up with GitHub
3. Create new database: "nexbook"
4. Click "Connect" → "Connect with Prisma"
5. Copy the DATABASE_URL

### Option B: Railway MySQL
1. Go to [railway.app](https://railway.app)
2. Create new project → Add MySQL
3. Go to MySQL service → Variables tab
4. Copy the DATABASE_URL

## Step 2: Deploy Your Database Schema

```bash
# Run this locally first
npx prisma db push

# Or if using PlanetScale
npx prisma db push --accept-data-loss
```

## Step 3: Deploy to Vercel

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Add Environment Variables** in Vercel dashboard:
   ```
   DATABASE_URL=your_database_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   WEBHOOK_SECRET=your_webhook_secret
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

4. **Deploy** - Click "Deploy"

## Step 4: Configure Clerk for Production

1. **In Clerk Dashboard**:
   - Go to "Domains" → Add your Vercel domain
   - Go to "Webhooks" → Update endpoint URL to: `https://your-app.vercel.app/api/webhooks/clerk`
   - Enable "user.created" and "user.updated" events

2. **Test the webhook**:
   - Go to Webhooks → Click "Testing" tab
   - Send a test event

## Step 5: Test Your Deployment

1. Visit your deployed app
2. Try signing up/in
3. Test creating posts
4. Test search functionality
5. Test user profiles

## 🔧 Troubleshooting

### Build Errors
- Check Vercel build logs
- Ensure all environment variables are set
- Run `npm run build` locally to test

### Database Issues
- Verify DATABASE_URL format
- Check database permissions
- Run `npx prisma db push` to sync schema

### Authentication Issues
- Verify Clerk domain configuration
- Check webhook URL in Clerk dashboard
- Ensure all Clerk environment variables are set

## 📊 Free Tier Limits

- **Vercel**: 100GB bandwidth/month
- **PlanetScale**: 1GB storage, 1B reads/month
- **Clerk**: 10,000 monthly active users

Your app should now be live and accessible to everyone! 🎉
