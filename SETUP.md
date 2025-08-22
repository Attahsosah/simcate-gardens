# Hotel Booking App Setup Guide

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
- Hotel browsing and search
- Room booking with date selection
- Booking management dashboard
- **Admin dashboard** for hotel and booking management
- Responsive design with Tailwind CSS

### 🏨 Sample Data
- 3 hotels with different locations
- 6 rooms with various amenities
- Test user account

### 🎨 UI/UX
- Modern, responsive design
- Navigation with user menu
- Booking forms with date picker
- Dashboard with booking history
- Toast notifications for feedback

## Database

The app uses SQLite for development (stored in `prisma/dev.db`). The database includes:

- **Users:** Authentication and user management
- **Hotels:** Hotel information and locations
- **Rooms:** Room details, pricing, and capacity
- **Bookings:** User reservations with dates and status
- **Amenities:** Room features and facilities

## Admin Dashboard

The admin dashboard is available at `/admin` and includes:

- **Statistics Overview:** Total hotels, bookings, and users
- **Recent Bookings:** Latest booking activity
- **Hotel Management:** View and edit hotels
- **Quick Actions:** Add hotels, manage bookings, manage users

**Access:** Only users with ADMIN role can access the admin dashboard.

## Next Steps

To continue development, consider adding:

1. **Enhanced Admin Features:**
   - Hotel/room creation and editing forms
   - Booking approval system
   - User role management
   - Analytics and reporting

2. **Enhanced Features:**
   - Search and filtering
   - Image uploads
   - Review system
   - Payment integration

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
