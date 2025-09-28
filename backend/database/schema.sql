-- Create database
CREATE DATABASE IF NOT EXISTS aragon_tasks;
USE aragon_tasks;

-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  board_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO boards (title, description) VALUES 
('Project Alpha', 'Main project board for Alpha development'),
('Personal Tasks', 'Personal task management board');

INSERT INTO tasks (board_id, title, description, status, priority) VALUES 
(1, 'Setup project structure', 'Initialize the project with proper folder structure', 'done', 'high'),
(1, 'Design database schema', 'Create tables for boards and tasks', 'done', 'high'),
(1, 'Implement backend API', 'Create REST API endpoints for CRUD operations', 'in_progress', 'high'),
(1, 'Build frontend components', 'Create React components for boards and tasks', 'todo', 'medium'),
(2, 'Buy groceries', 'Weekly grocery shopping', 'todo', 'low'),
(2, 'Call dentist', 'Schedule annual checkup', 'todo', 'medium');
