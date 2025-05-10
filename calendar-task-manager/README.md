# Calendar Task Manager

A modern calendar-based task management application that allows users to create, edit, and organize tasks with a beautiful calendar interface. Built with Next.js, TypeScript, and Material UI.

## Features

- Monthly and weekly calendar views
- Task creation and management
- Drag and drop task organization
- Recurring tasks support
- Passwordless authentication via email

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

- The application uses Next.js App Router
- Styling is handled by Material UI
- State management uses React Context and React Query
- Authentication is implemented with NextAuth.js

## Project Structure

- `src/app/` - Next.js application routes and pages
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and shared code
- `src/types/` - TypeScript type definitions
