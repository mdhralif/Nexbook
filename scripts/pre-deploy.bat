@echo off
echo 🚀 Nexbook Pre-deployment Setup
echo ================================

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found. Please create one with your environment variables.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Generate Prisma client
echo 🔄 Generating Prisma client...
npx prisma generate

REM Check database connection
echo 🗄️ Checking database connection...
npx prisma db pull --force || echo ⚠️ Database connection failed. Please check your DATABASE_URL

REM Push schema to database
echo 📊 Pushing schema to database...
npx prisma db push

REM Test build
echo 🔨 Testing build...
npm run build

echo ✅ Pre-deployment setup complete!
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Deploy to Vercel/Railway/Netlify
echo 3. Configure environment variables
echo 4. Update Clerk webhook URLs
echo 5. Test your deployment

pause
