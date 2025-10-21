# Insight Up Solutions - Professional UAV Platform

## Overview

This is a professional UAV e-commerce platform for Insight Up Solutions, specializing in high-end UAV systems and payloads. The application serves as a Phase 1 MVP storefront focused on showcasing the Trinity Pro platform, Autel Dragonfish variants, advanced sensor payloads, GNSS equipment, and software solutions for surveying, agriculture, and public safety applications. The platform emphasizes credibility and technical expertise while providing quote requests, demo booking capabilities, and limited e-commerce functionality for accessories.

**Production URL:** insightupsolutions.com (deployed via Replit Autoscale)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18 with TypeScript**: Modern component-based architecture using functional components and hooks
- **Wouter**: Lightweight client-side routing instead of React Router for minimal bundle size
- **Tailwind CSS**: Utility-first CSS framework with custom design system based on technical/professional aesthetics
- **shadcn/ui Components**: Pre-built, accessible UI components based on Radix UI primitives
- **Vite**: Fast development build tool with Hot Module Replacement
- **React Hook Form + Zod**: Form validation and management with TypeScript-first schema validation

### Backend Architecture
- **Express.js**: Minimal REST API server with middleware for request logging and video streaming
- **TypeScript**: Full type safety across server-side code
- **Video Streaming**: Custom middleware with HTTP range request support for efficient large file delivery (82MB hero video)
- **Auto-Seeding**: Database automatically populates with all 14 products on startup if empty
- **Modular Route System**: Centralized route registration with separation of concerns
- **PostgreSQL Storage**: Production database with Drizzle ORM
- **Session Management**: Ready for user authentication and session handling

### Database Layer
- **Drizzle ORM**: Type-safe SQL query builder and migrations
- **PostgreSQL**: Production-ready relational database (via Neon serverless)
- **Schema-First Design**: Shared TypeScript schemas between client and server
- **Migration System**: Version-controlled database schema changes

### Design System
- **Professional UAV Theme**: Clean, technical design focused on credibility and trust
- **Light Mode Primary**: Professional white background with deep technical blue accents
- **Minimal Animations**: Subtle hover states and transitions to maintain technical credibility
- **Component-Based**: Reusable UI components following design guidelines
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

### Form and Validation
- **Quote Request System**: Structured forms for lead generation with validation
- **Demo Booking**: Scheduling system for test facility visits
- **Contact Information Capture**: Professional inquiry handling with email notifications
- **Type-Safe Validation**: Zod schemas ensure data integrity

### Asset Management
- **Static Asset Integration**: Video and image assets served through custom streaming middleware
- **Hero Video**: 82MB Trinity launch video with chunked streaming support (range requests)
- **Product Imagery**: High-quality payload and platform images for professional presentation
- **Brand Assets**: Logo and marketing materials with production-optimized filenames (no spaces)
- **Important**: All asset filenames use underscores/dashes (no spaces) for Express static serving compatibility

## External Dependencies

### Payment Processing
- **Stripe**: Secure payment processing for accessory e-commerce functionality
- **React Stripe.js**: Client-side integration for checkout flows

### Database Services
- **Neon**: Serverless PostgreSQL hosting with connection pooling
- **Connection Management**: WebSocket support for real-time database connections

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI patterns
- **Lucide React**: Consistent icon library for technical/professional interfaces
- **Google Fonts**: Inter font family for clean, technical typography
- **Class Variance Authority**: Type-safe component variant management

### Development and Deployment
- **Replit Integration**: Development environment with runtime error handling
- **Vercel Deployment**: Production hosting platform (configured but not active)
- **TanStack Query**: Server state management for API interactions

### Form and Data Management
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Runtime validation and TypeScript schema generation
- **Date-fns**: Date manipulation utilities for scheduling features