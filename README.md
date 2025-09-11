# 🏨 Simcate Gardens Hotel Booking System

A modern, full-stack hotel booking system built with Next.js 15, featuring a comprehensive admin panel, user authentication, and a beautiful responsive design.

## ✨ Features

### 🎯 Core Functionality
- **Room Booking System** - Complete booking flow with date selection
- **User Authentication** - Secure login/signup with NextAuth
- **Admin Panel** - Comprehensive management dashboard
- **Image Management** - Upload and manage room/resort images
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### 🏠 User Features
- Browse available rooms with detailed information
- Image carousel for room galleries
- Real-time availability checking
- User dashboard for booking management
- Secure payment-ready booking system

### 👨‍💼 Admin Features
- **Room Management** - Add, edit, delete rooms with amenities
- **Facility Management** - Manage resort facilities and features
- **Content Customization** - Customize homepage content and colors
- **Image Management** - Upload and organize images
- **User Management** - View and manage user accounts
- **Booking Management** - View and manage all bookings
- **Restaurant Management** - Manage restaurant information and images

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Handling**: Next.js Image component with upload functionality
- **Date Picking**: Custom date range picker
- **Icons**: Heroicons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/simcate-gardens.git
   cd simcate-gardens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
simcate-gardens/
├── app/
│   ├── admin/                 # Admin panel pages
│   ├── api/                   # API routes
│   ├── components/            # Reusable components
│   ├── dashboard/             # User dashboard
│   ├── rooms/                 # Room pages
│   └── ...
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts               # Database seeding
│   └── migrations/           # Database migrations
├── public/                   # Static assets
└── lib/                      # Utility functions
```

## 🗄️ Database Schema

The system uses the following main entities:
- **User** - User accounts and authentication
- **Resort** - Resort information and settings
- **Room** - Room details, pricing, and availability
- **Booking** - User bookings and reservations
- **Facility** - Resort facilities and amenities
- **RoomImage** - Room gallery images
- **ResortImage** - Resort showcase images

## 🔐 Authentication

The system includes:
- **User Registration** - New user signup
- **User Login** - Secure authentication
- **Role-based Access** - Admin and regular user roles
- **Protected Routes** - Admin-only sections

### Default Admin Credentials
- **Email**: test@example.com
- **Password**: password123

## 🎨 Customization

The admin panel allows you to:
- Customize homepage content and colors
- Manage room types and amenities
- Upload and organize images
- Configure resort settings
- Manage facilities and features

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/simcate-gardens/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- Heroicons for the beautiful icon set

---

**Built with ❤️ for Simcate Gardens**