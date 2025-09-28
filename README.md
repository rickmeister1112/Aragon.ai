# Aragon Task Manager

A full-stack task management application built with React, Node.js, Express, and MySQL.

## Features

- **CRUD Operations**: Create, read, update, and delete boards and tasks
- **Form Validations**: Frontend form validations for creating and editing
- **State Management**: React hooks for state management
- **Interactive Elements**: Hover states and smooth transitions
- **Responsive Design**: Works on desktop and mobile devices
- **Task Status Management**: Move tasks between To Do, In Progress, and Done columns
- **Priority System**: Set task priorities (Low, Medium, High)
- **Modern UI**: Clean and intuitive user interface

## Tech Stack

- **Frontend**: React.js with custom components
- **Backend**: Node.js with Express
- **Database**: MySQL
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
│   │   └── tasks.js
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

3. Or run both simultaneously from the root directory:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

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

## Usage

1. **Create a Board**: Click "New Board" in the sidebar to create a new task board
2. **Add Tasks**: Select a board and click "Add Task" to create new tasks
3. **Manage Tasks**: Edit, delete, or change the status of tasks using the dropdown
4. **Organize**: Tasks are automatically organized into To Do, In Progress, and Done columns

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

✅ **Additional Features**
- Task status management
- Priority system
- Modern UI with smooth transitions
- Error handling
- Loading states
- Confirmation dialogs for destructive actions

## Future Enhancements

- Drag and drop functionality
- User authentication
- Real-time updates
- File attachments
- Due dates and reminders
- Team collaboration features
