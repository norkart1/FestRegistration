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

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# Session Security
SESSION_SECRET="your-secure-session-secret-key-here"

# Optional: Node Environment
NODE_ENV="development" # or "production"

# Optional: Server Port (defaults to 5000)
PORT="5000"
```

### Database Configuration
```bash
# Connection string format
DATABASE_URL="postgresql://[username]:[password]@[host]:[port]/[database]?[parameters]"

# Example for local development
DATABASE_URL="postgresql://postgres:password@localhost:5432/registration_db"

# Example for Neon (serverless PostgreSQL)
DATABASE_URL="postgresql://user:pass@ep-example.us-east-1.aws.neon.tech/dbname?sslmode=require"
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd registration-management-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create environment file
   cp .env.example .env
   
   # Edit environment variables
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Push database schema
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access Application**
   - Frontend: `http://localhost:5000`
   - API Base: `http://localhost:5000/api`

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

### Default Admin Accounts

| Username | Password | Role |
|----------|----------|------|
| `admin` | `123@Admin` | Primary Administrator |
| `Admin` | `673591@Navas` | Secondary Administrator |

### Admin Capabilities
- **Student Management**: View, edit, delete registrations
- **Report Generation**: Create and download detailed reports
- **Program Management**: Configure available programs
- **Analytics Dashboard**: Monitor registration statistics
- **Data Export**: PDF generation with Malayalam support

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
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes
npm run db:push --force  # Force push (data loss warning)

# Code Quality
npm run check        # TypeScript type checking
npm run lint         # Code linting (if configured)
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