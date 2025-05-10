# Technical Requirements

## 1. Project Setup & Tooling
- Package manager: npm
- Bootstrapping: Next.js (with TypeScript)
- TypeScript: Yes
- Code formatting/linting: Prettier + ESLint
- Testing frameworks: Jest, React Testing Library, Cypress

## 2. UI & Styling
- CSS methodology: CSS Modules (default in Next.js)
- Component library: Material UI (MUI)
- Responsiveness & accessibility: Standard best practices

## 3. State Management
- Local: React hooks
- Global: React Context
- Server: React Query

## 4. Data Fetching & Backend Integration
- Data fetching: fetch API + React Query
- API type: REST
- API location: Next.js internal API routes (/pages/api)
- Authentication: NextAuth.js (passwordless, magic link via email)

## 5. Routing
- Next.js file-based routing
- Navigation with next/link
- No protected pages or special routing

## 6. Build, Deployment & Hosting
- Local development
- Docker containerization for easy future deployment
- Environment variables via .env.local, etc.
- Standard Next.js build process

## 7. Performance & Optimization
- Next.js built-in code splitting
- Next.js built-in image optimization (next/image)
- React Query for API data caching

## 8. Internationalization (i18n)
- English only (no i18n setup required)

## 9. Other Integrations
- None for now

## 10. Development Workflow
- Version control and work tracking managed separately
- Documentation requirements:
  - README.md with instructions for running the project locally (including Docker)
  - technical-requirements.md with the above technical requirements
  - product-requirements.md with the product requirements 