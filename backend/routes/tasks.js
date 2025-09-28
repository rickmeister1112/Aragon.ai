const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const logger = require('../config/logger');

const router = express.Router();

// Validation rules for creating tasks
const createTaskValidation = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('status_key').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Status key must be less than 50 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be low, medium, or high'),
  body('board_id').isInt().withMessage('Board ID must be a valid integer')
];

// Validation rules for updating tasks (all fields optional)
const updateTaskValidation = [
  body('title').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Title must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('statusKey').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Status key must be less than 50 characters'),
  body('status_key').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Status key must be less than 50 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be low, medium, or high'),
  body('position').optional().isInt().withMessage('Position must be a valid integer')
];

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        board: {
          select: { id: true, title: true }
        },
        boardStatus: {
          select: { statusLabel: true, statusColor: true }
        }
      }
    });
    
    logger.info('Tasks fetched successfully', { count: tasks.length });
    res.json(tasks);
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// GET /api/tasks/board/:boardId - Get tasks for specific board
router.get('/board/:boardId', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { boardId: parseInt(req.params.boardId) },
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        boardStatus: {
          select: { statusLabel: true, statusColor: true }
        }
      }
    });
    
    logger.info('Tasks fetched for board', { boardId: req.params.boardId, count: tasks.length });
    res.json(tasks);
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        board: {
          select: { id: true, title: true }
        },
        boardStatus: {
          select: { statusLabel: true, statusColor: true }
        }
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    logger.info('Task fetched successfully', { taskId: task.id });
    res.json(task);
  } catch (error) {
    logger.error('Error fetching task:', error);
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

    const { title, description, status_key, priority, board_id } = req.body;
    
    // Get the next position for this board
    const maxPosition = await prisma.task.aggregate({
      where: { boardId: parseInt(board_id) },
      _max: { position: true }
    });
    const position = (maxPosition._max.position || 0) + 1;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        statusKey: status_key || 'todo',
        priority: (priority || 'medium').toUpperCase(),
        boardId: parseInt(board_id),
        position: position
      },
      include: {
        board: {
          select: { id: true, title: true }
        },
        boardStatus: {
          select: { statusLabel: true, statusColor: true }
        }
      }
    });

    logger.info('Task created successfully', { taskId: newTask.id, boardId: board_id });
    res.status(201).json(newTask);
  } catch (error) {
    logger.error('Error creating task:', error);
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

    const { title, description, statusKey, status_key, priority, position } = req.body;
    const updateData = {};

    if (title !== undefined && title !== null) updateData.title = title;
    if (description !== undefined && description !== null) updateData.description = description;
    if (statusKey !== undefined && statusKey !== null) updateData.statusKey = statusKey;
    else if (status_key !== undefined && status_key !== null) updateData.statusKey = status_key;
    if (priority !== undefined && priority !== null) updateData.priority = priority.toUpperCase();
    if (position !== undefined && position !== null) updateData.position = position;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
      include: {
        board: {
          select: { id: true, title: true }
        },
        boardStatus: {
          select: { statusLabel: true, statusColor: true }
        }
      }
    });

    logger.info('Task updated successfully', { taskId: req.params.id });
    res.json(updatedTask);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }
    logger.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: parseInt(req.params.id) }
    });
    
    logger.info('Task deleted successfully', { taskId: req.params.id });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }
    logger.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
