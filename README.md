# Aragon.ai - Task Management System

A full-stack task management application built with React, Node.js, Express, and MySQL featuring dynamic statuses, drag-and-drop functionality, and a modern dark theme.

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
- **Backend**: Node.js with Express
- **Database**: MySQL with dynamic status management
- **API**: RESTful API with proper error handling

## Project Structure

```
Aragon/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── database/
│   │   └── schema.sql
│   ├── routes/
│   │   ├── boards.js
│   │   ├── tasks.js
│   │   └── statuses.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BoardList.js
│   │   │   ├── BoardItem.js
│   │   │   ├── BoardForm.js
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
- MySQL (v8 or higher)
- npm or yarn

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE aragon_tasks;
```

2. Update the database configuration in `backend/config/database.js`:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'aragon_tasks'
};
```

3. Run the schema file to create tables and insert sample data:
```bash
mysql -u your_username -p aragon_tasks < backend/database/schema.sql
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

The application uses a dynamic status system with the following key tables:
- `boards`: Store board information
- `board_statuses`: Store custom statuses for each board
- `tasks`: Store tasks with references to boards and statuses

## Future Enhancements

- User authentication
- Real-time updates
- File attachments
- Due dates and reminders
- Team collaboration features
- Board templates
- Export/import functionality
