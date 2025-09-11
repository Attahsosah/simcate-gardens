# 🚀 Deployment Guide for Simcate Gardens

## Database Setup

### 1. Create PostgreSQL Database

**Option A: Neon (Recommended)**
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create new project: `simcate-gardens`
4. Copy the connection string

**Option B: Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string

### 2. Environment Variables for Vercel

Add these in Vercel dashboard → Settings → Environment Variables:

```
DATABASE_URL = postgresql://username:password@host:port/database?sslmode=require
NEXTAUTH_URL = https://your-app-name.vercel.app
NEXTAUTH_SECRET = pd/7L2K4YXlwto9/UD8U+36ejNQASOBPWmmpHVuw9no=
```

### 3. Database Migration

After setting up the database, run these commands locally:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db push

# Seed the database
npm run db:seed
```

### 4. Vercel Deployment

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository: `Attahsosah/simcate-gardens`
3. Configure environment variables (see step 2)
4. Deploy!

## Troubleshooting

- **Database connection issues**: Check DATABASE_URL format
- **Migration errors**: Run `npx prisma db push` locally first
- **Build errors**: Ensure all dependencies are in package.json
