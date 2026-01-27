# Calegari Essência - Luxury Perfume E-commerce

## Overview

This is a luxury perfume e-commerce platform called "Calegari Essência" built for a Brazilian independent perfume reseller. The application serves as a product catalog with WhatsApp-based ordering, lead capture functionality, and a blog for content marketing. The platform emphasizes elegant dark-themed design with gold accents to convey luxury branding.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom dark theme and CSS variables
- **UI Components**: shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with React plugin

The frontend follows a page-based architecture with reusable components. Key pages include:
- Home (Hero, About, Product listing)
- Product Details
- Cart (Viewed Products / Interests)
- Blog and Blog Post
- Admin panel for product/blog management

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful JSON API under `/api/*` routes
- **Development**: Vite dev server with HMR for frontend, tsx for server hot-reload

The server handles:
- Product CRUD operations
- Lead registration and authentication (phone-based)
- Blog post management
- Viewed products tracking per lead

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's table definitions
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Migrations**: Drizzle Kit for database migrations (`drizzle-kit push`)

Current data models:
- Products (name, brand, price, image, category, notes, stock, promotions)
- Leads (name, phone, created timestamp)
- Viewed Products (lead-product relationship)
- Blog Posts (title, excerpt, content, image, optional product link)
- Users (for admin authentication)

### Storage Implementation
The application uses an in-memory storage implementation (`MemStorage`) with seeded demo data. This is designed to be replaced with PostgreSQL database storage when the database is provisioned. The `IStorage` interface defines the contract for data operations.

### Build Process
- Development: `npm run dev` runs tsx for server with Vite middleware
- Production: Custom build script bundles server with esbuild (bundling common deps) and client with Vite
- Output: Server bundle at `dist/index.cjs`, static files at `dist/public`

## External Dependencies

### Database
- PostgreSQL (via `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe database operations
- connect-pg-simple for session storage (configured but may use memorystore in development)

### Third-Party Services
- **WhatsApp Integration**: Direct links to WhatsApp for ordering (no API integration, uses `wa.me` URLs)
- **Google Fonts**: Playfair Display (serif) and Inter (sans-serif) for typography

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `wouter`: Client-side routing
- `date-fns`: Date formatting with Portuguese locale
- `zod`: Runtime schema validation
- `drizzle-orm` / `drizzle-zod`: Database ORM and schema validation
- Full shadcn/ui component suite via Radix UI primitives

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal`: Error overlay in development
- `@replit/vite-plugin-cartographer`: Replit integration
- `@replit/vite-plugin-dev-banner`: Development banner