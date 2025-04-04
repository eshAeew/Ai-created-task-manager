# AI-Created Task Manager

A modern, full-stack task management application built with React and Express.js, featuring a clean and intuitive user interface.

## Features

- ✨ Modern React frontend with Vite
- 🎨 Beautiful UI components using shadcn/ui
- 📱 Responsive design for all devices
- ⚡ Real-time task updates
- 🔄 Efficient state management with TanStack Query
- 🎯 Type-safe development with TypeScript
- 📝 Form handling with React Hook Form + Zod validation

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Query for data fetching
- Wouter for routing
- shadcn/ui components
- Tailwind CSS for styling
- React Hook Form for form management
- Zod for schema validation

### Backend
- Express.js
- TypeScript
- Drizzle ORM
- RESTful API architecture

## Project Structure

```
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── lib/       # Utility functions and configurations
│   │   └── hooks/     # Custom React hooks
├── server/            # Backend Express.js server
│   ├── routes.ts     # API route definitions
│   └── storage.ts    # Data storage interface
└── shared/           # Shared types and schemas
    └── schema.ts     # Database and validation schemas
```

## Development Features

- 🔒 Type-safe API calls
- 📊 Efficient data caching
- 🎯 Form validation
- 🎨 Theme customization
- 📱 Mobile-first design approach

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

The application will be available at `http://localhost:5000`

## Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Modern React best practices
