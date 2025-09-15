# Registration Management System (RMS)

## Overview

A comprehensive full-stack registration management system designed for educational program enrollment. The system features a mobile-first responsive design with real-time analytics and reporting capabilities. Built for managing student registrations across junior and senior categories with multiple program types including stage performances and non-stage competitions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for consistent theming and responsive design
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Mobile-First Design**: Responsive layouts adapting from mobile cards to desktop tables

### Backend Architecture
- **Framework**: Express.js with TypeScript for type-safe server development
- **Database ORM**: Drizzle ORM for type-safe database operations and migrations
- **Session Management**: Express sessions with PostgreSQL session store for production
- **Authentication**: Session-based authentication with bcrypt password hashing
- **API Design**: RESTful endpoints with comprehensive error handling and request logging

### Data Storage
- **Primary Database**: PostgreSQL with Neon serverless for scalable cloud deployment
- **Schema Design**: Three main entities - users, registrations, and programs
- **Data Validation**: Zod schemas shared between frontend and backend for consistent validation
- **Migration Strategy**: Drizzle Kit for database schema migrations and version control

### Authentication & Authorization
- **Strategy**: Session-based authentication using express-session
- **Password Security**: bcrypt for password hashing with salt rounds
- **Session Storage**: PostgreSQL-backed sessions for production persistence
- **Route Protection**: Middleware-based authentication checks for protected routes

### Program Management
- **Category System**: Junior and senior student categories with distinct program offerings
- **Program Types**: Stage programs (performances) and non-stage programs (competitions)
- **Dynamic Configuration**: Admin interface for managing programs, categories, and display order
- **Legacy Support**: Backward compatibility mapping for existing program identifiers

### Reporting & Analytics
- **PDF Generation**: jsPDF with autoTable for registration certificates and reports
- **Real-time Statistics**: Live dashboard metrics for registration counts and category breakdowns
- **Search & Filtering**: Advanced search capabilities across student information and programs
- **Export Functionality**: Bulk report generation with customizable date ranges and filters

### Responsive Design Strategy
- **Mobile (< 768px)**: Card-based layout with collapsible navigation and touch-friendly controls
- **Tablet (768px - 1024px)**: Hybrid layout balancing information density with usability
- **Desktop (> 1024px)**: Full table views with comprehensive data display and advanced filtering

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: TypeScript ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **express**: Node.js web framework for API server
- **react**: Frontend UI framework with hooks

### UI Component Libraries
- **@radix-ui/***: Accessible UI primitives for forms, dialogs, and navigation
- **lucide-react**: Consistent icon library for UI elements
- **tailwindcss**: Utility-first CSS framework for responsive design

### Form & Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Zod integration for form validation
- **zod**: TypeScript-first schema validation library

### Authentication & Security
- **bcrypt**: Password hashing for secure user authentication
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store for production

### Development & Build Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety across the entire application
- **esbuild**: Fast JavaScript bundler for production builds

### PDF & Reporting
- **jspdf**: Client-side PDF generation for registration documents
- **jspdf-autotable**: Table formatting for structured PDF reports

### Additional Utilities
- **date-fns**: Date manipulation and formatting library
- **clsx**: Utility for conditional CSS class composition
- **nanoid**: Secure URL-friendly unique ID generator