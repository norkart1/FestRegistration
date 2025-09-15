# Registration Management System (RMS)

A comprehensive full-stack registration management system built for educational program enrollment with mobile-first responsive design, real-time analytics, and powerful reporting capabilities.

![System Overview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Mobile Responsive](https://img.shields.io/badge/Mobile-Responsive-blue)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20Express%20%2B%20PostgreSQL-orange)

## 🖥️ Device Mockups & Responsive Design

### 📱 Mobile Layout (< 768px)
**Dashboard Features:**
- **Card-Based Student Display**: Each registration appears as an individual card with clear sections
- **Collapsible Navigation**: Hamburger menu with slide-out navigation panel
- **Touch-Friendly Actions**: Large, finger-friendly buttons for View, Edit, Print, Delete
- **Optimized Information Layout**: Student info, programs, and actions organized vertically
- **Statistics Cards**: 2-column grid layout for key metrics

**Mobile Navigation:**
- Hamburger menu (☰) in top-right corner
- Slide-out menu with full navigation options
- Touch-optimized button sizes
- Clear visual hierarchy

### 📺 Tablet Layout (768px - 1024px)
**Dashboard Features:**
- **Hybrid Layout**: Combination of cards and simplified table views
- **Enhanced Grid System**: 3-4 column layouts for statistics
- **Medium-sized Touch Targets**: Optimized for tablet interaction
- **Expanded Information Display**: More details visible without scrolling

### 🖥️ Desktop/PC Layout (> 1024px)
**Dashboard Features:**
- **Full Table View**: Complete data table with all columns visible
- **Horizontal Navigation**: Full navigation bar across the top
- **Multi-column Statistics**: 4-column grid for comprehensive overview
- **Dense Information Display**: Maximum data visibility
- **Advanced Filtering**: Enhanced search and filter capabilities

## 🚀 Features Overview

### 📊 Admin Dashboard
- **Real-time Statistics**: Live data on total registrations, categories, and daily counts
- **Advanced Search & Filtering**: Search by name, Aadhar, phone with category filters
- **Responsive Data Display**: Automatic layout adaptation for all devices
- **Bulk Operations**: Multiple selection and batch actions

### 📝 Student Registration
- **Multi-step Form**: Comprehensive registration with validation
- **Program Selection**: Dynamic program selection based on category (Junior/Senior)
- **Real-time Validation**: Instant feedback on form completion
- **Mobile-Optimized Forms**: Touch-friendly input fields and dropdowns

### 📈 Reports & Analytics
- **Malayalam Program Names**: All reports display program names in Malayalam script
- **Categorized Reports**: Separate reports for Junior and Senior categories
- **Custom Report Generation**: Filter by category, program type, and date range
- **PDF Export**: Professional PDF reports with detailed statistics
- **Program-wise Statistics**: Detailed breakdown by individual programs

### 🔐 Authentication & Security
- **Multi-Admin Support**: Multiple admin accounts with secure authentication
- **Session Management**: Secure session-based authentication
- **Password Hashing**: bcrypt-secured password storage
- **Route Protection**: Protected admin routes with middleware

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript and Vite
- **Tailwind CSS** with custom design system
- **Shadcn/UI** components for consistent design
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express.js framework
- **TypeScript** with ES modules
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** with Neon serverless driver
- **Express Session** for authentication
- **bcrypt** for password hashing

### Development Tools
- **Vite** for fast development and HMR
- **ESBuild** for server-side compilation
- **Replit Integration** with custom plugins
- **jsPDF** for client-side PDF generation

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration (REQUIRED)
DATABASE_URL="postgresql://username:password@host:port/database"

# Session Security (REQUIRED for production)
SESSION_SECRET="your-secure-random-session-secret-key-here"

# Admin User Configuration (Optional - for automated setup)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-admin-password"
ADMIN2_USERNAME="Admin" 
ADMIN2_PASSWORD="your-second-admin-password"

# Environment (Optional - defaults to development)
NODE_ENV="development" # or "production"

# Server Port (Optional - defaults to 5000)
PORT="5000"
```

### Environment Variable Details

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | None | PostgreSQL connection string |
| `SESSION_SECRET` | ⚠️ Production | Generated | Secure session encryption key |
| `ADMIN_USERNAME` | ❌ No | "admin" | Primary admin username |
| `ADMIN_PASSWORD` | ❌ No | "123@Admin" | Primary admin password |
| `ADMIN2_USERNAME` | ❌ No | None | Secondary admin username |
| `ADMIN2_PASSWORD` | ❌ No | None | Secondary admin password |
| `NODE_ENV` | ❌ No | "development" | Application environment |
| `PORT` | ❌ No | "5000" | Server port number |

### Database Configuration Examples

```bash
# Neon Serverless PostgreSQL (Recommended)
DATABASE_URL="postgresql://user:pass@ep-example.us-east-1.aws.neon.tech/dbname?sslmode=require"

# Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/registration_db"

# Railway PostgreSQL
DATABASE_URL="postgresql://postgres:pass@containers-us-west-xx.railway.app:xxxx/railway"

# Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres"
```

### Security Configuration

```bash
# Generate secure session secret (recommended)
SESSION_SECRET="$(openssl rand -base64 32)"

# Or use a secure random string
SESSION_SECRET="your-very-long-random-string-at-least-32-characters"
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- npm or yarn package manager

### Quick Start (5 minutes)

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd registration-management-system
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Create environment file
   cp .env.example .env

   # Set required variables (minimum)
   echo "DATABASE_URL=your_postgresql_connection_string" >> .env
   echo "SESSION_SECRET=$(openssl rand -base64 32)" >> .env
   ```

3. **Database Setup**
   ```bash
   # Create tables and seed data
   npm run db:push
   ```

4. **Start Application**
   ```bash
   npm run dev
   ```

5. **Login**
   - URL: `http://localhost:5000`
   - Use configured admin credentials

### Detailed Installation Steps

1. **Database Provisioning**
   
   **Option A: Neon (Recommended)**
   ```bash
   # 1. Sign up at https://neon.tech
   # 2. Create a new project
   # 3. Copy the connection string
   DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
   ```

   **Option B: Local PostgreSQL**
   ```bash
   # Install PostgreSQL locally
   createdb registration_db
   DATABASE_URL="postgresql://postgres:password@localhost:5432/registration_db"
   ```

2. **Environment Configuration**
   ```bash
   # Required for production
   SESSION_SECRET="your-secure-session-secret"
   
   # Optional admin setup
   ADMIN_USERNAME="your-admin-username"
   ADMIN_PASSWORD="your-secure-password"
   
   # Optional secondary admin
   ADMIN2_USERNAME="secondary-admin"
   ADMIN2_PASSWORD="another-secure-password"
   ```

3. **Database Schema Creation**
   ```bash
   # Push schema to database
   npm run db:push
   
   # If you get conflicts, force push
   npm run db:push --force
   ```

4. **Verify Installation**
   ```bash
   # Check database connection
   npm run check
   
   # Start development server
   npm run dev
   
   # Open browser to http://localhost:5000
   ```

### Production Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm run start
   ```

## 👥 Admin Access

### Admin Account Configuration

| Type | Configuration | Notes |
|------|---------------|-------|
| Primary Admin | Set via `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars | Configurable admin account |
| Secondary Admin | Set via `ADMIN2_USERNAME`/`ADMIN2_PASSWORD` env vars | Optional additional admin |
| Development | Default credentials created if no env vars set | Change for production use |

### Production Admin Setup

```bash
# Method 1: Environment Variables
ADMIN_USERNAME="your-admin"
ADMIN_PASSWORD="secure-password-here"

# Method 2: Manual Database Creation (Recommended for Production)
# In production, disable auto-creation and create admin users manually
NODE_ENV="production"
# Then use database tools to create admin users with bcrypt-hashed passwords
```

### Admin Login Process

1. **Navigate to Application**
   ```
   http://localhost:5000
   ```

2. **Enter Credentials**
   - Use configured admin username/password
   - Credentials are set via environment variables

3. **Access Admin Features**
   - Dashboard with real-time statistics
   - Student registration management
   - Report generation and export
   - Program configuration

### Admin Capabilities
- **Student Management**: View, edit, delete registrations with mobile-responsive interface
- **Report Generation**: Create and download detailed PDF reports with Malayalam program names
- **Program Management**: Configure available programs by category and type
- **Analytics Dashboard**: Monitor registration statistics and trends
- **Data Export**: Professional PDF generation with categorized reports
- **Search & Filter**: Advanced filtering by category, program type, and date ranges

## 📱 Mobile-First Design Principles

### Responsive Breakpoints
- **Mobile**: `< 768px` - Card-based layout, hamburger navigation
- **Tablet**: `768px - 1024px` - Hybrid layout, condensed table views
- **Desktop**: `> 1024px` - Full table layout, horizontal navigation

### Touch Optimization
- **Button Sizes**: Minimum 44px touch targets
- **Spacing**: Adequate spacing between interactive elements
- **Gestures**: Swipe-friendly interfaces where applicable
- **Feedback**: Visual feedback for all interactions

### Performance Optimization
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Splitting**: Code splitting for faster initial load
- **Caching**: Efficient API response caching

## 📊 Database Schema

### Core Tables
- **Users**: Admin authentication and roles
- **Registrations**: Student registration data
- **Programs**: Available programs with Malayalam names

### Key Features
- **Type Safety**: Full TypeScript integration with Drizzle ORM
- **Migrations**: Automatic schema synchronization
- **Relationships**: Proper foreign key constraints
- **Indexing**: Optimized queries for performance

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production (frontend + backend)
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes to database
npm run db:push --force  # Force push (WARNING: may cause data loss)

# Code Quality
npm run check        # TypeScript type checking

# Troubleshooting
npm run clean        # Clean build artifacts (if available)
npm install          # Reinstall dependencies
```

### Common Development Tasks

```bash
# Reset database (development only)
npm run db:push --force

# View database schema
# Use your database tool or Neon dashboard

# Check application logs
# Logs appear in terminal when running npm run dev

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Registrations
- `GET /api/registrations` - List registrations (with filters)
- `POST /api/registrations` - Create registration
- `PUT /api/registrations/:id` - Update registration
- `DELETE /api/registrations/:id` - Delete registration

### Reports
- `GET /api/statistics` - Get dashboard statistics
- `GET /api/registrations/export` - Export data for reports

### Programs
- `GET /api/programs` - List available programs
- `POST /api/programs` - Create program (admin)
- `PUT /api/programs/:id` - Update program (admin)

## 🌐 Browser Support

### Supported Browsers
- **Chrome/Chromium**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Mobile Browsers
- **iOS Safari**: 14+
- **Chrome Mobile**: 90+
- **Samsung Internet**: 14+
- **Firefox Mobile**: 88+

## 🔒 Security Features

### Authentication Security
- **Session-based Authentication**: Secure server-side sessions
- **Password Hashing**: bcrypt with salt rounds
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Cookies**: HTTP-only, secure cookie configuration

### Data Protection
- **Input Validation**: Comprehensive form validation
- **SQL Injection Prevention**: Parameterized queries via ORM
- **XSS Protection**: Content Security Policy headers
- **Rate Limiting**: API endpoint protection

## 📞 Support & Maintenance

### Logs & Monitoring
- **Application Logs**: Structured logging with timestamps
- **Error Tracking**: Comprehensive error handling
- **Performance Monitoring**: Query performance tracking
- **Session Monitoring**: Authentication audit trails

### Backup & Recovery
- **Database Backups**: Regular automated backups
- **File System Backups**: Static asset preservation
- **Recovery Procedures**: Documented recovery processes
- **Data Migration**: Safe schema evolution procedures

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ for educational program management**

*For technical support or feature requests, please contact the development team.*