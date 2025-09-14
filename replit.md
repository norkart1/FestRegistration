# Registration Management System

## Overview

This is a full-stack registration management system built for educational program enrollment. The system allows students to register for various junior and senior programs (stage and non-stage categories) and provides administrators with comprehensive management capabilities including dashboard analytics, student data management, and report generation.

The application features a React frontend with TypeScript, Express.js backend, PostgreSQL database with Drizzle ORM, and includes authentication, PDF generation, and public search functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Mobile Support**: Responsive design with mobile-first approach using custom hooks

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express-session with PostgreSQL store for authentication
- **API Design**: RESTful endpoints with consistent error handling and logging middleware
- **Development**: Hot reloading with Vite integration in development mode

### Database Design
- **Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Tables**: 
  - Users (admin authentication)
  - Registrations (student data with programs as array)
  - Programs (configurable program definitions)
- **Data Validation**: Zod schemas shared between frontend and backend

### Authentication & Security
- **Session-based Authentication**: Express-session with secure HTTP-only cookies
- **Password Hashing**: bcrypt for secure password storage
- **Admin Access**: Default admin user with configurable credentials
- **Route Protection**: Middleware-based authentication for protected endpoints

### Program Management System
- **Dynamic Programs**: Database-driven program configuration
- **Categories**: Junior/Senior classification with stage/non-stage types
- **Localization**: Malayalam program names with English IDs
- **Legacy Support**: Backward compatibility for existing program IDs

### PDF Generation & Reports
- **Library**: jsPDF with autoTable plugin for structured documents
- **Report Types**: Individual registration certificates and category-based reports
- **Export Features**: Browser-based PDF download functionality

### Public Features
- **Search Functionality**: Public endpoint for student lookup by name
- **Data Privacy**: Limited public data exposure (no sensitive information)
- **Responsive Interface**: Mobile-optimized public search interface

## External Dependencies

### Database Services
- **Neon**: Serverless PostgreSQL hosting with connection pooling
- **Environment**: DATABASE_URL configuration for database connectivity

### UI Component Libraries
- **Radix UI**: Accessible, unstyled component primitives for complex UI elements
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens

### Development Tools
- **Vite**: Fast development server with HMR and optimized production builds
- **Replit Integration**: Custom plugins for development environment integration
- **ESBuild**: Fast JavaScript bundler for server-side compilation

### PDF and Document Generation
- **jsPDF**: Client-side PDF generation library
- **jsPDF-AutoTable**: Table generation plugin for structured document layouts

### Form and Data Management
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation library for type-safe data handling
- **TanStack Query**: Powerful data synchronization for server state

### Session and Security
- **Express Session**: Session middleware for user authentication
- **Connect-PG-Simple**: PostgreSQL session store adapter
- **bcrypt**: Industry-standard password hashing library