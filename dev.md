# Contact Sync Hub - Developer Documentation 🚀

This document provides comprehensive technical information for developers working on or reviewing the Contact Sync Hub application. It's organized into frontend and backend sections for easy navigation.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Frontend](#frontend)
- [Backend](#backend)
- [Data Flow](#data-flow)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Deployment](#deployment)

## 🎯 Overview

Contact Sync Hub is a full-stack Next.js application that provides real-time bidirectional synchronization of contacts between multiple CRM platforms (HubSpot, Pipedrive, etc.). The application uses Integration.app as the middleware for CRM connections and MongoDB for data persistence.

**Key Technologies:**
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Styling**: Tailwind CSS, Shadcn UI, Radix UI
- **State Management**: SWR for data fetching
- **Authentication**: JWT-based auth with customer isolation
- **Integrations**: Integration.app SDK

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   External      │
│   (Next.js)     │◄──►│   (API Routes)   │◄──►│   (CRM APIs)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │    │   MongoDB        │    │   Integration   │
│   Components    │    │   Database       │    │   .app SDK      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🎨 Frontend

### Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── contacts/                # Contact management pages
│   │   ├── [contactId]/        # Individual contact details
│   │   └── components/         # Contact-specific components
│   ├── integrations/            # Integration management
│   ├── logs/                    # System logs viewer
│   └── layout.tsx              # Root layout with providers
├── components/                   # Reusable UI components
│   ├── ui/                     # Shadcn UI components
│   └── __tests__/              # Component tests
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
└── types/                       # TypeScript definitions
```

### Key Frontend Components

#### 1. **Layout & Providers** (`src/app/layout.tsx`)
- **AuthProvider**: Manages JWT authentication state
- **IntegrationProvider**: Provides integration context
- **Header**: Navigation component with auth status

#### 2. **Contact Management** (`src/app/contacts/`)
- **Contacts Table**: Displays all contacts with filtering/sorting
- **Contact Form**: Create/edit contact information
- **Contact Details**: Individual contact view with integrations
- **Sync Settings Modal**: Configure synchronization behavior

#### 3. **Integration Management** (`src/app/integrations/`)
- **Integrations List**: View connected CRM platforms
- **Platform Modal**: Connect new CRM integrations

#### 4. **UI Components** (`src/components/ui/`)
Built with Shadcn UI and Radix UI primitives:
- **Form Components**: Input, Select, Textarea with validation
- **Data Display**: Table, Badge, Card components
- **Feedback**: Alert Dialog, Toast notifications
- **Navigation**: Dialog, Modal components

### State Management

#### **SWR Integration**
The app uses SWR for data fetching with automatic caching and revalidation.

#### **Custom Hooks**
- `use-contacts.hook.ts`: Contact CRUD operations
- `use-integration-app-actions.hook.ts`: Integration management
- `use-sync-settings.hook.ts`: Synchronization configuration

### Styling & Design System

#### **Tailwind CSS Configuration**
- Custom color palette and spacing
- Dark/light theme support
- Responsive breakpoints
- Animation utilities

#### **Component Variants**
The UI components use `class-variance-authority` for component variants and styling.

## ⚙️ Backend

### Project Structure

```
src/
├── app/api/                     # Next.js API Routes
│   ├── contacts/               # Contact CRUD endpoints
│   ├── integrations/           # Integration management
│   ├── sync-settings/          # Sync configuration
│   ├── webhooks/               # Webhook handlers
│   └── auth/                   # Authentication endpoints
├── lib/                         # Backend utilities
│   ├── mongodb.ts              # Database connection
│   ├── auth.ts                 # Authentication logic
│   ├── contact.service.ts      # Contact business logic
│   └── integration-app-client.ts # Integration.app SDK client
├── models/                      # MongoDB schemas
└── types/                       # TypeScript interfaces
```

### API Endpoints

#### 1. **Contact Management** (`/api/contacts`)
```typescript
GET    /api/contacts          # List all contacts for customer
POST   /api/contacts          # Create new contact
PUT    /api/contacts          # Update existing contact
DELETE /api/contacts          # Delete contact
GET    /api/contacts/[id]     # Get specific contact
```

#### 2. **Platform Management** (`/api/platforms`)
```typescript
GET    /api/platforms/[platformType]/data    # Get platform data for integration
DELETE /api/platforms/[platformType]/[externalId]  # Delete contact from platform
```

#### 3. **Integration Token** (`/api/integration-token`)
```typescript
GET    /api/integration-token  # Generate integration token for customer
```

#### 4. **Webhook Processing** (`/api/webhooks/contacts`)
```typescript
POST   /api/webhooks/contacts # Process CRM webhooks
```

#### 5. **Authentication & User Info** (`/api/self`)
```typescript
GET    /api/self              # Current user info and authentication status
```

### Database Layer

#### **MongoDB Connection** (`src/lib/mongodb.ts`)
The application connects to MongoDB using Mongoose ODM.

#### **Data Models** (`src/models/`)
- **Contact Model**: Core contact entity with integrations
- **Sync Settings Model**: Customer-specific sync configuration

#### **Contact Schema Structure**
```typescript
interface Contact {
  id: string;                    // Unique identifier
  name: string;                  // Contact name
  email: string;                 // Primary email
  phone: string;                 // Phone number
  jobTitle: string;              // Job title
  pronouns: string;              // Preferred pronouns
  customerId: string;            // Customer isolation
  integrations: Integration[];    // CRM platform connections
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}

interface Integration {
  type: 'hubspot' | 'pipedrive'; // CRM platform type
  externalId: string;            // External CRM ID
  accountId?: string;            // Account identifier
  lastSyncedAt?: Date;           // Last sync timestamp
  externalCreatedAt?: Date;      // External creation time
  externalUpdatedAt?: Date;      // External update time
}
```

### Authentication & Security



#### **Customer Isolation**
All data operations are scoped by `customerId` to ensure multi-tenancy.

### Integration Layer

#### **Integration.app SDK Client** (`src/lib/integration-app-client.ts`)
The application uses the Integration.app SDK for CRM platform connections.

#### **Webhook Processing** (`src/app/api/webhooks/contacts/`)
The webhook system handles real-time updates from CRM platforms:

1. **Webhook Validation**: Verify webhook authenticity
2. **Event Processing**: Handle create/update/delete events
3. **Data Synchronization**: Sync changes across platforms
4. **Conflict Resolution**: Handle data conflicts between systems

## 🔄 Data Flow

### Contact Creation Flow

```
1. User creates contact in UI
   ↓
2. Frontend sends POST to /api/contacts
   ↓
3. Backend validates data and saves to MongoDB
   ↓
4. Integration service creates contact in connected CRMs
   ↓
5. Webhook handlers receive confirmation from CRMs
   ↓
6. Contact data is synchronized across all platforms
```

### Webhook Synchronization Flow

```
1. CRM platform sends webhook to /api/webhooks/contacts
   ↓
2. Webhook handler validates and processes event
   ↓
3. Contact service updates local database
   ↓
4. Integration service syncs changes to other CRMs
   ↓
5. Frontend receives real-time updates via SWR
```

### Authentication Flow

```
1. User submits credentials
   ↓
2. Backend validates and generates JWT
   ↓
3. Frontend stores JWT in secure storage
   ↓
4. All API requests include JWT in Authorization header
   ↓
5. Backend validates JWT and extracts customer context
   ↓
6. All data operations are scoped to customer
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- MongoDB instance
- Integration.app account
- Git

### Environment Configuration
```bash
# Required environment variables
MONGODB_URI=mongodb://localhost:27017/contact-sync-hub
INTEGRATION_APP_WORKSPACE_KEY=your-workspace-key
INTEGRATION_APP_WORKSPACE_SECRET=your-workspace-secret
INTEGRATION_APP_WEBHOOK_API_KEY=your-webhook-api-key
INTEGRATION_APP_WEBHOOK_URL=your-webhook-url

# Optional variables
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

### Database Setup
```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/contact-sync-hub"

# Create indexes (optional - handled by Mongoose)
db.contacts.createIndex({ "customerId": 1, "createdAt": -1 })
db.contacts.createIndex({ "integrations.type": 1, "integrations.externalId": 1 })
```

## 🧪 Testing

### Test Structure
```
src/
├── components/__tests__/       # Component tests
├── app/__tests__/             # Page tests
└── lib/__tests__/             # Utility tests
```

### Testing Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- header.test.tsx
```



## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```bash
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
INTEGRATION_APP_WORKSPACE_KEY=your-production-workspace-key
INTEGRATION_APP_WORKSPACE_SECRET=your-production-workspace-secret
INTEGRATION_APP_WEBHOOK_API_KEY=your-production-webhook-api-key
INTEGRATION_APP_WEBHOOK_URL=your-production-webhook-url
```

### Deployment Platforms

#### **Vercel (Recommended)**
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

#### **Self-Hosted**
1. Build the application: `npm run build`
2. Copy build files to server
3. Install production dependencies: `npm ci --production`
4. Start with PM2 or similar process manager

## 🔍 Troubleshooting

### Common Issues

#### **MongoDB Connection Errors**
- Verify `MONGODB_URI` environment variable
- Check MongoDB service status
- Ensure network connectivity

#### **Integration.app Connection Issues**
- Verify API key configuration
- Check webhook endpoint accessibility
- Review integration.app dashboard for errors

#### **Authentication Problems**
- Verify JWT secret configuration
- Check token expiration
- Ensure proper Authorization header format

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check specific modules
DEBUG=mongodb,integration-app npm run dev
```

### Logs
The application uses a custom logger (`src/lib/logger.ts`) for structured logging.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Integration.app SDK](https://docs.integration.app)
- [MongoDB Documentation](https://docs.mongodb.com)

---

**For additional support or questions, please refer to the main README.md or create an issue in the repository.**
