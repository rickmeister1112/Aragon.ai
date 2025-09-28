-- Create database indexes for performance optimization
-- This file contains additional indexes for the PostgreSQL database

-- Indexes for boards table
CREATE INDEX IF NOT EXISTS idx_boards_created_at ON boards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_boards_updated_at ON boards(updated_at DESC);

-- Indexes for board_statuses table
CREATE INDEX IF NOT EXISTS idx_board_statuses_board_id ON board_statuses(board_id);
CREATE INDEX IF NOT EXISTS idx_board_statuses_position ON board_statuses(board_id, position);
CREATE INDEX IF NOT EXISTS idx_board_statuses_status_key ON board_statuses(board_id, status_key);

-- Indexes for tasks table
CREATE INDEX IF NOT EXISTS idx_tasks_board_id ON tasks(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status_key ON tasks(board_id, status_key);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(board_id, status_key, position);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at DESC);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_tasks_board_status_position ON tasks(board_id, status_key, position);
CREATE INDEX IF NOT EXISTS idx_tasks_board_priority ON tasks(board_id, priority);

-- Partial indexes for active tasks (optional optimization)
CREATE INDEX IF NOT EXISTS idx_tasks_active ON tasks(board_id, status_key) 
WHERE status_key != 'done';
