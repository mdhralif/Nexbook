# 🗄️ Database Setup Guide for Vercel Deployment

## Why You Need an External Database

Vercel is a **frontend hosting platform** that doesn't provide databases. Your Next.js app runs on Vercel's serverless functions, but the database needs to be hosted elsewhere.

## 🔄 How It Works

```
User Request → Vercel (Your App) → External Database → Response
```

1. **User visits your app** on Vercel
2. **Vercel runs your Next.js app** (frontend + API routes)
3. **Your app connects to external database** using connection string
4. **Database returns data** to your app
5. **Vercel serves the result** to the user

## 🎯 Best Database Options

### 1. PlanetScale (MySQL) - ⭐ RECOMMENDED

**Why it's perfect for Vercel:**
- Built for serverless environments
- Automatic connection pooling (handles many connections)
- No cold start issues
- Branch-based development like Git

**Setup:**
```bash
# 1. Create account at planetscale.com
# 2. Create database: "nexbook"
# 3. Go to Settings → Passwords → Create password
# 4. Copy connection string
```

**Connection String Format:**
```
mysql://username:password@host/database?sslaccept=strict
```

**Free Tier:**
- 1GB storage
- 1 billion row reads/month
- 10 million row writes/month
- Perfect for small to medium apps

### 2. Supabase (PostgreSQL)

**Why it's good:**
- PostgreSQL (more features than MySQL)
- Built-in real-time subscriptions
- Built-in authentication (can complement Clerk)
- Generous free tier

**Setup:**
```bash
# 1. Go to supabase.com → Create project
# 2. Go to Settings → Database → Connection string
# 3. Update your Prisma schema to use PostgreSQL
```

**Schema Change Required:**
```prisma
// Change in prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Change from "mysql"
  url      = env("DATABASE_URL")
}
```

**Free Tier:**
- 500MB database
- 2GB bandwidth
- Real-time subscriptions included

### 3. Railway

**Why it's simple:**
- One-click database deployment
- Automatic backups
- Both MySQL and PostgreSQL available

**Setup:**
```bash
# 1. Go to railway.app → Create project
# 2. Add MySQL service
# 3. Go to Variables tab → Copy DATABASE_URL
```

**Free Tier:**
- $5 credit/month
- Usually enough for small apps

### 4. Neon (PostgreSQL)

**Why it's serverless-friendly:**
- True serverless PostgreSQL
- Automatic scaling
- Database branching

**Setup:**
```bash
# 1. Go to neon.tech → Create project
# 2. Copy connection string
# 3. Update Prisma schema to PostgreSQL
```

## 🔧 Environment Variables in Vercel

After choosing your database, add these to Vercel:

```bash
# In Vercel Dashboard → Settings → Environment Variables
DATABASE_URL="your_database_connection_string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
WEBHOOK_SECRET="whsec_..."
```

## 🚀 Deployment Process

1. **Set up database** (choose from above)
2. **Push schema to database:**
   ```bash
   npx prisma db push
   ```
3. **Deploy to Vercel** with environment variables
4. **Your app is live!**

## 📊 Connection Pooling

**Problem:** Serverless functions can create many database connections
**Solution:** Use databases with built-in connection pooling:

- ✅ **PlanetScale**: Automatic connection pooling
- ✅ **Supabase**: Built-in connection pooling
- ✅ **Neon**: Automatic connection pooling
- ⚠️ **Railway**: Add connection pooling manually

## 🔍 Troubleshooting

### "Too many connections" error
- Use PlanetScale or Supabase (they handle this automatically)
- Or add connection pooling to your DATABASE_URL

### Slow queries
- Check your database location (choose same region as Vercel)
- Add database indexes for frequently queried fields
- Consider upgrading to paid tier for better performance

### Connection timeouts
- Increase timeout in Prisma client:
```javascript
// lib/client.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error'],
});
```

## 💡 Pro Tips

1. **Choose PlanetScale** for MySQL (easiest setup)
2. **Choose Supabase** for PostgreSQL + extra features
3. **Test locally** before deploying
4. **Monitor database usage** in your provider's dashboard
5. **Set up alerts** for when you approach limits

## 📈 Scaling

As your app grows:
- **Free tier** → **Paid tier** of same provider
- **Single database** → **Read replicas** for better performance
- **Connection pooling** → **Advanced connection management**

Your database will seamlessly work with Vercel's serverless environment! 🎉
