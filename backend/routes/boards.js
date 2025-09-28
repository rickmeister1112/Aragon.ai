const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const logger = require('../config/logger');

const router = express.Router();

// Validation rules
const boardValidation = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
];

// GET /api/boards - Get all boards
router.get('/', async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });
    
    logger.info('Boards fetched successfully', { count: boards.length });
    res.json(boards);
  } catch (error) {
    logger.error('Error fetching boards:', error);
    res.status(500).json({ message: 'Error fetching boards' });
  }
});

// GET /api/boards/:id - Get single board
router.get('/:id', async (req, res) => {
  try {
    const board = await prisma.board.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        statuses: {
          orderBy: { position: 'asc' }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    logger.info('Board fetched successfully', { boardId: board.id });
    res.json(board);
  } catch (error) {
    logger.error('Error fetching board:', error);
    res.status(500).json({ message: 'Error fetching board' });
  }
});

// POST /api/boards - Create new board
router.post('/', boardValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    
    // Check for duplicate board name
    const existingBoard = await prisma.board.findFirst({
      where: { title: title.trim() }
    });
    
    if (existingBoard) {
      return res.status(400).json({ 
        error: `Board name "${title}" is already taken. Please choose a unique name for your board.` 
      });
    }
    
    const board = await prisma.board.create({
      data: {
        title,
        description,
        statuses: {
          create: [
            { statusKey: 'todo', statusLabel: 'To Do', statusColor: '#3b82f6', position: 0 },
            { statusKey: 'in_progress', statusLabel: 'In Progress', statusColor: '#8b5cf6', position: 1 },
            { statusKey: 'done', statusLabel: 'Done', statusColor: '#10b981', position: 2 }
          ]
        }
      },
      include: {
        statuses: {
          orderBy: { position: 'asc' }
        }
      }
    });

    logger.info('Board created successfully', { boardId: board.id, title: board.title });
    res.status(201).json(board);
  } catch (error) {
    logger.error('Error creating board:', error);
    res.status(500).json({ message: 'Error creating board' });
  }
});

// PUT /api/boards/:id - Update board
router.put('/:id', boardValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    const boardId = parseInt(req.params.id);
    
    // Check for duplicate board name (excluding current board)
    const existingBoard = await prisma.board.findFirst({
      where: { 
        title: title.trim(),
        id: { not: boardId }
      }
    });
    
    if (existingBoard) {
      return res.status(400).json({ 
        error: `Board name "${title}" is already taken. Please choose a unique name for your board.` 
      });
    }
    
    const board = await prisma.board.update({
      where: { id: parseInt(req.params.id) },
      data: { title, description },
      include: {
        statuses: {
          orderBy: { position: 'asc' }
        }
      }
    });

    logger.info('Board updated successfully', { boardId: board.id });
    res.json(board);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Board not found' });
    }
    logger.error('Error updating board:', error);
    res.status(500).json({ message: 'Error updating board' });
  }
});

// DELETE /api/boards/:id - Delete board
router.delete('/:id', async (req, res) => {
  try {
    await prisma.board.delete({
      where: { id: parseInt(req.params.id) }
    });

    logger.info('Board deleted successfully', { boardId: parseInt(req.params.id) });
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Board not found' });
    }
    logger.error('Error deleting board:', error);
    res.status(500).json({ message: 'Error deleting board' });
  }
});

module.exports = router;
