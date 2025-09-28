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

-- Create Board Statuses table for dynamic status management
CREATE TABLE IF NOT EXISTS board_statuses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  board_id INT NOT NULL,
  status_key VARCHAR(50) NOT NULL,
  status_label VARCHAR(100) NOT NULL,
  status_color VARCHAR(7) DEFAULT '#6b7280',
  position INT DEFAULT 0, -- For ordering statuses
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  UNIQUE KEY unique_board_status (board_id, status_key)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  board_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status_key VARCHAR(50) NOT NULL, -- References board_statuses.status_key
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  FOREIGN KEY (board_id, status_key) REFERENCES board_statuses(board_id, status_key) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO boards (title, description) VALUES 
('Project Alpha', 'Main project board for Alpha development'),
('Personal Tasks', 'Personal task management board');

-- Insert default statuses for each board
INSERT INTO board_statuses (board_id, status_key, status_label, status_color, position) VALUES 
(1, 'todo', 'To Do', '#3b82f6', 0),
(1, 'in_progress', 'In Progress', '#8b5cf6', 1),
(1, 'done', 'Done', '#10b981', 2),
(2, 'todo', 'To Do', '#3b82f6', 0),
(2, 'in_progress', 'In Progress', '#8b5cf6', 1),
(2, 'done', 'Done', '#10b981', 2);

INSERT INTO tasks (board_id, title, description, status_key, priority) VALUES 
(1, 'Setup project structure', 'Initialize the project with proper folder structure', 'done', 'high'),
(1, 'Design database schema', 'Create tables for boards and tasks', 'done', 'high'),
(1, 'Implement backend API', 'Create REST API endpoints for CRUD operations', 'in_progress', 'high'),
(1, 'Build frontend components', 'Create React components for boards and tasks', 'todo', 'medium'),
(2, 'Buy groceries', 'Weekly grocery shopping', 'todo', 'low'),
(2, 'Call dentist', 'Schedule annual checkup', 'todo', 'medium');
