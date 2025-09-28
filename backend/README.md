# Aragon Backend API

A robust Node.js/Express API for the Aragon task management system with PostgreSQL, Prisma ORM, structured logging, and monitoring.

## Features

- **PostgreSQL Database** with Prisma ORM
- **Structured Logging** with Winston
- **Request Monitoring** and performance tracking
- **Rate Limiting** and security middleware
- **Error Handling** with proper HTTP status codes
- **Database Indexes** for query optimization
- **Health Check** endpoint

## Tech Stack

- Node.js with Express
- PostgreSQL database
- Prisma ORM
- Winston for logging
- Helmet for security
- Express Rate Limit

## Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/aragon_tasks?schema=public"
PORT=5001
NODE_ENV=development
LOG_LEVEL=info
```

3. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run additional migrations (indexes)
psql -d aragon_tasks -f database/migrations/001_initial_schema.sql
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get single board with statuses
- `POST /api/boards` - Create new board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/board/:boardId` - Get tasks for specific board
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Statuses
- `GET /api/statuses/board/:boardId` - Get statuses for specific board
- `POST /api/statuses` - Create new status
- `PUT /api/statuses/:id` - Update status
- `DELETE /api/statuses/:id` - Delete status

## Database Schema

The application uses a normalized schema with three main tables:

- **boards**: Store board information
- **board_statuses**: Store custom statuses for each board
- **tasks**: Store tasks with references to boards and statuses

## Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console output in development

## Monitoring

The API includes:
- Request/response logging
- Performance monitoring (slow request detection)
- Error tracking
- Health check endpoint

## Security

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes per IP)
- CORS configuration
- Input validation with express-validator

## Performance

- Database indexes for common query patterns
- Connection pooling with Prisma
- Compression middleware
- Query optimization with Prisma

## Development

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

### Logs

Logs are automatically rotated when they reach 5MB and keep 5 backup files.

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set up log rotation
4. Configure monitoring and alerting
5. Set up SSL/TLS
6. Configure reverse proxy (nginx)
