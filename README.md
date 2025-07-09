# Nexbook 📱

A modern social media platform built with Next.js, featuring real-time interactions, user authentication, and a sleek design.

## ✨ Features

- 🔐 **Authentication** - Secure user registration and login with Clerk
- 👤 **User Profiles** - Customizable profiles with cover photos and bio
- 📝 **Posts** - Create, edit, and delete posts with images
- 💬 **Comments** - Interactive comment system
- ❤️ **Likes** - Like posts and comments
- 👥 **Follow System** - Follow/unfollow users with friend requests
- 🔍 **Search** - Real-time user search functionality
- 📱 **Responsive Design** - Mobile-first responsive interface
- 🎨 **Modern UI** - Clean, Instagram-inspired design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL database
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nexbook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your database and Clerk credentials in `.env`

4. **Set up database**
   ```bash
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see your app!

## 🌐 Deployment

### Quick Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Configure Clerk**
   - Add your Vercel domain to Clerk
   - Update webhook URL to: `https://your-app.vercel.app/api/webhooks/clerk`

📖 **Detailed deployment guide**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

### Alternative Deployment Options

- **Railway**: [railway.app](https://railway.app)
- **Netlify**: [netlify.com](https://netlify.com)
- **Render**: [render.com](https://render.com)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL (PlanetScale recommended)
- **Authentication**: Clerk
- **Deployment**: Vercel
- **Image Storage**: Cloudinary (optional)

## 📁 Project Structure

```
nexbook/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── profile/        # User profiles
│   │   └── ...
│   ├── components/         # React components
│   │   ├── feed/           # Feed components
│   │   ├── leftMenu/       # Left sidebar
│   │   ├── rightMenu/      # Right sidebar
│   │   └── ...
│   └── lib/                # Utilities and database
├── prisma/                 # Database schema
├── public/                 # Static assets
└── scripts/                # Deployment scripts
```

## 🔧 Environment Variables

```bash
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
WEBHOOK_SECRET="whsec_..."

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Having issues? Check out:
- [Deployment Guide](./QUICK_DEPLOY.md)
- [Detailed Deployment](./DEPLOYMENT.md)
- [Environment Variables](./.env.example)

---

Built with ❤️ using Next.js and modern web technologies.
