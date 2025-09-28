# Aragon.ai - Task Management System

A full-stack task management application built with React, Node.js, Express, and PostgreSQL featuring dynamic statuses, drag-and-drop functionality, and a modern dark theme.

## Features

- **CRUD Operations**: Create, read, update, and delete boards and tasks
- **Dynamic Status Management**: Add, edit, and delete custom task statuses/columns
- **Drag & Drop**: Intuitive drag-and-drop task management with react-beautiful-dnd
- **Form Validations**: Frontend and backend form validations
- **State Management**: React hooks for state management
- **Interactive Elements**: Hover states and smooth transitions
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark theme with purple/blue/green accents
- **Priority System**: Set task priorities (Low, Medium, High)
- **Board Management**: Edit board columns and delete boards with confirmation

## Tech Stack

- **Frontend**: React.js with custom components, react-beautiful-dnd
- **Backend**: Node.js with Express, Prisma ORM
- **Database**: PostgreSQL with dynamic status management
- **API**: RESTful API with proper error handling, validation, and logging
- **Security**: Helmet, CORS, rate limiting
- **Monitoring**: Winston logging, performance monitoring

## Project Structure

```
Aragon/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── logger.js
│   ├── middleware/
│   │   └── monitoring.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── routes/
│   │   ├── boards.js
│   │   ├── tasks.js
│   │   └── statuses.js
│   ├── logs/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BoardList.js
│   │   │   ├── BoardItem.js
│   │   │   ├── TaskBoard.js
│   │   │   ├── TaskColumn.js
│   │   │   ├── TaskItem.js
│   │   │   └── TaskForm.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE aragon_tasks;
```

2. Update the database connection string in `backend/config/database.js`:
```javascript
const DATABASE_URL = "postgresql://username:password@localhost:5432/aragon_tasks";
```

3. Generate Prisma client and push schema:
```bash
cd backend
npx prisma generate
npx prisma db push
```

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start both backend and frontend servers:
```bash
npm run dev
```

Or start them separately:

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Health Check: http://localhost:5001/health

## API Endpoints

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get single board
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

## Usage

1. **Create a Board**: Click "New Board" in the sidebar to create a new task board
2. **Add Tasks**: Select a board and click "Add Task" to create new tasks
3. **Manage Columns**: Use the three-dots menu (⋯) → "Edit Board" to add/remove columns
4. **Drag & Drop**: Drag tasks between columns to change their status
5. **Edit Tasks**: Click on tasks to edit them or use the status dropdown
6. **Delete Board**: Use the three-dots menu → "Delete Board" with confirmation

## Features Implemented

✅ **Core Requirements**
- CRUD operations for boards and tasks
- Form validations
- State management with React hooks
- Interactive hover states
- Responsive design
- Custom React components
- Backend API integration
- Well-structured database design

✅ **Advanced Features**
- Dynamic status/column management
- Drag and drop functionality
- Dark theme with modern UI
- Board management (edit columns, delete boards)
- Task priority system
- Error handling and loading states
- Confirmation dialogs for destructive actions

## Database Schema

The application uses Prisma ORM with PostgreSQL and a dynamic status system:

### Models
- **Board**: Store board information with title, description, and timestamps
- **BoardStatus**: Store custom statuses for each board with position, color, and labels
- **Task**: Store tasks with references to boards and statuses, including priority enum

### Key Features
- Foreign key relationships with cascade deletes
- Enum support for task priorities (LOW, MEDIUM, HIGH)
- Automatic timestamps (createdAt, updatedAt)
- Position-based ordering for statuses and tasks

## Development Features

- **Structured Logging**: Winston logger with different log levels
- **Performance Monitoring**: Request timing and performance metrics
- **Security**: Helmet for security headers, rate limiting
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Validation**: Input validation on both frontend and backend
- **Database Optimization**: Prisma ORM with optimized queries

## Future Enhancements

- User authentication and authorization
- Real-time updates with WebSockets
- File attachments for tasks
- Due dates and reminders
- Team collaboration features
- Board templates
- Export/import functionality
- Advanced filtering and search
- Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
