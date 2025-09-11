# Simcate Gardens Booking App Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Test Account

The seed script creates a test account with admin privileges:
- **Email:** test@example.com
- **Password:** password123
- **Role:** ADMIN (can access admin dashboard)

## Features Implemented

### ✅ Core Features
- User authentication (NextAuth.js)
- Resort information and facilities
- Room booking with date selection
- Booking management dashboard
- **Admin dashboard** for resort and booking management
- Responsive design with Tailwind CSS

### 🏨 Sample Data
- Simcate Gardens with facilities (pool, restaurant, spa, gym)
- 5 room types (Standard, Deluxe, Suite, Villa, Family)
- Test user account with admin privileges

### 🎨 UI/UX
- Modern, responsive design
- Navigation with user menu
- Booking forms with date picker
- Dashboard with booking history
- Toast notifications for feedback

## Database

The app uses SQLite for development (stored in `prisma/dev.db`). The database includes:

- **Users:** Authentication and user management
- **Resort:** Single resort with facilities and information
- **Rooms:** Room details, pricing, and capacity
- **Bookings:** User reservations with dates and status
- **Facilities:** Resort facilities (pool, restaurant, spa, gym)
- **Facility Bookings:** Facility reservations

## Admin Dashboard

The admin dashboard is available at `/admin` and includes:

- **Statistics Overview:** Resort status, bookings, and users
- **Recent Bookings:** Latest booking activity
- **Resort Management:** View and edit resort information
- **Room Management:** View and edit room details
- **Quick Actions:** Add rooms, manage bookings, manage users

**Access:** Only users with ADMIN role can access the admin dashboard.

## Next Steps

To continue development, consider adding:

1. **Enhanced Admin Features:**
   - Resort information editing forms
   - Room creation and editing forms
   - Facility booking management
   - Booking approval system
   - User role management
   - Analytics and reporting

2. **Enhanced Features:**
   - Facility booking system
   - Image uploads for resort and rooms
   - Review system
   - Payment integration
   - Special requests handling

3. **Production Setup:**
   - PostgreSQL database
   - Environment variables
   - OAuth providers (Google, etc.)

## Development Commands

```bash
# Database
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database
npm run db:studio      # Open Prisma Studio

# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
```
