# 🐘 Supabase Setup Guide (Free Forever)

## Why Supabase?
- ✅ **True free tier** (no card required)
- ✅ **500MB database** + 2GB bandwidth
- ✅ **PostgreSQL** (more powerful than MySQL)
- ✅ **Built-in auth** (bonus features)
- ✅ **Real-time subscriptions**

## Step-by-Step Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub
4. Click "New project"
5. Fill in:
   - **Project name**: `nexbook`
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait 2-3 minutes for setup

### 2. Get Connection String
1. In your project dashboard, go to "Settings" → "Database"
2. Scroll down to "Connection string"
3. Select "URI"
4. Copy the connection string
5. **Replace `[YOUR-PASSWORD]`** with your actual password

### 3. Update Your Prisma Schema
Since Supabase uses PostgreSQL, update your schema:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Changed from "mysql"
  url      = env("DATABASE_URL")
}

// Rest of your schema stays the same
model User {
  id                     String          @id
  username               String          @unique
  avatar                 String?
  cover                  String?
  // ... rest of your User model
}
```

### 4. Update Environment Variables
```bash
# In your .env file
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 5. Push Schema to Supabase
```bash
npx prisma db push
```

### 6. Test Connection
```bash
npm run dev
```

## Benefits of PostgreSQL over MySQL
- **Better JSON support**
- **More data types**
- **Better performance**
- **More SQL features**
- **Better for complex queries**

## Free Tier Limits
- **Database**: 500MB
- **Bandwidth**: 2GB/month
- **Auth users**: 50,000
- **Realtime**: 200 concurrent connections
- **Storage**: 1GB

Perfect for your Nexbook app! 🎉

## Connection String Format
```
postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
```

## Next Steps
1. ✅ Create Supabase project
2. ✅ Update Prisma schema to PostgreSQL
3. ✅ Update DATABASE_URL
4. ✅ Run `npx prisma db push`
5. ✅ Test locally
6. ✅ Deploy to Vercel with new DATABASE_URL

Your database is now ready for production! 🚀
