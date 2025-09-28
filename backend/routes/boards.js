const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// Validation rules
const boardValidation = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
];

// GET /api/boards - Get all boards
router.get('/', async (req, res) => {
  try {
    const [boards] = await db.execute('SELECT * FROM boards ORDER BY created_at DESC');
    res.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ message: 'Error fetching boards' });
  }
});

// GET /api/boards/:id - Get single board
router.get('/:id', async (req, res) => {
  try {
    const [boards] = await db.execute('SELECT * FROM boards WHERE id = ?', [req.params.id]);
    
    if (boards.length === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    res.json(boards[0]);
  } catch (error) {
    console.error('Error fetching board:', error);
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
    const [result] = await db.execute(
      'INSERT INTO boards (title, description) VALUES (?, ?)',
      [title, description]
    );

    const [newBoard] = await db.execute('SELECT * FROM boards WHERE id = ?', [result.insertId]);
    res.status(201).json(newBoard[0]);
  } catch (error) {
    console.error('Error creating board:', error);
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
    const [result] = await db.execute(
      'UPDATE boards SET title = ?, description = ? WHERE id = ?',
      [title, description, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const [updatedBoard] = await db.execute('SELECT * FROM boards WHERE id = ?', [req.params.id]);
    res.json(updatedBoard[0]);
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ message: 'Error updating board' });
  }
});

// DELETE /api/boards/:id - Delete board
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM boards WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ message: 'Error deleting board' });
  }
});

module.exports = router;
