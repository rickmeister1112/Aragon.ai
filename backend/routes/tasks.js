const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// Validation rules for creating tasks
const createTaskValidation = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Status must be todo, in_progress, or done'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('board_id').isInt().withMessage('Board ID must be a valid integer')
];

// Validation rules for updating tasks (all fields optional)
const updateTaskValidation = [
  body('title').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Title must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Status must be todo, in_progress, or done'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('position').optional().isInt().withMessage('Position must be a valid integer')
];

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
  try {
    const [tasks] = await db.execute(`
      SELECT t.*, b.title as board_title 
      FROM tasks t 
      JOIN boards b ON t.board_id = b.id 
      ORDER BY t.position ASC, t.created_at DESC
    `);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// GET /api/tasks/board/:boardId - Get tasks for specific board
router.get('/board/:boardId', async (req, res) => {
  try {
    const [tasks] = await db.execute(
      'SELECT * FROM tasks WHERE board_id = ? ORDER BY position ASC, created_at DESC',
      [req.params.boardId]
    );
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req, res) => {
  try {
    const [tasks] = await db.execute(`
      SELECT t.*, b.title as board_title 
      FROM tasks t 
      JOIN boards b ON t.board_id = b.id 
      WHERE t.id = ?
    `, [req.params.id]);
    
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(tasks[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
});

// POST /api/tasks - Create new task
router.post('/', createTaskValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status, priority, board_id } = req.body;
    
    // Get the next position for this board
    const [positionResult] = await db.execute(
      'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM tasks WHERE board_id = ?',
      [board_id]
    );
    const position = positionResult[0].next_position;

    const [result] = await db.execute(
      'INSERT INTO tasks (title, description, status, priority, board_id, position) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, status || 'todo', priority || 'medium', board_id, position]
    );

    const [newTask] = await db.execute('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(newTask[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', updateTaskValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status, priority, position } = req.body;
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }
    if (position !== undefined) {
      updateFields.push('position = ?');
      updateValues.push(position);
    }

    updateValues.push(req.params.id);

    const [result] = await db.execute(
      `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const [updatedTask] = await db.execute('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json(updatedTask[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
