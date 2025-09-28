const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// Validation rules for creating statuses
const createStatusValidation = [
  body('status_key').trim().isLength({ min: 1, max: 50 }).withMessage('Status key is required and must be less than 50 characters'),
  body('status_label').trim().isLength({ min: 1, max: 100 }).withMessage('Status label is required and must be less than 100 characters'),
  body('status_color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Status color must be a valid hex color'),
  body('board_id').isInt().withMessage('Board ID must be a valid integer')
];

// Validation rules for updating statuses
const updateStatusValidation = [
  body('status_label').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Status label must be less than 100 characters'),
  body('status_color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Status color must be a valid hex color'),
  body('position').optional().isInt().withMessage('Position must be a valid integer')
];

// GET /api/statuses/board/:boardId - Get all statuses for a board
router.get('/board/:boardId', async (req, res) => {
  try {
    const { boardId } = req.params;
    
    const [statuses] = await db.execute(
      'SELECT * FROM board_statuses WHERE board_id = ? ORDER BY position ASC',
      [boardId]
    );
    
    res.json(statuses);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({ error: 'Error fetching statuses' });
  }
});

// POST /api/statuses - Create new status
router.post('/', createStatusValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { board_id, status_key, status_label, status_color = '#6b7280' } = req.body;

    // Check if status already exists for this board
    const [existing] = await db.execute(
      'SELECT id FROM board_statuses WHERE board_id = ? AND status_key = ?',
      [board_id, status_key]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Status with this key already exists for this board' });
    }

    // Get the next position
    const [maxPosition] = await db.execute(
      'SELECT MAX(position) as max_pos FROM board_statuses WHERE board_id = ?',
      [board_id]
    );
    const position = (maxPosition[0].max_pos || -1) + 1;

    const [result] = await db.execute(
      'INSERT INTO board_statuses (board_id, status_key, status_label, status_color, position) VALUES (?, ?, ?, ?, ?)',
      [board_id, status_key, status_label, status_color, position]
    );

    const [newStatus] = await db.execute(
      'SELECT * FROM board_statuses WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newStatus[0]);
  } catch (error) {
    console.error('Error creating status:', error);
    res.status(500).json({ error: 'Error creating status' });
  }
});

// PUT /api/statuses/:id - Update status
router.put('/:id', updateStatusValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status_label, status_color, position } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (status_label !== undefined) {
      updates.push('status_label = ?');
      values.push(status_label);
    }
    if (status_color !== undefined) {
      updates.push('status_color = ?');
      values.push(status_color);
    }
    if (position !== undefined) {
      updates.push('position = ?');
      values.push(position);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    await db.execute(
      `UPDATE board_statuses SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    const [updatedStatus] = await db.execute(
      'SELECT * FROM board_statuses WHERE id = ?',
      [id]
    );

    if (updatedStatus.length === 0) {
      return res.status(404).json({ error: 'Status not found' });
    }

    res.json(updatedStatus[0]);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Error updating status' });
  }
});

// DELETE /api/statuses/:id - Delete status
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if status exists
    const [status] = await db.execute(
      'SELECT * FROM board_statuses WHERE id = ?',
      [id]
    );

    if (status.length === 0) {
      return res.status(404).json({ error: 'Status not found' });
    }

    // Check if there are tasks using this status
    const [tasks] = await db.execute(
      'SELECT COUNT(*) as count FROM tasks WHERE board_id = ? AND status_key = ?',
      [status[0].board_id, status[0].status_key]
    );

    if (tasks[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete status that has tasks. Please move or delete the tasks first.' 
      });
    }

    await db.execute('DELETE FROM board_statuses WHERE id = ?', [id]);

    res.json({ message: 'Status deleted successfully' });
  } catch (error) {
    console.error('Error deleting status:', error);
    res.status(500).json({ error: 'Error deleting status' });
  }
});

module.exports = router;
